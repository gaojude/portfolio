"use client";

import { ReactNode, useEffect, useState } from "react";
import { CompleteToolCallPayload, Reminder } from "@/app/db/redis";
import { deleteReminderAction, updateReminderAction } from "./reminder.action";
import { useSaveToolCallResult } from "./tool-call-group/tool-call-context";

interface SearchResult {
  item: Reminder;
  score: number;
}

interface EditReminderDialogProps {
  reminder: Reminder;
  allReminders: Reminder[];
  searchResults: SearchResult[];
  action: "edit" | "delete";
  newContent?: string;
  completeToolCallServerAction: (
    payload: CompleteToolCallPayload
  ) => Promise<ReactNode>;
}

export function EditReminderDialog({
  reminder,
  searchResults,
  action,
  newContent,
  completeToolCallServerAction,
}: EditReminderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [messageCreated, setMessageCreated] = useState(false);
  const { saveToolCallResult, node } = useSaveToolCallResult(
    completeToolCallServerAction
  );

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (action === "delete") {
        await deleteReminderAction(reminder.id);
      } else {
        if (!newContent) {
          throw new Error("New content is required for editing");
        }
        await updateReminderAction(reminder.id, newContent);
      }
      setIsCompleted(true);
    } catch (error) {
      console.error(`Failed to ${action} reminder:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = () => {
    setIsRejected(true);
  };

  useEffect(() => {
    if ((isCompleted || isRejected) && !messageCreated) {
      saveToolCallResult(
        isCompleted
          ? {
              result: "approved",
            }
          : {
              result: "user rejected",
            }
      )
        .then(() => {
          setMessageCreated(true);
        })
        .catch((error) => {
          console.error("Failed to create tool call message:", error);
        });
    }
  }, [isCompleted, isRejected, messageCreated, saveToolCallResult]);

  return (
    <>
      {node}
      {(isCompleted || isRejected) && messageCreated ? (
        <div className="p-4 bg-white rounded-lg shadow border border-blue-100">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">{isCompleted ? "✅" : "❌"}</span>
            <h3 className="text-lg font-semibold">
              {isCompleted ? "Action completed" : "Action rejected"}
            </h3>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-lg shadow border border-blue-100">
          <div className="flex items-center mb-3">
            <span className="text-2xl mr-2">
              {action === "edit" ? "✏️" : "🗑️"}
            </span>
            <h3 className="text-lg font-semibold">
              {action === "edit" ? "Edit Reminder" : "Delete Reminder"}
            </h3>
          </div>

          {/* Show other potential matches if there are any */}
          {searchResults.length > 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Other potential matches:
              </p>
              <div className="space-y-2">
                {searchResults.slice(1).map((result) => (
                  <div
                    key={result.item.id}
                    className="bg-gray-50 p-2 rounded text-sm text-gray-600"
                  >
                    {result.item.content}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-gray-500 mb-1">Current Content</p>
            <p className="font-medium text-gray-800 mb-3">{reminder.content}</p>

            {action === "edit" && newContent && (
              <>
                <p className="text-sm text-gray-500 mb-1">New Content</p>
                <p className="font-medium text-gray-800 mb-3">{newContent}</p>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleReject}
                disabled={isLoading}
                className="px-4 py-2 text-sm rounded-md transition-colors bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  action === "edit"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-red-500 text-white hover:bg-red-600"
                } disabled:opacity-50`}
              >
                {isLoading
                  ? "Processing..."
                  : action === "edit"
                  ? "Confirm Edit"
                  : "Confirm Delete"}
              </button>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Added on {new Date(reminder.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </>
  );
}
