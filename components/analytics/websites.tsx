"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AnyARecord } from "dns";
import { Calendar, ExternalLink, Globe } from "lucide-react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

type Data = Array<{
  query: string;
  results: Array<{
    url: string;
    title: string;
    content: string;
  }>;
  images: Array<
    | string
    | {
        url: string;
        description: string;
      }
  >;
}>;

export function Websites({ webSearchData }: { webSearchData: Data }) {
  return (
    <div className="w-full px-5 mr-auto space-y-4">
      <Accordion
        type="single"
        collapsible
        defaultValue="search"
        className="w-full"
      >
        <AccordionItem value="search" className="border-none">
          <AccordionTrigger
            className={cn(
              "p-4 bg-white dark:bg-neutral-900 rounded-xl hover:no-underline border border-neutral-200 dark:border-neutral-800 shadow-sm",
              "[&[data-state=open]]:rounded-b-none"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Globe className="h-4 w-4 text-neutral-500" />
              </div>
              <div>
                <h2 className="font-medium text-left">Web Search</h2>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="mt-0 pt-0 border-0">
            <div className="py-3 px-4 bg-white dark:bg-neutral-900 rounded-b-xl border-t-0 border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {/* Query badges */}
              <div className="flex overflow-x-auto gap-2 mb-3 no-scrollbar pb-1">
                {webSearchData.map((data) =>
                  data.results.map((result) => (
                    <Badge
                      key={result.url}
                      variant="secondary"
                      className="px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex-shrink-0"
                    >
                      {result.title}
                    </Badge>
                  ))
                )}
              </div>

              {/* Horizontal scrolling results */}
              <div className="flex overflow-x-auto gap-3 no-scrollbar">
                {webSearchData.map((data) =>
                  data.results.map((result, resultIndex) => (
                    <div key={`${data.query}-${resultIndex}`}>
                      <ResultCard result={result} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Images section outside accordion */}
    </div>
  );
}

const ResultCard = ({ result }: { result: any }) => (
  <div className="w-[300px] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
    <div className="p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
          <img
            src={`https://www.google.com/s2/favicons?sz=128&domain=${
              new URL(result.url).hostname
            }`}
            alt=""
            className="w-6 h-6 object-contain"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cline x1='12' y1='8' x2='12' y2='16'/%3E%3Cline x1='8' y1='12' x2='16' y2='12'/%3E%3C/svg%3E";
            }}
          />
        </div>
        <div>
          <h3 className="font-medium text-sm line-clamp-1">{result.title}</h3>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center gap-1"
          >
            {new URL(result.url).hostname}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-3">
        {result.content}
      </p>

      {result.published_date && (
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <time className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {new Date(result.published_date).toLocaleDateString()}
          </time>
        </div>
      )}
    </div>
  </div>
);
