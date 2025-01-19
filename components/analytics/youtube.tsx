import React from "react";
import { MemoizedReactMarkdown } from "../markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function Youtube({ summary }: { summary: string }) {
  return (
    <div className="max-w-2xl mr-auto mt-0 m-5">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            Here is the summary of the content you provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MemoizedReactMarkdown className="text-sm prose space-y-2 break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
            {summary.slice(0, 300)}
          </MemoizedReactMarkdown>
          <div className="flex justify-center text-5xl text-gray-500">...</div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Read More</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto max-w-2xl">
              <DialogTitle className="hidden" />
              <MemoizedReactMarkdown className="text-sm prose space-y-2 break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                {summary}
              </MemoizedReactMarkdown>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
