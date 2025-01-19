import { openai } from "@ai-sdk/openai";
import { experimental_wrapLanguageModel as wrapLanguageModel } from "ai";
import { ragMiddleware } from ".";

export const customModel = wrapLanguageModel({
  model: openai("gpt-4o"),
  middleware: ragMiddleware,
});
