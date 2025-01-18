import { inngest } from "../inngest";
import { scrape } from "../tools/firecrawl-scrape";
import { TavilySearch } from "../tools/tavily";
import { ingest } from "../tools/ingest";
import { summarize } from "../tools/summarize";

export const searchContent = inngest.createFunction(
  { id: "search-content" },
  { event: "search/content" },
  async ({ event, step }) => {
    const { userId, contentType } = event.data;

    // Serve for urls and save it to db
    const queries = await TavilySearch(contentType);

    //get the top 2 urls from the queries and pass it to scrape
    const urls = queries.slice(0, 2).map((query) => query.results[0].url);

    // const urls = [
    //   // "https://www.wix.com/blog/web-design-best-practices",
    //   "https://www.pluralsight.com/resources/blog/software-development/web-ux-common-pain-points",
    // ];

    // Scrape the urls
    const { markdown, metadata } = await scrape(urls);

    // Summarize the scrape results and back the result
    const { docs, result } = await summarize(markdown, metadata);

    await ingest(docs, contentType, userId);

    return {
      message: "Content search started",
    };
  }
);
