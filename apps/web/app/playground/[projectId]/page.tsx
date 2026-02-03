"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { ChatSidebar } from "@/src/components/ChatSidebar";
import { ViewSelector } from "@/src/components/ViewSelector";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";

function PlaygroundContent() {
  const params = useParams<{ projectId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  // "creating" is a special value meaning we need to create the project first
  const urlProjectId = params.projectId;
  const isCreatingMode = urlProjectId === "creating";

  const [actualProjectId, setActualProjectId] = useState<string | null>(
    isCreatingMode ? null : urlProjectId
  );
  const [files, setFiles] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(!isCreatingMode);
  const [isCreating, setIsCreating] = useState(isCreatingMode);
  const [error, setError] = useState<string | null>(null);

  // Create project when in creating mode
  useEffect(() => {
    if (!isCreatingMode) return;

    const prompt = searchParams.get("prompt");
    if (!prompt) {
      router.push("/");
      return;
    }

    const createProject = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/project/create`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (res.status === 401) {
          router.push("/auth/signup");
          return;
        }

        const data = await res.json();

        if (!res.ok || data.success !== true) {
          setError(data.message ?? "Failed to create project");
          setIsCreating(false);
          return;
        }

        // Redirect to actual project page
        router.replace(`/playground/${data.projectId}`);
      } catch (err) {
        console.error("Create error:", err);
        setError("Network error");
        setIsCreating(false);
      }
    };

    createProject();
  }, [isCreatingMode, searchParams, router]);

  // Fetch project data only when we have a real projectId
  useEffect(() => {
    if (!actualProjectId || isCreating) return;

    setIsLoading(true);
    fetch(`${NEXT_PUBLIC_BACKEND_URL}/project/${actualProjectId}`, {
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
  }, [actualProjectId, isCreating]);

  const handleFilesUpdate = (newFiles: any) => {
    setFiles(newFiles);
  };

  if (error) {
    return (
      <div className="h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ChatSidebar
        projectId={actualProjectId || "creating"}
        onFilesUpdate={handleFilesUpdate}
      />
      <ViewSelector
        projectId={actualProjectId || "creating"}
        files={files}
        previewUrl={previewUrl}
        isLoading={isLoading}
        isCreating={isCreating}
      />
    </div>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-neutral-900" />}>
      <PlaygroundContent />
    </Suspense>
  );
}
