"use client";

import { useParams } from "next/navigation";

export default function ConversationPreviewClient({
  preview,
  conversationId,
}: {
  conversationId: string;
  preview: string;
}) {
  const { id } = useParams();
  const isActive = id === conversationId;

  return (
    <div
      className={`p-3 rounded-md transition-colors ${
        isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <p className="text-sm truncate">{preview}</p>
    </div>
  );
}
