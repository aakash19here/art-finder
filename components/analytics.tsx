import { db } from "@/lib/db";
import Youtube from "./analytics/youtube";
import { Websites } from "./analytics/websites";
import YoutubeVideo from "./analytics/youtube-video";

export default async function Analytics() {
  const data = await db.contentType.findFirst({
    where: {
      status: "COMPLETED",
    },
  });

  if (!data || !data.summary) {
    return <div>No data found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <h1 className="text-2xl font-bold">Analytics for {data.domain}</h1>
      <p className="text-sm text-gray-500">
        Here is the summary of the content you provided
      </p>
      <div className="flex gap-1 my-5">
        <Youtube summary={data.summary} />
        <YoutubeVideo youtubeAdsResult={data.youtubeData as any} />
      </div>
      <Websites webSearchData={data.webSearchData as any} />
    </div>
  );
}
