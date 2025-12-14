import { z } from "zod";
import { createSandbox } from "./sandbox.js";
import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { OPENROUTER_API_KEY } from "./config.js";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { getSystemPrompt } from "./prompt.js";

const fileSchema = z.object({
    path: z.string().describe("File path (e.g., src/components/Header.jsx)"),
    content: z.string().describe("Full code content")
});

const createTool = tool(
    async ({ files }) => {
        try {
            const result = await createSandbox(files);
            return `Successfully deployed Preview : ${result.url}`
        } catch (err: any) {
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


//Initialize llm openrouter via chatopenai
const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    }
});


//langgraph toolcalling
async function agentNode(state: typeof MessagesAnnotation.State){
    const response = await llm.invoke(state.messages);
    return {message: [response]};
}

//conditional logic

function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastmessage = state.messages[state.messages.length -1];

    //cast to ai messsage (so ts doesn't throw error)

    const message = lastmessage as AIMessage;

    if(!message.tool_calls?.length){
        return "tools";
    }
    return "_end_";
}

//build graph

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
        _end_ : "__end__"
    }
  )
  .addEdge("tools", "agent");

export const lanGraph = workflow.compile(); 

export async function runUserRequest(userInput: string){
    const systemPrompt = getSystemPrompt();

    const inputs = {
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: userInput}
        ]
    }
    // .invoke() waits for the whole process to finish (instead of stream)
    const finalState = await lanGraph.invoke(inputs);

    //get last message from the ai
    const lastMessage = finalState.messages[finalState.messages.length -1];

    return lastMessage.content;

};


