import { inngest } from "@/lib/inngest";
import { contentTypeSchema } from "@/lib/validators/contentType";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// Import our client

// Opt out of caching; every request should send a new event
export const dynamic = "force-dynamic";

// Create a simple async Next.js API route handler
export async function POST(request: Request) {
  // Send your event payload to Inngest

  const body = await request.json();
  const user = await auth();

  if (!user || !user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { domain } = contentTypeSchema.parse(body);

  await inngest.send({
    name: "search/content",
    data: {
      userId: user.userId,
      contentType: domain,
    },
  });

  return NextResponse.json({ message: "Event sent!" });
}
