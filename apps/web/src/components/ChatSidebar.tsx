"use client";

import { useState, useRef } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  function send() {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    streamAssistantMessage([...messages, userMessage]);
  }

  function streamAssistantMessage(chatHistory: Message[]) {
    eventSourceRef.current?.close();

    const es = new EventSource(
      "/api/chat?payload=" +
        encodeURIComponent(
          JSON.stringify({
            messages: chatHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          })
        )
    );

    eventSourceRef.current = es;

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "token") {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];

          if (last?.role === "assistant") {
            last.content += data.content;
          }

          return updated;
        });
      }

      if (data.type === "done") {
        es.close();
      }
    };

    es.onerror = () => {
      es.close();
    };
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-[400px] bg-neutral-900 border-r border-slate-700 flex flex-col z-50">
      {/* Header */}
      <div className="h-12 px-4 flex items-center border-b border-slate-700 text-sm font-medium text-white">
        Adorable Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-neutral-500 text-sm">
            Describe what you are trying to build.
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-200"
              }`}
            >
              {m.content || "…"}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-3">
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build or change…"
          className="w-full resize-none rounded-md bg-neutral-800 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
        />
      </div>
    </div>
  );
}
