"use client";

import { useState, useRef } from "react";
import Brainstorm from "./brainstorm";
import { Message } from "ai";
import Draft from "./draft";
import Feedback from "./feedback";

type AgentState = "brainstorm" | "draft" | "feedback";

export default function AgentPage() {
  const [currentState, setCurrentState] = useState<AgentState>("brainstorm");
  const [brainstormMessages, setBrainstormMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState<string>("");
  const brainstormRef = useRef<HTMLDivElement>(null);
  const draftRef = useRef<HTMLDivElement>(null);

  const onBrainStormEnd = (messages: Message[]) => {
    setBrainstormMessages(messages);
    setCurrentState("draft");
    draftRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onDraftComplete = (draftContent: string) => {
    if (currentState === "brainstorm") {
      return;
    }
    setDraft(draftContent);
    setCurrentState("feedback");
  };

  const onFeedbackComplete = (feedback: string) => {
    setBrainstormMessages([
      {
        id: Date.now().toString(),
        role: "system",
        content: `Here's the draft:\n\n${draft}\n\n`,
      },
      {
        id: Date.now().toString(),
        role: "system",
        content: `Here is the feedback from your employer: ${feedback}`,
      },
    ]);
    setCurrentState("brainstorm");
    brainstormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Agent</h1>
        <div className="text-sm text-gray-600">
          Current State:{" "}
          <span className="font-semibold capitalize">{currentState}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {/* Brainstorm Section */}
        <div
          ref={brainstormRef}
          className={`bg-white rounded-lg shadow-md p-6 border-2 ${
            currentState === "brainstorm"
              ? "border-[#4A154B]"
              : "border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Brainstorm</h2>
          {currentState === "brainstorm" ? (
            <Brainstorm
              initialBrainstormMessages={brainstormMessages}
              onBrainstormEnd={onBrainStormEnd}
            />
          ) : (
            <div className="h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Brainstorm will appear here...</p>
            </div>
          )}
        </div>

        {/* Draft Section */}
        <div
          ref={draftRef}
          className={`bg-white rounded-lg shadow-md p-6 ${
            currentState === "draft"
              ? "border-2 border-[#4A154B]"
              : currentState === "feedback"
              ? "border-2 border-gray-200"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Draft</h2>
          {currentState === "draft" || currentState === "feedback" ? (
            <Draft
              messages={brainstormMessages}
              onDraftComplete={onDraftComplete}
            />
          ) : (
            <div className="h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Draft will appear here...</p>
            </div>
          )}
        </div>

        {/* Feedback Section */}
        <div
          className={`bg-white rounded-lg shadow-md p-6 ${
            currentState === "feedback"
              ? "border-2 border-[#4A154B]"
              : "opacity-50 pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">Feedback</h2>
          {currentState === "feedback" ? (
            <Feedback draft={draft} onFeedbackComplete={onFeedbackComplete} />
          ) : (
            <div className="h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Get feedback here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
