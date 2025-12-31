"use client";

import { ChatSidebar } from "@/src/components/ChatSidebar";
import { ViewSelector } from "@/src/components/ViewSelector";

export default function PlayGround() {
  return (
    <>
      {/* Fixed chat sidebar */}
      <ChatSidebar />
      {/* Main content already offsets itself with pl-[400px] */}
      <ViewSelector />
    </>
  );
}
