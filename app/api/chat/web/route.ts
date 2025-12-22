// app/api/chat/web/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import systemPrompt from "@/prompts/system";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/",
});

export const runtime = "edge";

interface ChatMessage {
  content: string;
  sender: "user" | "bot";
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing 'message' in request body" },
        { status: 400 }
      );
    }

    // 1) Tavily search WITH images
    const tavilyRes = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: message,
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
        include_images: true,
        include_image_descriptions: true,
      }),
    });

    if (!tavilyRes.ok) {
      const text = await tavilyRes.text();
      console.error("Tavily error:", tavilyRes.status, text);
      return NextResponse.json({ error: "Search API failed" }, { status: 500 });
    }

    const tavilyData = await tavilyRes.json();

    const results = (tavilyData.results || []).map((r: any, idx: number) => ({
      id: idx + 1,
      title: r.title as string,
      url: r.url as string,
      content: r.content as string,
    }));

    // Top-level images (adjust if your response shape is different)
    const images =
      (tavilyData.images || []).map((img: any) => ({
        url: img.url as string,
        sourceUrl: img.source || img.page_url || "",
        title: img.title || img.alt || "",
      })) ?? [];

    const webResultsText =
      results
        .map(
          (r: any) =>
            `[${r.id}] ${r.title}\nURL: ${r.url}\nCONTENT: ${r.content}\n`
        )
        .join("\n") || "No web results found.";

    const webRules = `
You are a helpful assistant with access to live web search results.

You are given WEB RESULTS with IDs like [1], [2], etc.

Rules:
- Use the WEB RESULTS to answer the USER QUESTION.
- When you use information from a result, cite it inline like [1], [2].
- The number must match the result ID.
- Only use IDs that exist in WEB RESULTS.
- If web results are not helpful, say so and fall back to general knowledge.
- Do NOT invent URLs or sources.
`;

    const historyMessages = (conversationHistory as ChatMessage[]).map(
      (msg) => ({
        role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: msg.content,
      })
    );

    const messages = [
      {
        role: "system" as const,
        content: systemPrompt + "\n\n" + webRules,
      },
      ...historyMessages,
      {
        role: "user" as const,
        content: `USER QUESTION:\n${message}\n\nWEB RESULTS:\n${webResultsText}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      messages,
      stream: false,
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't answer.";

    return NextResponse.json({
      answer,
      sources: results,
      images,
    });
  } catch (error) {
    console.error("Web Chat API error:", error);
    return NextResponse.json(
      { error: "Error processing web chat request" },
      { status: 500 }
    );
  }
}
