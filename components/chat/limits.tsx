"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getMessage(requests: number) {
  if (requests > 0) {
    return `You have ${requests} remaining requests`;
  } else if (requests === 0) {
    return "You have no requests left , come back tomorrow";
  }
}

export default function Limits() {
  const { data, isPending } = useQuery({
    queryKey: ["limits"],
    queryFn: async () => {
      const { data } = await axios.get<{ requests: number }>("/api/limits");
      return data;
    },
  });

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            className="fixed items-center gap-0 top-3 right-3 md:top-10 md:right-10"
          >
            <Clock className="inline-block mr-2 size-4" />
            <span>{isPending ? "..." : data?.requests}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="mr-5">
          <div className="flex flex-row py-1.5 items-center">
            <span className="inline-block mr-2 size-4">
              <Info className="size-4" />
            </span>
            {getMessage(data?.requests ?? 0)}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
