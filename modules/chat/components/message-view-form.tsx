"use client";

import { useChat } from "@ai-sdk/react";
import { Fragment, useState, useEffect, useMemo, useRef } from "react";
import { useGetChatById } from "../hooks/chat";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Spinner } from "@/components/ui/spinner";
import { ModelSelector } from "./model-selector";
import { useChatStore } from "../store/chat-store";
import { useSearchParams, useRouter } from "next/navigation";
import {
  GlobeIcon,
  RotateCcwIcon,
  StopCircleIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "lucide-react";
import { useAIModels } from "@/modules/ai-agent/hook/ai-agent";
import { DefaultChatTransport } from "ai";
import { cn } from "@/lib/utils";
import { BotMessage } from "@/components/chat/messages";
// import { BotMessage } from "@/components/chat/messages";

const MessageViewWithForm = ({ chatId }: { chatId: string }) => {
  const { data: models, isPending: isModelLoading } = useAIModels();
  const { data, isPending } = useGetChatById(chatId);
  const isResearchMode = data?.data?.mode === "RESEARCH";

  const { hasChatBeenTriggered, markChatAsTriggered } = useChatStore();

  const [selectedModel, setSelectedModel] = useState(data?.data?.model);
  const [input, setInput] = useState("");

  const hasAutoTriggered = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";

  const initialMessages = useMemo(() => {
    if (!data?.data?.messages) return [];

    return data.data.messages
      .filter((msg) => msg.content && msg.content.trim() !== "" && msg.id)
      .map((msg) => {
        try {
          const parts = JSON.parse(msg.content);

          return {
            id: msg.id,
            role: msg.messageRole.toLowerCase(),
            parts: Array.isArray(parts)
              ? parts
              : [{ type: "text", text: msg.content }],
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
      });
  }, [data]);

  const { stop, messages, status, sendMessage, regenerate } = useChat({
    // initialMessages: [],
    // api: "/api/chat",
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  useEffect(() => {
    if (data?.data?.model && !selectedModel) {
      setSelectedModel(data.data.model);
    }
  }, [data, selectedModel]);

  function adaptAssistantMessage(message: any) {
    const content =
      message.parts?.find((p: any) => p.type === "text")?.text ?? "";

    const sources = message.metadata?.sources ?? [];
    const images = message.metadata?.images ?? [];

    return {
      sender: "bot" as const,
      content,
      sources,
      images,
    };
  }

  useEffect(() => {
    if (hasAutoTriggered.current) return;
    if (!shouldAutoTrigger) return;
    if (hasChatBeenTriggered(chatId)) return;
    if (!selectedModel) return;
    if (initialMessages.length === 0) return;

    const lastMessage = initialMessages[initialMessages.length - 1];
    if (lastMessage.role !== "user") return;

    hasAutoTriggered.current = true;
    markChatAsTriggered(chatId);

    sendMessage(
      { parts: [] },
      {
        body: {
          model: selectedModel,
          chatId,
          skipUserMessage: true,
          webSearch: isResearchMode, // KEY LINE
        },
      }
    );

    router.replace(`/chat/${chatId}`, { scroll: false });
  }, [
    shouldAutoTrigger,
    chatId,
    selectedModel,
    initialMessages,
    markChatAsTriggered,
    hasChatBeenTriggered,
    sendMessage,
    router,
  ]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    sendMessage(
      { text: input },
      {
        body: {
          model: selectedModel,
          chatId,
          webSearch: isResearchMode, //  KEY LINE
        },
      }
    );
    setInput("");
  };

  const handleRetry = () => {
    regenerate();
  };

  const handleStop = () => {
    stop();
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  const messageToRender = [...initialMessages, ...messages];

  return (
    // MAIN CONTAINER: Uses 100dvh for mobile browsers
    <div className="flex flex-col w-full h-[calc(100dvh-3.5rem)] md:h-[calc(100vh-4rem)] bg-background relative overflow-hidden">
      
      {/* CONVERSATION AREA: Flex-grow to fill space, min-h-0 allows scrolling */}
      <div className="flex-1 min-h-0 w-full">
        <Conversation className="h-full w-full">
          {/* Centered Content Container */}
          <ConversationContent className="max-w-4xl mx-auto w-full px-4 py-4 md:px-8 md:py-8 space-y-6">
            
            {messageToRender.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground animate-in fade-in duration-500">
                <p className="text-lg font-medium">Start a conversation...</p>
              </div>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text": {
                        if (message.role === "assistant") {
                          const adapted = adaptAssistantMessage(message);
                          return (
                            <Message from="assistant" key={`${message.id}-${i}`} className="animate-in fade-in slide-in-from-left-2 duration-300">
                              <MessageContent>
                                <BotMessage message={adapted} />
                              </MessageContent>
                            </Message>
                          );
                        }
                        return (
                          <Message from="user" key={`${message.id}-${i}`} className="animate-in fade-in slide-in-from-right-2 duration-300">
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                        );
                      }
                      case "reasoning":
                        return (
                          <Reasoning
                            className="max-w-2xl px-4 py-3 border border-indigo-500/10 rounded-xl bg-indigo-50/5 dark:bg-indigo-900/10 mb-4"
                            key={`${message.id}-${i}`}
                          >
                            <ReasoningTrigger className="text-xs font-medium text-indigo-500 hover:text-indigo-600" />
                            <ReasoningContent className="mt-2 text-sm text-muted-foreground leading-relaxed">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      case "step-start":
                        return i > 0 ? (
                          <div key={`${message.id}-${i}`} className="my-6">
                            <hr className="border-border/50" />
                          </div>
                        ) : null;
                      default:
                        return null;
                    }
                  })}
                </Fragment>
              ))
            )}
            
            {status === "streaming" && (
              <div className="flex items-center gap-2 text-muted-foreground px-4 py-2 animate-pulse">
                <Spinner className="h-4 w-4" />
                <span className="text-xs font-medium">Thinking...</span>
              </div>
            )}
            
            {/* Spacer to ensure last message isn't hidden by input */}
            <div className="h-4 md:h-8" />
          </ConversationContent>
          <ConversationScrollButton className="bottom-24 right-4 md:bottom-32 md:right-8" />
        </Conversation>
      </div>

      {/* INPUT AREA: Fixed at bottom with blur effect */}
      <div className="w-full shrink-0 z-20 bg-background/80 backdrop-blur-md border-t border-border/40 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-3xl mx-auto px-3 py-3 md:px-6 md:py-6">
          <PromptInput onSubmit={handleSubmit} className="relative w-full shadow-sm rounded-2xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring transition-all">
            
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask follow-up..."
                disabled={status === "streaming"}
                className="min-h-12.5 md:min-h-15 max-h-50 py-3 md:py-4 px-4 text-sm md:text-base resize-none bg-transparent"
                rows={1}
              />
            </PromptInputBody>

            <PromptInputFooter className="px-3 pb-2 pt-0">
              <PromptInputToolbar className="flex w-full items-center justify-between gap-2">
                
                <PromptInputTools className="flex items-center gap-1">
                   {/* Model Selector handles its own responsiveness */}
                  {isModelLoading ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <ModelSelector
                      models={models?.models}
                      selectedModelId={selectedModel || ""}
                      onModelSelect={setSelectedModel}
                      className="h-8 text-xs" // Compact on mobile
                    />
                  )}
                </PromptInputTools>

                <div className="flex items-center gap-2">
                  {status === "streaming" ? (
                    <PromptInputButton onClick={handleStop} size="sm" className="h-8 px-3 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive">
                      <StopCircleIcon size={14} className="mr-1.5" />
                      <span className="text-xs font-medium">Stop</span>
                    </PromptInputButton>
                  ) : (
                    messageToRender.length > 0 && (
                      <PromptInputButton onClick={handleRetry} size="sm" className="h-8 w-8 md:w-auto md:px-3 p-0 md:bg-secondary/50">
                        <RotateCcwIcon size={14} className="md:mr-1.5" />
                        <span className="hidden md:inline text-xs font-medium">Retry</span>
                      </PromptInputButton>
                    )
                  )}

                  <PromptInputSubmit
                    className="h-8 w-8 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    status={status}
                  />
                </div>
              </PromptInputToolbar>
            </PromptInputFooter>
          </PromptInput>
          
          <p className="text-center text-[10px] text-muted-foreground mt-2 opacity-70">
            Cortex can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
