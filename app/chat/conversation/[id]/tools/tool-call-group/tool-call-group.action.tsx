"use server";

import {
  completeToolCall,
  CompleteToolCallPayload,
  createMessage,
} from "@/app/db/redis";
import { GetNewResponse } from "../../get-new-response-context";

export const completeToolCallServerAction = async (
  payload: CompleteToolCallPayload
) => {
  const { conversationId, toolCallResults } = await completeToolCall(payload);

  const allDone = toolCallResults.every((r) => r.$completed);
  if (!allDone) {
    return null;
  }
  await createMessage({
    conversationId,
    aiMessage: {
      role: "tool",
      content: toolCallResults.map((result) => {
        const { $completed, ...rest } = result;
        void $completed;
        return rest;
      }),
    },
  });

  return <GetNewResponse />;
};
