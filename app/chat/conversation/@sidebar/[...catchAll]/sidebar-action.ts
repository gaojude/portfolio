"use server";

import { getFirstMessageOfConversation } from "@/app/db/redis";

export async function getConversationPreview(conversationId: string) {
  const message = await getFirstMessageOfConversation(conversationId);
  return message?.role === "user" && typeof message?.content === "string"
    ? message.content
    : "New Conversation";
}
