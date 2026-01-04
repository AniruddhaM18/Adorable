"use client";

import { useParams } from "next/navigation";
import { ChatSidebar } from "@/src/components/ChatSidebar";
import { ViewSelector } from "@/src/components/ViewSelector";

export default function PlaygroundPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) return null;

  return (
    <div>
      <ChatSidebar />
      <ViewSelector projectId={projectId} />
    </div>
  );
}
