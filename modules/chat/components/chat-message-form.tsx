"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Paperclip, Mic, Square, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";
import { useCreateChat } from "../hooks/chat";
import { toast } from "sonner";

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
  const {mutateAsync, isPending: isChatPending } = useCreateChat();
  const { data: models, isPending, error } = useAIModels();
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState(models?.models[0].id);

  // Sync selected welcome message
  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
      // Focus the textarea when a message is selected
      textareaRef.current?.focus();
    }
  }, [initialMessage, onMessageChange]);
  // Speech recognition hook 
  const { isListening, isSupported, toggle } = useSpeechRecognition({
    onResult: (transcript) => {
      setMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if(!selectedModel){
        toast.error("Please select a model");
        return;
      }
      await mutateAsync({ content: message, model: selectedModel, mode });
      // toast.success("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
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
    <div className="w-full pb-3 md:pb-6"> {/* CHANGED: Added padding-bottom to lift the form up */}
      <div className="mx-auto max-w-3xl"> 
        {/* Input box */}
        <form
          onSubmit={handleSubmit}
          className={cn(
            "relative rounded-2xl md:rounded-3xl bg-muted/65 backdrop-blur-xl shadow-2xl transition-all duration-200",
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
            // Adjusted padding for mobile (px-4) vs desktop (px-5)
            // Added max-h constraint so it doesn't grow off screen
            className="w-full resize-none bg-transparent px-4 md:px-5 pt-3 md:pt-4 pb-4 pr-12 md:pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm md:text-base max-h-37.5 overflow-y-auto disabled:opacity-60"
            style={{ minHeight: "52px" }}
          />

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between px-2 pb-2 md:px-3 md:pb-3">
            
            {/* Left side actions (Model + Mode + Mic) */}
            <div className="flex items-center gap-1 md:gap-2">
              {isPending ? (
                <Spinner />
              ) : (
                <div className="max-w-30 md:max-w-none overflow-hidden">
                   <ModelSelector
                    models={models?.models}
                    selectedModelId={selectedModel}
                    onModelSelect={setSelectedModel}
                    className="ml-1 text-xs md:text-sm" // Smaller text on mobile
                  />
                </div>
              )}

              {/* Mode Toggle */}
              <button
                type="button"
                onClick={toggleMode}
                disabled={isLoading}
                className={cn(
                  "p-1.5 md:p-2 rounded-lg transition-all",
                  mode === "research"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Globe size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
              </button>

              {/* Mic Toggle */}
              {isSupported && (
                <button
                  type="button"
                  onClick={toggle}
                  disabled={isLoading}
                  className={cn(
                    "p-1.5 md:p-2 rounded-lg transition-all",
                    isListening
                      ? "bg-primary/20 text-primary animate-pulse"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {isListening ? (
                    <Square size={18} fill="currentColor" className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  ) : (
                    <Mic size={18} className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  )}
                </button>
              )}
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!message.trim()}
              className={cn(
                "p-2 md:p-2.5 rounded-xl md:rounded-2xl transition-all border-2 h-8 w-8 md:h-10 md:w-10 flex items-center justify-center", // Fixed dimensions
                message.trim() && !isLoading
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed border-transparent"
              )}
            >
              {isChatPending ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <ArrowUp size={20} strokeWidth={2.5} className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-[10px] md:text-[11px] text-muted-foreground mt-2">
          Cortex can make mistakes. Double-check.
        </p>
      </div>
    </div>
  );
}
