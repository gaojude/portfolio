import Link from "next/link";
import ConversationPreview from "./conversation-preview";
import {
  deleteConversation,
  deleteAllConversations,
  getConversationsByUser,
} from "@/app/db/redis";
import { RenderFromPending } from "../../[id]/render-from-pending";
import { redirect } from "next/navigation";

interface Conversation {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export default function ConversationList({
  conversations,
}: {
  conversations: Conversation[];
}) {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="group relative">
          <Link
            href={`/chat/conversation/${conversation.id}`}
            className="block"
          >
            <ConversationPreview conversationId={conversation.id} />
          </Link>
          <form
            action={async () => {
              "use server";
              await deleteConversation(conversation.id, conversation.userId);

              // Get remaining conversations
              const remainingConversations = await getConversationsByUser(
                conversation.userId
              );

              // If there are other conversations, redirect to the first one
              if (remainingConversations.length > 0) {
                redirect(`/chat/conversation/${remainingConversations[0].id}`);
              } else {
                // If no conversations left, redirect to /chat
                redirect("/chat");
              }
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              type="submit"
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors"
              title="Delete conversation"
            >
              <RenderFromPending
                pendingNode={
                  <div className="h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                }
                notPendingNode={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
              <span className="sr-only">Delete conversation</span>
            </button>
          </form>
        </div>
      ))}
      {conversations.length > 0 && (
        <form
          action={async () => {
            "use server";
            if (conversations[0]?.userId) {
              await deleteAllConversations(conversations[0].userId);
              redirect("/chat");
            }
          }}
          className="pt-2 border-t border-gray-200"
        >
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <RenderFromPending
              pendingNode={
                <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              }
              notPendingNode={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            Delete All
          </button>
        </form>
      )}
    </div>
  );
}
