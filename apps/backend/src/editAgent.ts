import { z } from "zod";
import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, MessagesAnnotation, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import { OPENROUTER_API_KEY } from "./config.js";
import { getEditSystemPrompt } from "./prompt.js";
import { modifyTool, FileChange } from "./modifyTools.js";
import { chatTool } from "./chatTools.js";

/* Types */

type EditAgentResult =
    | {
        success: true;
        files: FileChange[];
        message?: string;
    }
    | {
        success: false;
        error: string;
    };

/* LLM setup */

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

/* Bind edit-specific tools */
const editLlmWithTools = llm.bindTools([modifyTool, chatTool]);

/* LangGraph for edit agent */

async function editAgentNode(state: typeof MessagesAnnotation.State) {
    const response = await editLlmWithTools.invoke(state.messages);
    return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
    const last = state.messages[state.messages.length - 1] as AIMessage;

    if (!last.tool_calls || last.tool_calls.length === 0) {
        return "__end__";
    }

    return "tools";
}

const editToolNode = new ToolNode([modifyTool, chatTool]);

const editWorkflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", editAgentNode)
    .addNode("tools", editToolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue, {
        tools: "tools",
        __end__: END,
    })
    .addEdge("tools", END);

export const editGraph = editWorkflow.compile();

/* Helper to parse JSON safely */

function safeJsonParse(value: string) {
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

/* Streaming edit execution */

export async function runEditAgentStream(
    currentFiles: Record<string, string>,
    userMessage: string,
    chatHistory: { role: string; content: string }[],
    onEvent: (event: any) => void
) {
    console.log("runEditAgentStream: Starting...");
    const systemPrompt = getEditSystemPrompt(currentFiles);

    const messages = [
        { role: "system", content: systemPrompt },
        ...chatHistory,
        { role: "user", content: userMessage },
    ];

    const stream = await editGraph.stream({ messages }, { recursionLimit: 50 });

    const collectedFiles: FileChange[] = [];

    try {
        for await (const chunk of stream) {
            console.log("runEditAgentStream: Processing chunk...");
            for (const state of Object.values(chunk)) {
                const last = (state as any).messages?.at(-1);
                if (!last) continue;

                if (last instanceof AIMessage && typeof last.content === "string") {
                    onEvent({
                        type: "token",
                        content: last.content,
                    });
                }

                if (last instanceof ToolMessage) {
                    console.log("runEditAgentStream: Got ToolMessage");
                    const content =
                        typeof last.content === "string"
                            ? safeJsonParse(last.content) ?? last.content
                            : last.content;

                    if (content && typeof content === "object") {
                        // Handle modify_app tool results
                        if (Array.isArray((content as any).files)) {
                            console.log(`runEditAgentStream: Found ${(content as any).files.length} files in tool result`);
                            for (const file of (content as any).files) {
                                if (file?.path) {
                                    collectedFiles.push(file);
                                    onEvent({
                                        type: "file_update",
                                        file: file,
                                    });
                                }
                            }
                        }

                        // Handle chat_message tool results
                        if ((content as any).type === "chat" && (content as any).message) {
                            onEvent({
                                type: "token",
                                content: (content as any).message,
                            });
                        }
                    }

                    onEvent({
                        type: "tool",
                        content: last.content,
                    });
                }
            }
        }

        onEvent({
            type: "done",
            files: collectedFiles,
        });

        console.log(`EditAgent finished. Collected ${collectedFiles.length} files:`, collectedFiles.map(f => f.path));

        return collectedFiles;
    } catch (error) {
        console.error("runEditAgentStream error:", error);
        onEvent({
            type: "error",
            message: "Failed to process edit request",
        });
        return [];
    }
}

/* One-shot edit execution (for non-streaming use cases) */

export async function runEditRequest(
    currentFiles: Record<string, string>,
    userMessage: string
): Promise<EditAgentResult> {
    const systemPrompt = getEditSystemPrompt(currentFiles);

    const inputs = {
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
    };

    const finalState = await editGraph.invoke(inputs, {
        recursionLimit: 50,
    });

    const collectedFiles: FileChange[] = [];

    for (const msg of finalState.messages) {
        if (!(msg instanceof ToolMessage)) continue;

        const content =
            typeof msg.content === "string"
                ? safeJsonParse(msg.content) ?? msg.content
                : msg.content;

        if (!content || typeof content !== "object") continue;

        if (Array.isArray((content as any).files)) {
            for (const file of (content as any).files) {
                if (file?.path) {
                    collectedFiles.push(file);
                }
            }
        }
    }

    if (collectedFiles.length === 0) {
        const last = finalState.messages.at(-1);
        return {
            success: false,
            error:
                last instanceof AIMessage
                    ? String(last.content)
                    : "Agent failed to generate changes.",
        };
    }

    return {
        success: true,
        files: collectedFiles,
    };
}
