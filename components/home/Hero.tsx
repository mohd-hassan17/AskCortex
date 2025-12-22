"use client";

import ChatInput from "@/components/ui/ChatInput";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Hero() {
  
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"chat" | "research">("chat");
  const [useWeb, setUseWeb] = useState(false); // if you still need this
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const id = nanoid();
    router.push(`/chat/${id}?q=${encodeURIComponent(inputValue)}`);
  };

  return (
    <section className="flex flex-col items-center text-center p-10 rounded-xl">
      <h1 className="text-5xl sm:text-6xl font-semibold leading-tight">
        Ask Cortex
      </h1>

      
      <div className="w-full flex justify-center">
        <ChatInput
          input={inputValue}
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
    </section>
    
  );
}
