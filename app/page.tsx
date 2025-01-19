import Analytics from "@/components/analytics";
import { DialogDemo } from "@/components/content-type";
import Status from "@/components/status";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Slack } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const data = await db.contentType.findFirst({
    where: {
      status: {
        in: ["COMPLETED", "PENDING"],
      },
    },
  });

  const isContentTypeAvailable = data?.status === "COMPLETED";

  return (
    <div className="">
      <DialogDemo isContentTypeAvailable={!isContentTypeAvailable} />

      <Status data={data} />

      {isContentTypeAvailable && <Analytics />}

      <Link
        href={"/chat"}
        className={cn(
          buttonVariants({
            className: "absolute bottom-10 p-4 py-6 right-10",
          })
        )}
      >
        Chat with our bot
        <Slack className="size-10" />
      </Link>
    </div>
  );
}
