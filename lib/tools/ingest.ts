import { Document } from "@langchain/core/documents";
import { index } from "../vector";

import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

export async function ingest(
  docs: Document<Record<string, any>>[],
  query: string,
  userId: string
) {
  try {
    //change the way of ingestion

    const namespace = index.namespace(userId);

    const { embeddings } = await embedMany({
      model: openai.embedding("text-embedding-3-small"),
      values: docs.map((doc) => doc.pageContent),
    });

    await Promise.all(
      docs.map((chunk, id) => {
        namespace.upsert({
          id: `${query}-${id}`,
          vector: embeddings[id] ?? [],
          data: chunk.pageContent,
          metadata: {
            query,
            sourceUrls: chunk.metadata.sourceUrls.map((url: string) => url),
          },
        });
      })
    );

    console.log("INGESTED");
  } catch (e) {
    console.log("ERROR INGESTING");
    console.log(e);
  }
}
