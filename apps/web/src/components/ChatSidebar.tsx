"use client";

import { useState } from "react";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type ChatSidebarProps = {
  projectId?: string;
  onFilesUpdate?: (files: any) => void;
};

export function ChatSidebar({ projectId, onFilesUpdate }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  async function streamAssistantMessage(chatHistory: Message[]) {
    setIsLoading(true);

    // Use edit endpoint if projectId is provided, otherwise use regular chat
    const endpoint = projectId
      ? `${NEXT_PUBLIC_BACKEND_URL}/api/chat/edit/${projectId}`
      : "/api/chat";

    // Build URL with payload
    const payloadParam = encodeURIComponent(
      JSON.stringify({
        messages: chatHistory.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      })
    );

    const url = `${endpoint}?payload=${payloadParam}`;

    try {
      // Use fetch with credentials to send cookies cross-origin
      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // This sends cookies!
        headers: {
          "Accept": "text/event-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let buffer = "";

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from buffer
        const lines = buffer.split("\n");
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              const data = JSON.parse(jsonStr);
              console.log("SSE event received:", data.type);

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

              // Handle file updates from edit agent
              if (data.type === "file_update" && onFilesUpdate) {
                console.log("File update:", data.file);
              }

              // Handle version created - full files update
              if (data.type === "version_created" && onFilesUpdate) {
                console.log("Version created! Files:", Object.keys(data.files));
                onFilesUpdate(data.files);
              }

              if (data.type === "done") {
                setIsLoading(false);
              }

              if (data.type === "error") {
                setIsLoading(false);
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  if (last?.role === "assistant") {
                    last.content = data.message || "An error occurred.";
                  }
                  return updated;
                });
              }
            } catch (e) {
              // Log JSON parse errors for debugging
              console.error("SSE parse error:", e, "Line:", line.slice(0, 100));
            }
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Stream error:", error);
      setIsLoading(false);
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          last.content = "Failed to connect. Please try again.";
        }
        return updated;
      });
    }
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
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-4 py-3 text-sm ${m.role === "user"
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
