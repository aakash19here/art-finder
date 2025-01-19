import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { tavily } from "@tavily/core";

function sanitizeUrl(url: string): string {
  return url.replace(/\s+/g, "%20");
}

async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return (
      response.ok &&
      (response.headers.get("content-type")?.startsWith("image/") ?? false)
    );
  } catch {
    return false;
  }
}

export async function TavilySearch(contentType: string) {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      prompt: `
        You are an expert in market analysis and content creation.
        You are given a content type and you need to generate 6 queries for the user to search for content about the content type.
        The queries should be specific and relevant to the content type.
        The queries should be in the format of a question.
        Example queries:
        - What are the best practices for ${contentType}?
        - What are the pain points in ${contentType}?
        - How to create a ${contentType}?
        - What are the latest trends in ${contentType}?
        - What are the best tools for ${contentType}?
        - What are the best resources for ${contentType}?
        The content type is ${contentType}.
      `,
      schema: z.object({
        queries: z.array(z.string()),
      }),
    });

    const apiKey = process.env.TAVILY_API_KEY;
    const tvly = tavily({ apiKey });

    // Execute searches in parallel
    const searchPromises = result.object.queries.map(async (query, index) => {
      const data = await tvly.search(query, {
        topic: "general",
        days: 7,
        maxResults: 1,
        searchDepth: "advanced",
        includeAnswer: true,
        includeImages: true,
        includeImageDescriptions: true,
        excludeDomains: [],
      });

      return {
        query,
        results: data.results.map((obj: any) => ({
          url: obj.url as string,
          title: obj.title as string,
          content: obj.content as string,
        })),
        images: true
          ? await Promise.all(
              data.images.map(
                async ({
                  url,
                  description,
                }: {
                  url: string;
                  description?: string;
                }) => {
                  const sanitizedUrl = sanitizeUrl(url);
                  const isValid = await isValidImageUrl(sanitizedUrl);

                  return isValid
                    ? {
                        url: sanitizedUrl,
                        description: description ?? "",
                      }
                    : null;
                }
              )
            ).then((results) =>
              results.filter(
                (image): image is { url: string; description: string } =>
                  image !== null &&
                  typeof image === "object" &&
                  typeof image.description === "string" &&
                  image.description !== ""
              )
            )
          : await Promise.all(
              data.images.map(async ({ url }: { url: string }) => {
                const sanitizedUrl = sanitizeUrl(url);
                return (await isValidImageUrl(sanitizedUrl))
                  ? sanitizedUrl
                  : null;
              })
            ).then((results) =>
              results.filter((url): url is string => url !== null)
            ),
      };
    });

    const results = await Promise.all(searchPromises);

    return results;
  } catch (error) {
    console.error("Error in TavilySearch:", error);
    // Fallback response
    return [
      {
        query: "Fallback query",
        results: [],
        images: [],
      },
    ];
  }
}
