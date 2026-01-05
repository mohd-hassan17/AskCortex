"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUp, Paperclip, Mic, Square, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  mode?: "chat" | "research";
  onModeChange?: (mode: "chat" | "research") => void;
}

// Helper to handle browser speech types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  mode = "chat", // Default to chat
  onModeChange,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleSubmit(e as any);
  };

  // Toggle between chat and research mode
  const toggleMode = () => {
    const newMode = mode === "chat" ? "research" : "chat";
    onModeChange?.(newMode);
  };

  // Enhanced Microphone Logic
  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Try Chrome, Edge, or Safari.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Show interim results for better UX
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.");
      } else if (event.error === "not-allowed") {
        alert("Microphone access denied. Please allow microphone access in your browser settings.");
      }
    };

    recognition.onresult = (event: any) => {
      const results = Array.from(event.results);
      const transcript = results
        .map((result: any) => result[0].transcript)
        .join("");

      const newText = input ? `${input} ${transcript}` : transcript;

      const syntheticEvent = {
        target: { value: newText },
      } as React.ChangeEvent<HTMLTextAreaElement>;

      handleInputChange(syntheticEvent);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setIsListening(false);
    }
  };

  const placeholder = isListening
    ? "Listening..."
    : mode === "research"
    ? "Search the web with Cortex..."
    : "Message Cortex...";

  return (
    <div className="w-full pt-6 pb-6">
  <div className="mx-auto max-w-3xl px-4 space-y-3">
    {/* Input box */}
    <div
      onSubmit={handleFormSubmit}
      className={cn(
        "relative rounded-3xl border bg-muted/70 backdrop-blur-xl shadow-2xl transition-all duration-200",
        isListening
          ? "border-primary ring-2 ring-primary/30"
          : "border-border focus-within:border-primary/50"
      )}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isLoading}
        className="w-full resize-none bg-transparent px-5 pt-4 pb-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none text-base max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent disabled:opacity-60"
        style={{ minHeight: "52px" }}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 pb-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleMode}
            disabled={isLoading}
            className={cn(
              "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
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
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>

          {speechSupported && (
            <button
              type="button"
              onClick={toggleMic}
              disabled={isLoading}
              className={cn(
                "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
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
          onClick={(e) => {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              handleSubmit(e as any);
            }
          }}
          disabled={!input.trim() || isLoading}
          className={cn(
            "p-2.5 rounded-xl transition-all",
            input.trim() && !isLoading
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
          title="Send message"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>

    <p className="text-center text-[11px] text-muted-foreground mt-1">
      Cortex can make mistakes. Double-check important information.
    </p>
  </div>
</div>

  );
}