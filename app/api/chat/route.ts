import { customModel } from "@/lib/ai/rag-middleware";
import { auth } from "@clerk/nextjs/server";

import { convertToCoreMessages, streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();

  const session = await auth();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = streamText({
    model: customModel,
    system: `you are a friendly assistant! keep your responses concise and helpful.
      - Return the response in markdown format.
      - If there is a page number in the response, wrap it in a link markdown tag.
      `,
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse({});
}
