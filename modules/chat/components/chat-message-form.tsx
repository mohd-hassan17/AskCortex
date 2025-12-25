"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Paperclip, Mic, Square, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
// import { useAIModels } from "@/ai-agent/hook/ai-agent";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";

interface ChatMessageFormProps {
  initialMessage: string;
  onMessageChange: any;
  isLoading?: boolean;
  mode?: "chat" | "research";
  onModeChange?: (mode: "chat" | "research") => void;
}

export default function ChatMessageForm({
  initialMessage,
  onMessageChange,
  isLoading,
  mode = "chat",
  onModeChange,
}: ChatMessageFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: models, isPending, error } = useAIModels();
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(models?.models[0].id);

  // Sync selected welcome message
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  // Speech recognition hook 
  const { isListening, isSupported, toggle } = useSpeechRecognition({
    onResult: (transcript) => {
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      // submit logic here
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessage("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const toggleMode = () => {
    const newMode = mode === "chat" ? "research" : "chat";
    onModeChange?.(newMode);
  };

  const placeholder = isListening
    ? "Listening..."
    : mode === "research"
    ? "Search the web with Cortex..."
    : "Message Cortex...";

  return (
    <div className="w-full">
      <div className="mx-auto max-w-3xl px-4">
        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative rounded-3xl border bg-muted/70 backdrop-blur-xl shadow-2xl transition-all duration-200",
            isListening
              ? "border-primary ring-2 ring-primary/30"
              : "border-border focus-within:border-primary/50"
          )}
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-5 pt-4 pb-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none text-base max-h-[200px] overflow-y-auto disabled:opacity-60"
            style={{ minHeight: "52px" }}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-1">
                {isPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className="ml-1"
                />
              )}

              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  mode === "research"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground"
                )}
                title={
                  mode === "research"
                    ? "Switch to chat mode"
                    : "Switch to search mode"
                }
              >
                <Globe size={18} />
              </button>

              <button
                type="button"
                disabled={isLoading}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-50"
                title="Attach file"
              >
                <Paperclip size={18} />
              </button>

              {isSupported && (
                <button
                  type="button"
                  onClick={toggle}
                  disabled={isLoading}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    isListening
                      ? "bg-primary/20 text-primary animate-pulse"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  {isListening ? (
                    <Square size={18} fill="currentColor" />
                  ) : (
                    <Mic size={18} />
                  )}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                message.trim() && !isLoading
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              title="Send message"
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-muted-foreground mt-1">
          Cortex can make mistakes. Double-check.
        </p>
      </div>
    </div>
  );
}
