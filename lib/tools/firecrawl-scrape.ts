import { app } from "../firecrawl";

export type ScrapeResult = {
  markdown: string;
};

export async function scrape(urls: string[]) {
  const scrapeResults: ScrapeResult[] = [];
  const sourceUrls: string[] = [];
  const sourceTitles: string[] = [];

  const metadata = {
    sourceUrls,
    sourceTitles,
  };

  for (const url of urls) {
    const result = await app.scrapeUrl(url, {
      formats: ["markdown"],
    });
    if (result.success) {
      scrapeResults.push({
        markdown: result.markdown ?? "",
      });

      sourceUrls.push(url);
      sourceTitles.push(result.title ?? "");
    } else {
      console.log("Error scraping URL", url, result.error);
      return {
        markdown: "",
        metadata: {
          sourceUrls: [],
          sourceTitles: [],
        },
      };
    }
  }

  const markdown = scrapeResults.map((result) => result.markdown).join("\n");

  return {
    markdown,
    metadata,
  };
}
