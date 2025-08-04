"use server";

import { streamText } from "ai";
import { DEFAULT_MODEL } from "@/lib/models";

export async function* getQueryFollowUp(query: string, userPrompt: string) {
  const reader = await (
    await streamText({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `You're an English teacher. The student wants to ask you a follow-up question about the following dictionary entry: ${query}`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    }).textStream
  ).getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield value;
  }
}
