"use client";

import { useState, useEffect } from "react";
import { FaCode } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeSandbox } from "./CodeSandbox";
import { Viewport } from "./ViewPort";
import { Button } from "@/components/ui/button";
import { IoMdGlobe } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";

type ViewSelectorProps = {
  projectId: string;
  files: any;
  previewUrl: string;
  isLoading?: boolean;
};

export function ViewSelector({ projectId, files, previewUrl, isLoading }: ViewSelectorProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);

  // Refresh preview when files change
  useEffect(() => {
    if (files) {
      // Add a small delay to allow HMR to process
      const timer = setTimeout(() => {
        setRefreshKey((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [files]);

  const handleRefreshPreview = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_BACKEND_URL}/project/${projectId}/deploy`,
        {
          method: "POST",
          credentials: "include", // Send cookies for auth
        }
      );

      const data = await response.json();

      if (response.ok && data.url) {
        setDeployedUrl(data.url);
        // Open in new tab
        window.open(data.url, "_blank");
      } else {
        alert(`Deploy failed: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Deploy error:", error);
      alert(`Deploy failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="h-screen bg-neutral-900 pl-[404px] pt-2 pr-2 pb-1">

      <Tabs defaultValue="code" className="flex h-full flex-col w-full">
        <div className="flex items-center justify-between">
          {/* Tabs ONLY */}
          <TabsList className="border border-slate-600 bg-neutral-900">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">
              <FaCode className="mr-1 h-4 w-4" /> Code
            </TabsTrigger>
          </TabsList>


          <div className="flex items-center gap-2">
            {deployedUrl && (
              <a
                href={deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline truncate max-w-[150px]"
              >
                {deployedUrl.replace("https://", "")}
              </a>
            )}
            <Button
              className="bg-neutral-700 hover:bg-neutral-600 text-white"
              size="sm"
              variant="secondary"
              onClick={handleRefreshPreview}
            >
              <IoReload className="size-4" />
            </Button>
            <Button
              className="grad-blue transition-all duration-200 ease-in-out active:scale-98 text-white"
              size="sm"
              variant="secondary"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? "Deploying..." : "Deploy"} <IoMdGlobe className="size-5 -mr-1" />
            </Button>
          </div>
        </div>

        <div className="flex-1 border border-slate-600 rounded-md overflow-hidden mt-2">
          <TabsContent value="code" className="h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-zinc-500">
                Loading project files...
              </div>
            ) : (
              <CodeSandbox files={files} />
            )}
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <Viewport key={refreshKey} url={previewUrl} />
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}

