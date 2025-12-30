"use client";
import { CodeXml } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CodeSandbox } from "./CodeSandbox";
import { Viewport } from "./ViewPort";

export function ViewSelector() {
  return (
    // SINGLE place controlling sidebar offset
    <div className="h-screen bg-neutral-900 pl-[400px] pt-12 pr-2 pb-1">
      <Tabs defaultValue="code" className="flex h-full flex-col w-full">
        <TabsList className="border border-slate-600 bg-neutral-900">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">
            <CodeXml className="mr-1 h-4 w-4" /> Code
          </TabsTrigger>
          <TabsTrigger value="cloud">Cloud</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 overflow-hidden">
          <CodeSandbox />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 overflow-hidden">
          <Viewport url="http://anflow.aniruddha.xyz/" />
        </TabsContent>

        <TabsContent
          value="cloud"
          className="flex-1 flex items-center justify-center text-white"
        >
          Cloud
        </TabsContent>
      </Tabs>
    </div>
  );
}
