import { openai } from "@ai-sdk/openai";
import { auth } from "@clerk/nextjs/server";

import {
  embed,
  Experimental_LanguageModelV1Middleware,
  generateObject,
  generateText,
} from "ai";
import { index } from "../vector";

export const ragMiddleware: Experimental_LanguageModelV1Middleware = {
  transformParams: async ({ params }) => {
    const session = await auth();

    if (!session || !session.userId) return params; // no user session

    const { prompt: messages } = params;

    const recentMessage = messages.pop();

    if (!recentMessage || recentMessage.role !== "user") {
      if (recentMessage) {
        messages.push(recentMessage);
      }

      return params;
    }

    const lastUserMessageContent = recentMessage.content
      .filter((content) => content.type === "text")
      .map((content) => content.text)
      .join("\n");

    // Classify the user prompt as whether it requires more context or not
    const { object: classification } = await generateObject({
      // fast model for classification:
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      output: "enum",
      enum: ["question", "statement", "other"],
      system: "classify the user message as a question, statement, or other",
      prompt: lastUserMessageContent,
    });

    console.log("classification", classification);
    // only use RAG for questions
    if (classification !== "question") {
      messages.push(recentMessage);
      return params;
    }

    // Use hypothetical document embeddings:
    const { text: hypotheticalAnswer } = await generateText({
      // fast model for generating hypothetical answer:
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      system: "Answer the users question:",
      prompt: lastUserMessageContent,
    });

    // Embed the hypothetical answer
    const { embedding: hypotheticalAnswerEmbedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: hypotheticalAnswer,
    });

    type Metadata = {
      fileUrl: string;
      loc: {
        pageNumber: number;
        lines: {
          from: number;
          to: number;
        };
      };
    };

    const namespace = index.namespace(session.userId);

    const topChunks = await namespace.query<Metadata>({
      topK: 5,
      vector: hypotheticalAnswerEmbedding,
      includeMetadata: true,
      includeData: true,
    });

    console.log("topChunks", topChunks);

    // add the chunks to the last user message
    messages.push({
      role: "user",
      content: [
        ...recentMessage.content,
        {
          type: "text",
          text: "Here is some relevant information that you can use to answer the question:",
        },
        ...topChunks.map((chunk) => ({
          type: "text" as const,
          text: `Content: ${chunk?.data}`,
        })),
      ],
    });

    return { ...params, prompt: messages };
  },
};
