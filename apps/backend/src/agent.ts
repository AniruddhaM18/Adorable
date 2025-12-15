import { z } from "zod";
import { createSandbox } from "./sandbox.js"; // Ensure this path is correct
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js"; 
import { getSystemPrompt } from "./prompt.js";

// --- 1. Define the Tool ---
const fileSchema = z.object({
    path: z.string().describe("File path (e.g., src/components/Header.jsx)"),
    content: z.string().describe("Full code content")
});

const createTool = tool(
    async ({ files }) => {
        console.log("🛠️ Tool Invoked: Creating Sandbox...");
        try {
            // This runs the actual E2B logic
            const result = await createSandbox(files);
            return `SUCCESS: Sandbox created! Preview URL: ${result.url}`;
        } catch (err: any) {
            console.error(" Tool Error:", err);
            return `Error deploying: ${err.message}`;
        }
    },
    {
        name: "create_app",
        description: "Generates the application, writes files, and returns a live preview URL.",
        schema: z.object({
            files: z.array(fileSchema)
        })
    }
);

// --- 2. Initialize LLM (OpenRouter) ---
const llm = new ChatOpenAI({
    model: "openai/gpt-4o-mini", // Vendor prefix is important for OpenRouter
    apiKey: OPENROUTER_API_KEY,
    temperature: 0,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    }
}).bindTools([createTool]);

// --- 3. The Agent Node (With Fix) ---
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

// --- 4. Conditional Logic ---
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
    .addConditionalEdges(
        "agent",
        shouldContinue,
        {
            tools: "tools",
            __end__: END
        }
    )
    .addEdge("tools", "agent"); // Loop back to agent to report result

export const appGraph = workflow.compile();

export async function runUserRequest(userInput: string){
    const systemPrompt = getSystemPrompt();

    const inputs = {
        messages: [
            {role: "system", content: systemPrompt}, 
            {role: "user", content: userInput}
        ]
    }
    // .invoke() waits for the whole process to finish (instead of stream)
    const finalState = await appGraph.invoke(inputs);

    //get last message from the ai
    const lastMessage = finalState.messages[finalState.messages.length -1];

    return lastMessage.content;

};


