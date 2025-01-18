"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddContentType } from "@/lib/api/mutation";
import { useState } from "react";

export function DialogDemo({
  isContentTypeAvailable,
}: {
  isContentTypeAvailable: boolean;
}) {
  const { mutate: addContentType, isPending } = useAddContentType();
  const [contentType, setContentType] = useState<string>("");
  return (
    <Dialog defaultOpen={true}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Content Type</DialogTitle>
          <DialogDescription>
            Tell us about the content you are planning to create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Domain
            </Label>
            <Input
              onChange={(e) => setContentType(e.target.value)}
              value={contentType}
              id="name"
              placeholder="e.g. Podcast, Marketing , Web Design"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => addContentType({ domain: contentType })}
            type="submit"
            disabled={isPending || !contentType}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
