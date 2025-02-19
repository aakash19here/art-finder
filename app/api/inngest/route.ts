import { searchContent } from "@/lib/functions/search";
import { inngest } from "@/lib/inngest";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    searchContent,
  ],
});
