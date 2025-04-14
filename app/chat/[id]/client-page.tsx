"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { Message } from "../types";
import { RenderFromPending } from "./render-from-pending";
import SplitText from "@/components/split-text";

const ScrollToBottomButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="fixed bottom-8 left-1/2 -translate-x-1/2 p-3 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 transition-colors border border-gray-700"
    aria-label="Scroll to bottom"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
      <path d="m6 14 6 6 6-6" />
    </svg>
  </button>
);

export default function ClientPage({
  conversationId,
  getMessageReactNode,
  initialMessagesReactNode,
}: {
  conversationId: string;
  getMessageReactNode: (
    conversationId: string,
    message: Message
  ) => Promise<ReactNode>;
  initialMessagesReactNode: ReactNode;
}) {
  const [inputValue, setInputValue] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<ReactNode[]>([
    initialMessagesReactNode,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (inputRef.current) {
      observer.observe(inputRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const element = textareaRef.current;
    element?.addEventListener("keydown", handleKeyDown);

    return () => {
      element?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col">
      <SplitText asChild>
        <div className="flex flex-col gap-4">
          {messages.length === 0 ||
          (Array.isArray(messages[0]) &&
            messages.length === 1 &&
            messages[0].length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Fast Chat
              </h1>
              <div className="text-gray-600 max-w-md mb-8">
                <p>Start a conversation by typing a message below.</p>
                <p>Use Shift + Enter to quickly send messages.</p>
              </div>
            </div>
          ) : (
            messages
          )}
        </div>
      </SplitText>
      {showScrollButton && (
        <ScrollToBottomButton
          onClick={() => {
            inputRef.current?.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              textareaRef.current?.focus();
            }, 500); // Wait for smooth scroll to complete
          }}
        />
      )}
      <form
        ref={formRef}
        action={async () => {
          if (!inputValue.trim()) return;
          const message = { role: "user", content: inputValue } as const;
          const newNode = await getMessageReactNode(conversationId, message);
          setMessages((prev) => [...prev, newNode]);
          setInputValue("");
        }}
      >
        <div ref={inputRef} className="my-4 bg-white">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 pr-12 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type a message... (Shift + Enter to send)"
              rows={3}
            />
            <button
              type="submit"
              className="absolute bottom-3 right-3 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 cursor-pointer transition-colors"
              aria-label="Send message"
            >
              <RenderFromPending
                pendingNode={
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-gray-600 animate-spin" />
                }
                notPendingNode={
                  <svg
                    className="h-4 w-4"
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
                }
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
