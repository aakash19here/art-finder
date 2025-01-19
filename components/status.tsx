import { ContentType } from "@prisma/client";
import { Loader2 } from "lucide-react";
import React from "react";

export default function Status({ data }: { data: ContentType | null }) {
  if (!data) return null;

  return (
    <>
      {data.status === "PENDING" && (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Content Type</h1>
          <p className="text-sm text-gray-500">{data?.domain}</p>

          <Loader2 className="animate-spin mx-auto size-10" />
        </div>
      )}
    </>
  );
}
