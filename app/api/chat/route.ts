
import OpenAI from "openai";
import systemPrompt from "@/prompts/system";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/"
});

export const runtime = "edge";

interface ChatMessage {
  content: string;
  sender: "user" | "bot";
}

export async function POST(req: Request) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    const historyMessages = conversationHistory.map((msg: ChatMessage) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const messages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ];

    // Create streaming completion
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages,
      stream: true,
    });

    // STREAMING FIX — Return a stream, not JSON
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const token = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(new TextEncoder().encode(token));
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      }
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Error processing chat request", { status: 500 });
  }
}


