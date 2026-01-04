import { z } from "zod";
import "dotenv/config";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js";
import { getSystemPrompt } from "./prompt.js";

/* =========================
   Types
========================= */

type GeneratedFile = {
  path: string;
  content: string;
};

type AgentResult =
  | {
      success: true;
      files: GeneratedFile[];
      projectName: string;
    }
  | {
      success: false;
      error: string;
    };

/* =========================
   Utils
========================= */

function normalizeFileContent(content: string): string {
  if (typeof content !== "string") return "";
  if (content.includes("\\n")) {
    return content.replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }
  return content;
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/* =========================
   Tool Definition
========================= */

const fileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

const createTool = tool(
  async ({ files }) => {
    console.log("🛠️ Tool Invoked - Generating Files...");

    if (!Array.isArray(files)) {
      return { files: [] };
    }

    const normalizedFiles = files.map((f: any) => ({
      path: f.path,
      content: normalizeFileContent(f.content),
    }));

    console.log(`Generated ${normalizedFiles.length} files.`);

    return {
      files: normalizedFiles,
    };
  },
  {
    name: "create_app",
    description: "Generate or modify project files. ALWAYS call this tool to output code.",
    schema: z.object({
      files: z.array(fileSchema),
    }),
  }
);

/* =========================
   LLM Setup
========================= */

const llm = new ChatOpenAI({
  model: "openai/gpt-4o-mini",
  apiKey: OPENROUTER_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Adorable",
    },
  },
});

const llmWithTools = llm.bindTools([createTool]);

/* =========================
   Agent Graph
========================= */

async function agentNode(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const last = state.messages[state.messages.length - 1] as AIMessage;
  return last.tool_calls?.length ? "tools" : "__end__";
}

const toolNode = new ToolNode([createTool]);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    __end__: END,
  })
  .addEdge("tools", END);

export const appGraph = workflow.compile();

/* =========================
   Main Executor
========================= */

export async function runUserRequest(
  userInput: string
): Promise<AgentResult> {
  const systemPrompt = getSystemPrompt();

  const inputs = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
  };

  const finalState = await appGraph.invoke(inputs, {
    recursionLimit: 50,
  });

  const mergedFiles = new Map<string, GeneratedFile>();
  let projectName: string | undefined;

  for (const msg of finalState.messages) {
    if (!(msg instanceof ToolMessage)) continue;

    const content =
      typeof msg.content === "string"
        ? safeJsonParse(msg.content) ?? msg.content
        : msg.content;

    if (!content || typeof content !== "object") continue;

    if (Array.isArray((content as any).files)) {
      for (const file of (content as any).files) {
        if (file?.path && file?.content) {
          mergedFiles.set(file.path, file);
        }
      }
    }

    if (typeof (content as any).projectName === "string") {
      projectName = (content as any).projectName;
    }
  }

  const allFiles = Array.from(mergedFiles.values());

  /* =========================
     Graceful Failure (NO THROW)
  ========================= */

  if (allFiles.length === 0) {
    const last = finalState.messages.at(-1);
    return {
      success: false,
      error:
        last instanceof AIMessage
          ? String(last.content)
          : "Agent failed to generate files.",
    };
  }

  /* =========================
     Auto-wire App.jsx if missing
  ========================= */

  const hasApp = allFiles.some((f) => f.path === "src/App.jsx");
  const mainComponent = allFiles.find((f) =>
    f.path.startsWith("src/components/")
  );

  if (!hasApp && mainComponent) {
    const componentName = mainComponent.path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "");

    if (componentName) {
      allFiles.push({
        path: "src/App.jsx",
        content: `
import React from "react";
import ${componentName} from "./components/${componentName}";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <${componentName} />
    </div>
  );
}
        `.trim(),
      });
    }
  }

  if (!projectName && mainComponent) {
    projectName =
      mainComponent.path
        .split("/")
        .pop()
        ?.replace(/\.\w+$/, "")
        ?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? "Untitled Project";
  }

  return {
    success: true,
    files: allFiles,
    projectName: projectName ?? "Untitled Project",
  };
}
