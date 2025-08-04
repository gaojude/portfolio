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
    <div className="flex items-start gap-3">
      <div className={`w-3 h-3 rounded-full mt-1.5 transition-colors ${
        isActive 
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md" 
          : "bg-gray-300"
      }`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm line-clamp-2 leading-relaxed transition-colors ${
          isActive ? "text-indigo-700 font-medium" : "text-gray-700"
        }`}>
          {preview || "New conversation"}
        </p>
        {isActive && (
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
              Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
