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
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <p className="text-sm text-gray-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="group relative">
          <Link
            href={`/chat/conversation/${conversation.id}`}
            className="block p-3 rounded-xl bg-white/60 hover:bg-white border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200"
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
            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              type="submit"
              className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete conversation"
            >
              <RenderFromPending
                pendingNode={
                  <div className="h-3 w-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                }
                notPendingNode={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
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
        <div className="pt-4 border-t border-gray-200/60">
          <form
            action={async () => {
              "use server";
              if (conversations[0]?.userId) {
                await deleteAllConversations(conversations[0].userId);
                redirect("/chat");
              }
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors"
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
              Clear All Chats
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
