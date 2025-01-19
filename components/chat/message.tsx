"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "lucide-react";
import { ReactNode } from "react";
import { Markdown } from "./markdown";

export const Message = ({
  role,
  content,
}: {
  role: string;
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full max-w-xl md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[32px] rounded-md flex flex-col border border-accent-foreground/10 bg-secondary text-primary justify-center items-center flex-shrink-0">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>{content as string}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};
