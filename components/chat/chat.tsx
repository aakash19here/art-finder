"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import { Loader2, SendIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Icons } from "./icons";
import { Message } from "./message";
import { useChat } from "ai/react";
import { useScrollToBottom } from "./use-scroll-to-bottom";

const suggestedQuestions = [
  {
    title: "Ask questions related",
    label: "What given in the context ? ",
    action: "What given in the context ?",
  },
];

const socials = [
  {
    title: "View source",
    icon: Icons.Github,
    link: process.env.NEXT_PUBLIC_GITHUB_REPO,
  },
  {
    title: "Watch Demo",
    icon: Icons.Youtube,
    link: process.env.NEXT_PUBLIC_YOUTUBE_VIDEO,
  },
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const { messages, isLoading, handleSubmit, input, setInput, append } =
    useChat();

  const [messagesEndRef, containerRef] = useScrollToBottom<HTMLDivElement>();

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-row justify-center pb-10 md:pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between items-center gap-4">
        <div
          className="flex flex-col gap-4 h-full w-dvw items-center overflow-y-scroll"
          ref={containerRef}
        >
          {messages.map((message, index) => (
            <Message
              key={`${index}`}
              role={message.role}
              content={message.content}
            />
          ))}
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          <div
            className="flex-shrink-0 min-w-[24px] min-h-[24px]"
            ref={messagesEndRef}
          />
        </div>

        <div className="grid sm:grid-cols-1 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-xl">
          {messages.length === 0 &&
            suggestedQuestions.map((question, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={() => {
                    append({
                      role: "user",
                      content: question.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{question.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {question.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-row gap-2 relative items-center w-full md:max-w-xl max-w-[calc(100dvw-32px) px-4 md:px-0"
        >
          <input
            className="bg-zinc-100 rounded-md px-2 py-1.5 flex-1 outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300"
            placeholder="Send a message..."
            name="message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <button className="bg-blue-500 text-white rounded-md px-2 py-1.5">
            <SendIcon />
          </button>
        </form>
        <div className="grid grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-xl">
          {socials.map((social, index) => (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.09 * index }}
              key={index}
            >
              <button className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col">
                <a
                  target="_blank"
                  href={social.link}
                  className="flex w-full text-xs md:text-sm justify-between flex-row items-center gap-2"
                >
                  {social.title}
                  <social.icon className=" size-3.5 md:size-4" />
                </a>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
