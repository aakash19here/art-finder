import { ApifyClient } from "apify-client";

export type YoutubeAdsResult = {
  title: string;
  type: string;
  id: string;
  url: string;
  thumbnailUrl: string;
  viewCount: number;
  date: string;
  likes: number;
  location: string;
  channelName: string;
  channelUrl: string;
  channelId: string;
  channelUsername: string;
  numberOfSubscribers: number;
  duration: string;
  commentsCount: number;
  text: string;
  hashtags: string[];
};

export async function youtubeAds(contentType: string) {
  const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
  });
  const input = {
    searchQueries: [contentType],
    maxResults: 5,
    maxResultsShorts: 0,
    maxResultStreams: 0,
    startUrls: [],
  };

  const run = await client.actor("h7sDV53CddomktSi5").call(input);

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  return items as YoutubeAdsResult[];
}
