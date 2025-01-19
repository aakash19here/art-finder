import { YoutubeAdsResult } from "@/lib/tools/youtube-ads";
import Image from "next/image";
import React from "react";
import { Card } from "../ui/card";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function YoutubeVideo({
  youtubeAdsResult,
}: {
  youtubeAdsResult: YoutubeAdsResult[];
}) {
  return (
    <Card className="flex flex-col max-h-[42vh] overflow-y-auto">
      {youtubeAdsResult.map((video, i) => (
        <div
          className="flex gap-10 items-center justify-around p-5 w-[800px] my-2"
          key={i}
        >
          <Image
            src={video.thumbnailUrl}
            alt="thumbanil"
            width={200}
            height={200}
          />

          <div className="flex flex-col gap-2 w-9/12">
            <h1 className="font-semibold">
              <Link href={video.url} target="_blank">
                {video.title}
              </Link>
            </h1>
            <div className="flex gap-5">
              <p className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />:{video.commentsCount}
              </p>
              <p className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" />:{video.likes}
              </p>
              <p className="flex items-center gap-2">
                <Eye className="h-4 w-4" />:{video.viewCount}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
}
