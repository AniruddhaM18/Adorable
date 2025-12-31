"use client";
import { FaCode } from "react-icons/fa";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeSandbox } from "./CodeSandbox";
import { Viewport } from "./ViewPort";

export function ViewSelector() {
  return (
    <div className="h-screen bg-neutral-900 pl-[404px] pt-2 pr-2 pb-1">
      <Tabs defaultValue="code" className="flex h-full flex-col w-full">
        <TabsList className="border border-slate-600 bg-neutral-900">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">
            <FaCode className="mr-1 h-4 w-4" /> Code
          </TabsTrigger>
          <TabsTrigger value="cloud">Cloud</TabsTrigger>
        </TabsList>

        <div className="flex-1 border border-slate-600 rounded-md overflow-hidden mt-2">
          <TabsContent value="code" className="h-full">
            <CodeSandbox />
          </TabsContent>

          <TabsContent value="preview" className="h-full">
            <Viewport url="http://anflow.aniruddha.xyz/" />
          </TabsContent>

          <TabsContent
            value="cloud"
            className="h-full flex items-center justify-center text-white"
          >
            Cloud
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
