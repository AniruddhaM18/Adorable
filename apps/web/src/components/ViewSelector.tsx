"use client";

import { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeSandbox } from "./CodeSandbox";
import { Viewport } from "./ViewPort";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";
import { SlGlobe } from "react-icons/sl";
import { IoMdGlobe } from "react-icons/io";



const backendUrl = NEXT_PUBLIC_BACKEND_URL;


export function ViewSelector({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    fetch(`${backendUrl}/project/${projectId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.project.currentVersion.files);
        setPreviewUrl(data.project.previewUrl);
      });
  }, [projectId]);

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


          <Button className="grad-blue transition-all duration-200 ease-in-out active:scale-98 text-white" size="sm" variant="secondary"
            onClick={() => {
              console.log("Run clicked");
            }}>
            Deploy <IoMdGlobe className="size-5 -mr-1" />
          </Button>
        </div>

        <div className="flex-1 border border-slate-600 rounded-md overflow-hidden mt-2">
          <TabsContent value="code" className="h-full">
            <CodeSandbox files={files} />
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <Viewport url={previewUrl} />
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}
