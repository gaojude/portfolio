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
    <div className="w-64 border-r border-gray-200 bg-white h-[calc(100vh-60px)] overflow-y-auto hidden md:block">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="pl-2 text-lg font-semibold text-gray-900">
            Conversations
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
            <div>
              <button
                type="submit"
                className="p-1 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A154B] transition-all duration-200 border border-gray-900 grid place-items-center"
                title="New Conversation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
              </button>
            </div>
          </form>
        </div>
        <Conversations />
      </div>
    </div>
  );
}
