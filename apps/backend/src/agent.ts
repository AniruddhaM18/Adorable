import { z } from "zod";
import "dotenv/config";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js";
import { getSystemPrompt } from "./prompt.js";
import { chatTool } from "./chatTools.js";

/* Types */

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

/* Helpers */

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

/* create_app tool */

const fileSchema = z.object({
  path: z.string(),
  content: z.string(),
});

const createTool = tool(
  async ({ files }) => {
    console.log("Tool Invoked: create_app");

    if (!Array.isArray(files)) {
      return { files: [] };
    }

    const normalizedFiles = files.map((f: any) => ({
      path: f.path,
      content: normalizeFileContent(f.content),
    }));

    console.log(`Generated ${normalizedFiles.length} files`);

    return {
      files: normalizedFiles,
    };
  },
  {
    name: "create_app",
    description:
      "Generate or modify project files. ALWAYS call this tool to output code.",
    schema: z.object({
      files: z.array(fileSchema),
    }),
  }
);

/* ------------------------------------------------------------------ */
/* LLM */
/* ------------------------------------------------------------------ */

const llm = new ChatOpenAI({
  model: "openai/o4-mini",
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

/* IMPORTANT: bind ALL tools */
const llmWithTools = llm.bindTools([
  createTool,
  chatTool,
]);

/* ------------------------------------------------------------------ */
/* LangGraph */
/* ------------------------------------------------------------------ */

async function agentNode(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke(state.messages);
  return { messages: [response] };
}

/**
 * Decide whether to execute tools or stop.
 * ToolNode will decide WHICH tool to run.
 */
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const last = state.messages[state.messages.length - 1] as AIMessage;

  if (!last.tool_calls || last.tool_calls.length === 0) {
    return "__end__";
  }

  return "tools";
}

/* IMPORTANT: ToolNode MUST know about ALL tools */
const toolNode = new ToolNode([
  createTool,
  chatTool,
]);

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

/* ------------------------------------------------------------------ */
/* One-shot project generation (unchanged behavior) */
/* ------------------------------------------------------------------ */

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

  /* failure */
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

  /* App.jsx fallback */
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

/* ------------------------------------------------------------------ */
/* Streaming execution (SSE) */
/* ------------------------------------------------------------------ */

export async function runAgentStream(
  messages: { role: string; content: string }[],
  onEvent: (event: any) => void
) {
  const stream = await appGraph.stream(
    { messages },
    { recursionLimit: 50 }
  );

  for await (const chunk of stream) {
    for (const state of Object.values(chunk)) {
      const last = state.messages?.at(-1);
      if (!last) continue;

      if (last instanceof AIMessage && typeof last.content === "string") {
        onEvent({
          type: "token",
          content: last.content,
        });
      }

      if (last instanceof ToolMessage) {
        onEvent({
          type: "tool",
          content: last.content,
        });
      }
    }
  }

  onEvent({ type: "done" });
}
