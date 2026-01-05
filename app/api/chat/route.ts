import { convertToModelMessages, streamText, tool } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { db } from "@/lib/db";
import { MessageRole, MessageType } from "@/prisma/generated/enums";
import { NextRequest } from "next/server";
import { CHAT_SYSTEM_PROMPT, WEB_SEARCH_SYSTEM_PROMPT } from "@/lib/prompt";
import { ChatMode } from "@/prisma/generated/enums";

export const runtime = "nodejs";

const provider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

function convertStoredMessageToUI(msg: {
  id: string;
  content: string;
  messageRole: string;
  createdAt: Date;
}) {
  try {
    const parts = JSON.parse(msg.content);

    const validParts = parts.filter((part: { type: string }) => {
      return part.type === "text";
    });

    if (validParts.length === 0) {
      return null;
    }

    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: validParts,
      createdAt: msg.createdAt,
    };
  } catch (e) {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [{ type: "text", text: msg.content }],
      createdAt: msg.createdAt,
    };
  }
}
export { convertStoredMessageToUI };

function extractPartsAsJSON(message: any) {
  if (message.parts && Array.isArray(message.parts)) {
    return JSON.stringify(message.parts);
  }

  const content = message.content || "";
  return JSON.stringify([{ type: "text", text: content }]);
}

async function runTavilySearch(query: string) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
      include_raw_content: false,
      include_images: true,
      include_image_descriptions: true,
    }),
  });

  if (!res.ok) {
    throw new Error("Tavily search failed");
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const {
      chatId,
      messages: newMessages,
      model,
      skipUserMessage,
    } = await req.json();

    const chat = chatId
      ? await db.chat.findUnique({
          where: { id: chatId },
          select: { mode: true },
        })
      : null;

    const isResearchMode = chat?.mode === ChatMode.RESEARCH;

    const previousMessages = chatId
      ? await db.message.findMany({
          where: { chatId },
          orderBy: { createdAt: "asc" },
        })
      : [];

    const uiMessages = previousMessages
      .map(convertStoredMessageToUI)
      .filter((msg) => msg !== null); // Remove invalid messages

    const normalizedNewMessages = Array.isArray(newMessages)
      ? newMessages
      : [newMessages];

    console.log("📊 Previous messages:", uiMessages.length);
    console.log("📊 New messages:", normalizedNewMessages.length);

    // ✅ FIXED: Combine messages properly
    const allUIMessages = [...uiMessages, ...normalizedNewMessages];
    let modelMessages;
    try {
      modelMessages = convertToModelMessages(allUIMessages);
      console.log("✅ Converted to model messages:", modelMessages.length);
    } catch (conversionError) {
      console.error("❌ Message conversion error:", conversionError);

      modelMessages = allUIMessages
        .map((msg) => ({
          role: msg.role,
          content: msg.parts
            .filter((p: { type: string; text?: string }) => p.type === "text")
            .map((p: { type: string; text: string }) => p.text)
            .join("\n"),
        }))
        .filter((m) => m.content); // Remove empty messages

      console.log("⚠️ Using fallback conversion:", modelMessages.length);
    }

    // console.log("🤖 Final model messages:", JSON.stringify(modelMessages, null, 2));

    let webContext = "";
    let webSources: { id: number; title: string; url: string }[] = [];
    let webImages: { url: string; source: string; title?: string }[] = [];

    if (isResearchMode) {
      const lastUserMessage =
        normalizedNewMessages[normalizedNewMessages.length - 1];

      const query = lastUserMessage?.parts
        ?.filter((p: any) => p.type === "text")
        ?.map((p: any) => p.text)
        ?.join(" ");

      if (query) {
        const tavilyData = await runTavilySearch(query);

        webSources =
          (tavilyData.results || []).map((r: any, i: number) => ({
            id: i + 1,
            title: r.title,
            url: r.url,
          })) || [];

        webImages = (tavilyData.images || []).slice(0, 6).map((img: any) => ({
          url: img.url,
          source: img.source || img.page_url,
          title: img.title || "",
        }));

        webContext = `WEB RESULTS:${(tavilyData.results || [])
          .map(
            (r: any, i: number) =>
              `[${i + 1}] TITLE: ${r.title}
                SNIPPET: ${r.content.split(" ").slice(0, 120).join(" ")}`
          )
          .join("\n\n")}`;
      }
    }

    const safeModel = model.includes(":free")
      ? "google/gemini-2.5-flash"
      : model;

    const maxTokens = isResearchMode ? 2048 : 1024;

    //  FIXED: Proper streamText configuration
    const result = streamText({
      model: provider.chat(safeModel, {
        extraBody: {
          max_tokens: 1024, // FORCE the limit here in snake_case
        },
      }),
      messages: modelMessages,
      maxOutputTokens: 1024,
      // maxTokens: 2048,
      system: `${CHAT_SYSTEM_PROMPT}
      ${
        isResearchMode
          ? `${WEB_SEARCH_SYSTEM_PROMPT}${webContext}`
          : ""
      }`,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      originalMessages: allUIMessages,
      onFinish: async ({ responseMessage }) => {
        try {
          const messagesToSave = [];

          if (!skipUserMessage) {
            const latestUserMessage =
              normalizedNewMessages[normalizedNewMessages.length - 1];

            if (latestUserMessage?.role === "user") {
              const userPartsJSON = extractPartsAsJSON(latestUserMessage);

              messagesToSave.push({
                chatId,
                content: userPartsJSON,
                messageRole: MessageRole.USER,
                model,
                messageType: MessageType.NORMAL,
              });
            }
          }

          // Save assistant response
          if (responseMessage?.parts && responseMessage.parts.length > 0) {
            const assistantPartsJSON = extractPartsAsJSON(responseMessage);

            messagesToSave.push({
              chatId,
              content: assistantPartsJSON,
              messageRole: MessageRole.ASSISTANT,
              model,
              messageType: MessageType.NORMAL,
              metadata: {
                sources: webSources,
                images: webImages,
              },
            });
          }

          if (messagesToSave.length > 0) {
            await db.message.createMany({
              data: messagesToSave,
            });
          }
        } catch (error) {
          console.error("❌ Error saving messages:", error);
        }
      },
    });
  } catch (error: any) {
    console.error("❌ API Route Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error",
        details: error.toString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
