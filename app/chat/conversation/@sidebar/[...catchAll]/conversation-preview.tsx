import ConversationPreviewClient from "./conversation-preview.client";
import { getConversationPreview } from "./sidebar-action";

export default async function ConversationPreview({
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
