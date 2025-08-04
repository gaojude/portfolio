"use server";

import { createNotes } from "@/app/db/redis";
import { CoreMessage, Message, generateText, streamText } from "ai";
import { DEFAULT_MODEL } from "@/lib/models";

export type Phase = "zero-to-one" | "one-to-many";

export const getNextMessage = async (
  messages: Message[],
  party: "asker" | "responder",
  phase: Phase
) => {
  console.log({
    phase,
  });

  const allMessages = [
    phase === "zero-to-one"
      ? {
          role: "system",
          content:
            party === "asker"
              ? `We're writing a document. This is the initial brainstorming phase. Your job now is to ask for clarifying questions so that you're crystal clear on the topic. One question at a time.`
              : `Just make up answers for any question you have no context for.`,
        }
      : {
          role: "system",
          content:
            party === "asker"
              ? "You're asking for help from your co-worker about the feedback you've received on the draft from your employer. Focus on specific aspects that need improvement and ask targeted questions to move forward. Avoid repeating what's already been discussed. Always end your response with a question to keep the conversation going and push for deeper improvements."
              : "You're helping your co-worker with their draft and employer feedback. Provide concrete suggestions and actionable advice. Push the conversation forward by building on previous points rather than rehashing them. Challenge assumptions and explore new angles. Always end your response with a question to ensure continuous improvement.",
        },
    ...messages,
  ] as CoreMessage[];

  const stream = await generateText({
    // TODO: responder neeeds to be Gemini 2.5 flash with Google Search grounding
    model: DEFAULT_MODEL,
    messages: allMessages,
  });

  return stream.text;
};

export const getDraftFromMessages = async (messages: Message[]) => {
  const { textStream } = await streamText({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: `You are a document writer. Based on the brainstorming conversation, create a markdown document. 
        Include relevant sections, headers, and formatting. Make sure to incorporate all the key points discussed.
        The document should be clear, professional, and ready for review.
        Return ONLY the document in valid Markdown syntax. No other text, or footer.`,
      },
      {
        role: "user",
        content: messages
          .map(
            (message) =>
              `${message.role === "assistant" ? "A" : "B"}: ${message.content}`
          )
          .join("\n"),
      },
    ] as CoreMessage[],
  });

  return textStream;
};

export const shareDraft = async (markdown: string): Promise<{ id: string }> => {
  const notes = await createNotes(markdown);
  return { id: notes.id };
};
