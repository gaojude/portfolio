import { z } from "zod";
import { createNotes, getMessagesByConversation } from "@/app/db/redis";
import { ExecuteFunction } from "../tools";
import { generateObject } from "ai";
import { DEFAULT_MODEL } from "@/lib/models";
import Link from "next/link";
import { headers } from "next/headers";

/**
 * Example interaction:
 * User: "Can you summarize this conversation and share it as markdown?"
 * AI: [Uses message-summary tool to generate and share a markdown document]
 */

// Parameter Schema
const paramsSchema = z.object({});

export type ParamsType = z.infer<typeof paramsSchema>;

// Tool Specifications
export const specs = {
  description:
    "Generate notes. Generates sharable notes from the current conversation",
  parameters: paramsSchema,
};

// Execute Function
export const execute: ExecuteFunction<ParamsType> = async ({
  completeToolCallRsc,
  conversationId,
}) => {
  try {
    const messages = await getMessagesByConversation(conversationId);
    const stringifiedMessages = messages
      .filter((message) => {
        return (
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
        );
      })
      .map((message) => {
        return `<${message.role}>${message.content}</${message.role}>`;
      })
      .join("\n");

    const { object } = await generateObject({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content: `Generate notes from provided conversation. Aim to include all important details`,
        },
        {
          role: "user",
          content: stringifiedMessages,
        },
      ],
      schema: z.object({
        markdown: z.string().describe("The generated markdown notes"),
      }),
    });

    const notes = await createNotes(object.markdown);

    const url = `https://${(await headers()).get("host")}/chat/notes/${
      notes.id
    }`;

    const node = await completeToolCallRsc({ url });

    return (
      <div>
        <h2>Conversation Summary</h2>
        <div>
          <Link href={url}>View Notes</Link>
        </div>
        {node}
      </div>
    );
  } catch (error) {
    console.error("Error generating message summary:", error);
    return (
      <div className="p-4 border rounded-md bg-red-900 text-white">
        Error generating summary. Please try again.
      </div>
    );
  }
};
