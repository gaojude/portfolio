import { redirect } from "next/navigation";
import { SpinnerInForm } from "./conversation/[id]/spinner";
import Link from "next/link";
import { Suspense } from "react";
import { revalidatePath } from "next/cache";
import { RenderFromPending } from "./conversation/[id]/render-from-pending";
import { auth } from "@clerk/nextjs/server";
import {
  createConversation,
  deleteConversation,
  getConversationsByUser,
  getFirstMessageOfConversation,
  getUserInformation,
  deleteUserInformation,
  deleteAllConversations,
} from "../db/redis";

async function PageContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/chat/login");
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <NewChat userId={userId} />

        <Suspense fallback={<ConversationsLoadingSkeleton />}>
          <ListConversations userId={userId} />
        </Suspense>

        <Suspense fallback={<PersonalContextLoadingSkeleton />}>
          <PersonalContext />
        </Suspense>
      </div>
    </div>
  );
}

const ChatPageFallback = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="h-12 bg-gray-200 rounded-lg w-80 mx-auto mb-3 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="flex justify-center mb-8">
            <div className="h-12 bg-gray-200 rounded-xl w-48 animate-pulse"></div>
          </div>
        </div>
        <ConversationsLoadingSkeleton />
        <PersonalContextLoadingSkeleton />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <PageContent />
    </Suspense>
  );
}

const NewChat = ({ userId }: { userId: string }) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-3">
          AI Conversations
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Start meaningful conversations and explore ideas with AI assistance
        </p>
      </div>

      <div className="flex flex-col items-center gap-4 mb-8">
        <form
          action={async (formData: FormData) => {
            "use server";
            const initialPrompt = formData.get("prompt") as string;
            const conversation = await createConversation({ userId });
            
            if (initialPrompt?.trim()) {
              redirect(`/chat/conversation/${conversation.id}?prompt=${encodeURIComponent(initialPrompt)}`);
            } else {
              redirect(`/chat/conversation/${conversation.id}`);
            }
          }}
          className="w-full max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <input
              name="prompt"
              type="text"
              placeholder="Type your message and press Enter to start chatting..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all duration-200"
              autoFocus
            />
            <button
              type="submit"
              className="flex-shrink-0 p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Start chat"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span className="ml-1">
                <SpinnerInForm />
              </span>
            </button>
          </div>
        </form>

        <Suspense fallback={null}>
          <ClearAllButton userId={userId} />
        </Suspense>
      </div>
    </div>
  );
};

const ClearAllButton = async ({ userId }: { userId: string }) => {
  const conversations = await getConversationsByUser(userId);

  if (conversations.length === 0) {
    return null;
  }

  return (
    <form
      action={async () => {
        "use server";
        await deleteAllConversations(userId);
        revalidatePath("/chat");
      }}
    >
      <button type="submit" className="button-danger flex items-center gap-2">
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
        Clear All
        <span className="ml-1">
          <SpinnerInForm />
        </span>
      </button>
    </form>
  );
};

const PersonalContext = async () => {
  const userInfo = await getUserInformation();

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Personal Context
      </h2>

      {userInfo.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No personal context yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Share information about yourself to help AI provide more
            personalized responses
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userInfo.map((info, index) => (
            <div key={index} className="group relative card-modern p-5">
              <p className="text-sm text-gray-700 leading-relaxed pr-8">
                {info}
              </p>
              <form
                action={async () => {
                  "use server";
                  await deleteUserInformation(info);
                  revalidatePath("/chat");
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  type="submit"
                  className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete information"
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
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ListConversations = async ({ userId }: { userId: string }) => {
  const conversations = await getConversationsByUser(userId);

  if (conversations.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-indigo-600"
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start your first conversation and explore the possibilities of AI
          assistance
        </p>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Recent Conversations
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conversations.map((conversation) => (
          <div key={conversation.id} className="conversation-item">
            <Link
              href={`/chat/conversation/${conversation.id}`}
              className="block"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <Suspense
                    fallback={
                      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    }
                  >
                    <ConversationPreview conversationId={conversation.id} />
                  </Suspense>
                  <p className="text-xs text-gray-500 font-mono">
                    {conversation.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </Link>
            <form
              action={async () => {
                "use server";
                await deleteConversation(conversation.id, userId);
                revalidatePath("/chat");
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                type="submit"
                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConversationsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="block p-4 bg-white rounded-md border border-gray-200 animate-pulse"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ConversationPreview = async ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const message = await getFirstMessageOfConversation(conversationId);
  if (message?.role !== "user" || typeof message?.content !== "string") {
    return (
      <p className="text-sm font-medium text-gray-600 italic">
        New Conversation
      </p>
    );
  }
  return (
    <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed mb-1">
      {message?.content || "New Conversation"}
    </p>
  );
};

const PersonalContextLoadingSkeleton = () => {
  return (
    <div className="mb-8 mt-8">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
};
