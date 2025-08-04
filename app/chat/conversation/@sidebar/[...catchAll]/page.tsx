import { auth } from "@clerk/nextjs/server";
import { getConversationsByUser, createConversation } from "@/app/db/redis";
import ConversationList from "./conversations-list";
import { redirect } from "next/navigation";

async function Conversations() {
  const { userId } = await auth();
  if (!userId) return null;

  const conversations = await getConversationsByUser(userId);
  return <ConversationList conversations={conversations} />;
}

export default function Page() {
  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto hidden md:block">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
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
            Chats
          </h2>
          <form
            action={async () => {
              "use server";
              const { userId } = await auth();
              if (!userId) return;
              const conversation = await createConversation({ userId });
              redirect(`/chat/conversation/${conversation.id}`);
            }}
          >
            <button
              type="submit"
              className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              title="New Conversation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 4v12M4 10h12" />
              </svg>
            </button>
          </form>
        </div>
        <Conversations />
      </div>
    </div>
  );
}
