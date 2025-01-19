import Exa from "exa-js";

const exa = new Exa(process.env.EXA_API_KEY as string);

interface XResult {
  id: string;
  url: string;
  title: string;
  author?: string;
  publishedDate?: string;
  text: string;
  highlights?: string[];
  tweetId: string;
}

export async function searchTwitter(query: string) {
  try {
    const result = await exa.searchAndContents(query, {
      type: "keyword",
      numResults: 5,
      text: true,
      highlights: true,
      includeDomains: ["twitter.com", "x.com"],
    });

    console.log("RESULT", result);

    // Extract tweet ID from URL
    const extractTweetId = (url: string): string | null => {
      const match = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/);
      return match ? match[1] : null;
    };

    // Process and filter results
    const processedResults = result.results.reduce<Array<XResult>>(
      (acc, post) => {
        const tweetId = extractTweetId(post.url);
        if (tweetId) {
          acc.push({
            ...post,
            tweetId,
            title: post.title || "",
          });
        }
        return acc;
      },
      []
    );

    console.log("PROCESSED RESULTS", processedResults);

    return processedResults as XResult[];
  } catch (error) {
    console.error("X search error:", error);
    return [];
  }
}
