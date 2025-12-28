import { z } from "zod";
import "dotenv/config";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js";
import { getSystemPrompt } from "./prompt.js";

// types
type AgentResult = {
  files: {
    path: string;
    content: string;
  }[];
  projectName?: string;
};

// define the tool
const fileSchema = z.object({
  path: z.string().describe("File path (e.g., src/components/Header.jsx)"),
  content: z.string().describe("Full code content"),
});

function normalizeFileContent(content: string): string {
  if (content.includes("\\n")) {
    return content.replace(/\\n/g, "\n").replace(/\\"/g, '"');
  }
  return content;
}

const createTool = tool(
  async ({ files }) => {
    console.log("🛠️ Tool Invoked - Generating Files...");

    const normalizedFiles = files.map((f: any) => ({
      path: f.path,
      content: normalizeFileContent(f.content),
    }));

    // --- SAFETY CHECK (Debugging only) ---
    const createdPaths = new Set(normalizedFiles.map((f) => f.path));

    normalizedFiles.forEach((file) => {
      const localImportRegex = /from\s+["']\.\/components\/([^"']+)["']/g;
      const matches = file.content.matchAll(localImportRegex);

      for (const match of matches) {
        const componentName = match[1];
        const expectedPath = `src/components/${componentName}.jsx`;

        if (!createdPaths.has(expectedPath) && !createdPaths.has(`src/components/${componentName}.js`)) {
          console.warn(`⚠️ WARNING: File ${file.path} imports '${componentName}' but '${expectedPath}' was not generated!`);
        }
      }
    });

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

//llm init
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

//better but 10 times more expensive - 
// llm init
// const llm = new ChatOpenAI({
//   // Update the model string to Anthropic's latest Opus
//   model: "anthropic/claude-4.5-opus", 
//   apiKey: OPENROUTER_API_KEY,
//   temperature: 0,
//   configuration: {
//     baseURL: "https://openrouter.ai/api/v1",
//     defaultHeaders: {
//       "HTTP-Referer": "http://localhost:3000",
//       "X-Title": "Adorable",
//     },
//   },
// });

// Bind tools to the LLM
const llmWithTools = llm.bindTools([createTool]);

console.log("OPENROUTER_API_KEY:", process.env.OPENROUTER_API_KEY?.slice(0, 6));

// agent nodee
async function agentNode(state: typeof MessagesAnnotation.State) {
  const response = await llmWithTools.invoke(state.messages);
  return {
    messages: [response],
  };
}

// conditional logic
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

//  Build the Graph
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

//  Main Execution Function (LangSmith Integrated)
// ... (keep all imports and graph setup the same)

export async function runUserRequest(userInput: string): Promise<AgentResult> {
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

  const mergedFilesMap = new Map<string, { path: string; content: string }>();
  let projectName: string | undefined;

  for (const msg of finalState.messages) {
    if (msg instanceof ToolMessage) {
      try {
        const result = JSON.parse(msg.content as string);

        if (result.projectName && typeof result.projectName === "string") {
          projectName = result.projectName;
        }

        if (result.files && Array.isArray(result.files)) {
          for (const file of result.files) {
            mergedFilesMap.set(file.path, file);
          }
        }
      } catch (err) {
        console.error("Failed to parse a ToolMessage:", err);
      }
    }
  }

  const allFiles = Array.from(mergedFilesMap.values());

  if (allFiles.length === 0) {
    const lastMessage = finalState.messages.at(-1);
    if (lastMessage instanceof AIMessage) {
      throw new Error(`Agent failed to generate code. Response: ${lastMessage.content}`);
    }
    throw new Error("Tool executed but generated 0 files.");
  }

  const hasAppJsx = allFiles.some(f => f.path === "src/App.jsx");
  const mainComponent = allFiles.find(f => f.path.startsWith("src/components/"));

  if (!hasAppJsx && mainComponent) {
    console.log("Agent forgot to wire App.jsx. Applying Auto-Wiring fix...");

    const componentName = mainComponent.path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "");

    if (componentName) {
      const autoAppContent = `
import React from "react";
import ${componentName} from "./components/${componentName}";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <${componentName} />
    </div>
  );
}
      `;

      allFiles.push({
        path: "src/App.jsx",
        content: autoAppContent,
      });
    }
  }

  // ALWAYS infer name after files are finalized
  if (!projectName && mainComponent) {
    projectName = mainComponent.path
      .split("/")
      .pop()
      ?.replace(/\.\w+$/, "")
      ?.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  projectName ??= "Untitled Project";

  return {
    files: allFiles,
    projectName,
  };
}
