"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import { RenderFromPending } from "./render-from-pending";
import { type getMessageReactNode as getMessageReactNodeType } from "./action";
import { NewResponseProvider } from "./get-new-response-context";
import FullHeightContainer from "@/app/components/full-height-container";

export default function ClientPage({
  conversationId,
  getMessageReactNode,
  initialMessagesReactNode,
}: {
  conversationId: string;
  getMessageReactNode: typeof getMessageReactNodeType;
  initialMessagesReactNode: ReactNode;
}) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [initialPromptProcessed, setInitialPromptProcessed] = useState(false);

  const [messages, setMessages] = useState<ReactNode[]>([
    initialMessagesReactNode,
  ]);
  const bottomOfPageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
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

  useEffect(() => {
    const handleInitialPrompt = async () => {
      if (initialPromptProcessed) return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const initialPrompt = urlParams.get('prompt');
      
      if (initialPrompt?.trim()) {
        setInitialPromptProcessed(true);
        
        // Clean the URL by removing the prompt parameter
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('prompt');
        window.history.replaceState({}, '', newUrl.toString());
        
        // Send the initial prompt as the first message
        const newNode = await getMessageReactNode(conversationId, initialPrompt);
        setMessages((prev) => [...prev, newNode]);
        bottomOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setInitialPromptProcessed(true);
      }
    };

    handleInitialPrompt();
  }, [conversationId, getMessageReactNode, initialPromptProcessed]);

  return (
    <NewResponseProvider
      triggerNewResponse={async () => {
        const newNode = await getMessageReactNode(conversationId, null);
        setMessages((prev) => [...prev, newNode]);
      }}
    >
      <FullHeightContainer offset={60}>
        <div className="flex flex-col h-full bg-gradient-to-br from-gray-50/50 via-white to-indigo-50/30">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[min(100vw,55rem)]">
              {messages.length === 0 ||
              (Array.isArray(messages[0]) &&
                messages.length === 1 &&
                messages[0].length === 0) ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="w-20 h-20 mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-indigo-600"
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
                  <h1 className="text-3xl font-bold text-gradient mb-4">
                    Ready to Chat
                  </h1>
                  <div className="text-gray-600 max-w-lg mb-8">
                    <p className="text-lg leading-relaxed">
                      Start a conversation and explore ideas with AI assistance. 
                      Ask questions, get help with tasks, or just have a thoughtful discussion.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600">
                      💡 Ask for help
                    </div>
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600">
                      🤔 Explore ideas
                    </div>
                    <div className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 text-sm text-gray-600">
                      📚 Learn something new
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 sm:p-8">
                    <div className="prose prose-lg max-w-none">
                      {messages}
                    </div>
                  </div>
                  <div className="h-[30vh]" />
                  <div ref={bottomOfPageRef} />
                </>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-md">
            <form
              ref={formRef}
              action={async () => {
                if (!inputValue.trim()) return;
                const newNode = await getMessageReactNode(
                  conversationId,
                  inputValue
                );
                setMessages((prev) => [...prev, newNode]);
                setInputValue("");
                bottomOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <div
                ref={inputRef}
                className="mx-auto w-full max-w-[min(100vw,55rem)] p-4 sm:p-6"
              >
                <div className="flex items-end gap-2">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message here..."
                    className="input-modern resize-none min-h-[3rem] flex-1"
                    rows={2}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="flex-shrink-0 p-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:hover:transform-none"
                    aria-label="Send message"
                  >
                    <RenderFromPending
                      pendingNode={
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      }
                      notPendingNode={
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
                      }
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </FullHeightContainer>
    </NewResponseProvider>
  );
}
