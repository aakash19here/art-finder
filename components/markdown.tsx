import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";
import { type FC, memo } from "react";
import ReactMarkdown, { type Options } from "react-markdown";

import { Button } from "./ui/button";

export const MemoizedReactMarkdown: FC<Options> = memo(
  (props) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p({ children }) {
          return <p className="mb-4 last:mb-0">{children}</p>;
        },
      }}
      className={cn("prose w-full text-sm text-foreground", props.className)}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
);
MemoizedReactMarkdown.displayName = "MemoizedReactMarkdown";
