"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, use } from "react";
import ChatInput from "@/components/ui/ChatInput";
import Messages from "@/components/chat/messages";
import { useStream } from "@/hooks/useStream";

interface Source {
  id: number;
  title: string;
  url: string;
  content: string;
}

interface ImageResult {
  url: string;
  sourceUrl?: string;
  title?: string;
}

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
  mode?: "chat" | "research";
  sources?: Source[];
  images?: ImageResult[];
  loading?: boolean;
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = use(params);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q");
  console.log(initialQuery);
  

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const hasRunRef = useRef(false);
  const [mode, setMode] = useState<"chat" | "research">("chat");
  const [useWeb, setUseWeb] = useState(false); // if you still need this
  const [tab, setTab] = useState("chat");

  
  useEffect(() => {
    if (initialQuery && !hasRunRef.current) {
      hasRunRef.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  const { streamResponse, isStreaming } = useStream();

  // 🔥 STREAMING CHAT FUNCTION

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = { sender: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);

    const historyForApi = [...messages, userMsg];

    try {
      if (useWeb) {
  const res = await fetch("/api/chat/web", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      conversationHistory: historyForApi,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Web chat error:", data.error);
    setMessages((prev) => [
      ...prev,
      { sender: "bot", content: "Error: " + (data.error || "unknown") },
    ]);
    return;
  }

  const { answer, sources, images } = data;

  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      content: answer,
      mode: "research",
      sources: sources || [],
      images: images || [],
    },
  ]);
}  else {
        // 💬 Normal streaming mode (your existing behavior)
        const res = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            message: text,
            conversationHistory: historyForApi,
          }),
        });

        // Add empty bot message
        setMessages((prev) => [...prev, { sender: "bot", content: "" }]);

        // STREAM it
        await streamResponse(res, (token, fullText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              sender: "bot",
              content: fullText,
            };
            return updated;
          });
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", content: "Something went wrong." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen ">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 scrollbar-thin">
        <Messages messages={messages} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 ">
        <div className=" mx-auto px-4">
          
<ChatInput
  input={input}
  handleInputChange={handleInputChange}
  handleSubmit={handleSubmit}
  isLoading={false}
  mode={mode}
  onModeChange={(val) => {
    setMode(val);
    setUseWeb(val === "research"); // same logic as before
  }}
/>
        </div>
      </div>
    </div>
  );
}
