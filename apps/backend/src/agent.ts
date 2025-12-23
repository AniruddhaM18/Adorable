import { z } from "zod";
import { createSandbox } from "./sandbox.js"; // Ensure this path is correct
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js";
import { getSystemPrompt } from "./prompt.js";


//type
type SandboxResult = {
  previewUrl: string;
  files: {
    path: string;
    content: string;
  }[];
};


// --- Define the Tool ---
const fileSchema = z.object({
  path: z.string().describe("File path (e.g., src/components/Header.jsx)"),
  content: z.string().describe("Full code content")
});

function normalizeFileContent(content: string): string {
  if (content.includes("\\n")) {
    return content
      .replace(/\\n/g, "\n")
      .replace(/\\"/g, '"');
  }
  return content;
}

const createTool = tool(
  async ({ files }) => {
    console.log("Tool Invoked - Creating Sandbox...");
    console.log("FILES RECEIVED BY TOOL:", JSON.stringify(files, null, 2));

    const normalizedFiles = files.map((f: any) => ({
      path: f.path,
      content: normalizeFileContent(f.content),
    }));

    console.log("NORMALIZED FILES:", JSON.stringify(normalizedFiles.map(f => ({ path: f.path, contentLength: f.content.length })), null, 2));

    const result = await createSandbox(normalizedFiles);

    return {
      previewUrl: result.url,
      files: normalizedFiles,
    };
  },
  {
    name: "create_app",
    schema: z.object({
      files: z.array(fileSchema),
    }),
  }
);


// --- Initialize LLM (OpenRouter) ---
const llm = new ChatOpenAI({
  model: "openai/gpt-4o-mini", // Vendor prefix is important for OpenRouter
  apiKey: OPENROUTER_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
  }
}).bindTools([createTool]);

// --- The Agent Node (With Fix) ---
async function agentNode(state: typeof MessagesAnnotation.State) {
  const response = await llm.invoke(state.messages);

  // OpenRouter tool-call fix
  if (
    !response.tool_calls?.length &&
    response.additional_kwargs.tool_calls?.length
  ) {
    response.tool_calls = response.additional_kwargs.tool_calls.map((tc: any) => ({
      name: tc.function.name,
      args: JSON.parse(tc.function.arguments),
      id: tc.id,
      type: "tool_call",
    }));
  }

  // HARD FAIL if no tool call
  if (!response.tool_calls || response.tool_calls.length === 0) {
    throw new Error("LLM did not call create_app tool");
  }

  return { messages: [response] };
}

// Conditional Logic
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  // Check if the LLM wants to call a tool
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }
  return "__end__";
}

// --- 5. Build the Graph ---
const toolNode = new ToolNode([createTool]);

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue,
    {
      tools: "tools",
      __end__: END
    }
  )
  .addEdge("tools", END); // end here

export const appGraph = workflow.compile();

export async function runUserRequest(userInput: string): Promise<SandboxResult> {
  const systemPrompt = getSystemPrompt();

  const inputs = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
  };

  const finalState = await appGraph.invoke(inputs);

  const lastMessage = finalState.messages[finalState.messages.length - 1];

  if (!lastMessage) {
    throw new Error("No final message found");
  }

  if (typeof lastMessage.content === "string") {
    // If it's not JSON, return a clean error
    try {
      return JSON.parse(lastMessage.content);
    } catch {
      throw new Error(lastMessage.content);
    }
  }
  return lastMessage.content as unknown as SandboxResult;
}
