import { CoreMessage, LanguageModelV1, streamText } from "ai";
import { TOOLS } from "./supported-tools/tools";
import { Message } from "@/app/db/redis";
import { DEFAULT_MODEL } from "@/lib/models";

export const getLlmStream = async (messages: Message[]) => {
  return await streamText({
    model: DEFAULT_MODEL as LanguageModelV1,
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant with access to various tools. Follow these guidelines:
        1. Always use available tools instead of making assumptions or guesses
        2. For time-sensitive information like dates, use [webSearch] to get accurate data
        3. Be precise and factual in your responses
        4. If you're unsure about something, use the appropriate tool to verify information
        5. Maintain a professional and helpful tone while being concise
        6. For LaTex, use $...$ to render inline and $$...$$ to render block, do not use square brackets if possible.`,
      },
      {
        role: "system",
        content: `Current Date: ${new Date().toLocaleDateString()}`,
      },
      ...messages,
    ] as CoreMessage[],
    tools: TOOLS,
  });
};
