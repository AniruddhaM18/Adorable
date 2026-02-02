"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/src/components/ChatSidebar";
import { ViewSelector } from "@/src/components/ViewSelector";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";

export default function PlaygroundPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [files, setFiles] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial project data
  useEffect(() => {
    if (!projectId) return;

    setIsLoading(true);
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/project/${projectId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.project?.currentVersion?.files) {
          setFiles(data.project.currentVersion.files);
        }
        if (data.project?.previewUrl) {
          setPreviewUrl(data.project.previewUrl);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch project:", err);
        setIsLoading(false);
      });
  }, [projectId]);

  // Handler for file updates from chat
  const handleFilesUpdate = (newFiles: any) => {
    setFiles(newFiles);
    // Optionally refresh the preview iframe
    // The preview should auto-refresh via HMR, but we can force it if needed
  };

  if (!projectId) return null;

  return (
    <div>
      <ChatSidebar
        projectId={projectId}
        onFilesUpdate={handleFilesUpdate}
      />
      <ViewSelector
        projectId={projectId}
        files={files}
        previewUrl={previewUrl}
        isLoading={isLoading}
      />
    </div>
  );
}

