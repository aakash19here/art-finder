import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function summarize(
  markdown: string,
  metadata: Record<string, any>
) {
  // Define prompt
  const prompt = PromptTemplate.fromTemplate(
    "Summarize the main themes in these retrieved docs: {context}"
  );

  const docs = await textSplitter.splitDocuments([
    {
      pageContent: markdown,
      metadata,
    },
  ]);

  const llm = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Instantiate
  const chain = await createStuffDocumentsChain({
    llm: llm,
    outputParser: new StringOutputParser(),
    prompt,
  });

  // Invoke
  const result = await chain.invoke({ context: docs });

  console.log(result);

  return { result, docs };
}
