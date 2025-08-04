import { getInitialMessagesReactNode, getMessageReactNode } from "./action";
import ClientPage from "./client-page";
import { connection } from "next/server";
import { getConversationById } from "@/app/db/redis";
import { Suspense } from "react";

async function ConversationPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connection();

  const conversation = await getConversationById(id);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return (
    <ClientPage
      conversationId={id}
      getMessageReactNode={getMessageReactNode}
      initialMessagesReactNode={await getInitialMessagesReactNode(id)}
    />
  );
}

const ConversationPageFallback = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-33px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Conversation...
            </h1>
            <div className="h-16 w-16 rounded-full border-8 border-gray-300 border-t-gray-600 animate-spin mb-4" />
          </div>

          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-20 bg-gray-100 rounded-lg w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full border-t border-gray-200 bg-white">
        <div className="p-4">
          <div className="relative">
            <div className="w-full px-3 py-2 pr-12 border border-gray-200 rounded h-24 bg-gray-50"></div>
            <div className="absolute bottom-3 right-3 p-2 bg-blue-300 rounded-full w-8 h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<ConversationPageFallback />}>
      <ConversationPageContent params={params} />
    </Suspense>
  );
}
