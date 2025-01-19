import { inngest } from "../inngest";
import { scrape } from "../tools/firecrawl-scrape";
import { TavilySearch } from "../tools/tavily";
import { ingest } from "../tools/ingest";
import { summarize } from "../tools/summarize";
import { searchTwitter } from "../tools/twitter";

import { youtubeAds } from "../tools/youtube-ads";

import { db } from "../db";
import { revalidatePath } from "next/cache";
export const searchContent = inngest.createFunction(
  { id: "search-content" },
  { event: "search/content" },
  async ({ event }) => {
    const { userId, contentType } = event.data;
    let summaryData = "";

    const content = await db.contentType.create({
      data: {
        userId,
        domain: contentType,
        status: "PENDING",
      },
    });

    revalidatePath("/");

    // Serve for urls and save it to db
    const queries = await TavilySearch(contentType);

    //get the top 2 urls from the queries and pass it to scrape
    const urls = queries.slice(0, 2).map((query) => query.results[0].url);

    // // Scrape the urls
    const { markdown, metadata } = await scrape(urls);

    // // Summarize the scrape results and back the result

    if (markdown === "") {
      console.log("No content found");
    } else {
      const { docs, summary } = await summarize(markdown, metadata);
      await ingest(docs, contentType, userId);
      summaryData = summary;
    }

    const twitterData = await searchTwitter(contentType);

    const youtubeData = await youtubeAds(contentType);

    await db.contentType.update({
      where: { id: content.id },
      data: {
        summary: summaryData,
        webSearchData: queries,
        youtubeData: youtubeData,
        twitterData: twitterData as any,
        status: "COMPLETED",
      },
    });

    return {
      message: "Content search started",
    };
  }
);
