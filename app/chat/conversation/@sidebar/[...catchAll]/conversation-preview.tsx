import ConversationPreviewClient from "./conversation-preview.client";
import { getConversationPreview } from "./sidebar-action";
import { Suspense } from "react";

async function ConversationPreviewContent({
  conversationId,
}: {
  conversationId: string;
}) {
  const preview = await getConversationPreview(conversationId);
  return (
    <ConversationPreviewClient
      conversationId={conversationId}
      preview={preview}
    />
  );
}

const ConversationPreviewFallback = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

export default function ConversationPreview({
  conversationId,
}: {
  conversationId: string;
}) {
  return (
    <Suspense fallback={<ConversationPreviewFallback />}>
      <ConversationPreviewContent conversationId={conversationId} />
    </Suspense>
  );
}
