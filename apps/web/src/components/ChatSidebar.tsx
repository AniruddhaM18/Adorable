"use client";
import { useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: input },
      {
        id: Date.now() + 1,
        role: "assistant",
        content: "Working on this...",
      },
    ]);

    setInput("");
  }

  return (
    <div
      className="
        fixed left-0 top-0 h-screen w-[400px]
        bg-neutral-900 border-r border-slate-700
        flex flex-col z-50
      "
    >
      <div className="h-12 px-4 flex items-center border-b border-slate-700 text-sm font-medium text-white">
        Adorable Chat
      </div>

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
              className={`max-w-[90%] rounded-lg px-4 py-3 text-sm
              ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-neutral-800 text-neutral-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="border-t border-slate-700 p-3"
      >
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe what you want to build or change…"
          className="
            w-full resize-none rounded-md
            bg-neutral-800 p-2 text-sm text-white
            focus:outline-none focus:ring-1 focus:ring-blue-600
          "
        />
      </form>
    </div>
  );
}
