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
    <div className="max-w-4xl mx-auto  relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full ">
        <Conversation className="flex-1 min-h-0 p-6">
          <ConversationContent>
            {messageToRender.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Start a conversation...
              </div>
            ) : (
              messageToRender.map((message) => (
                <Fragment key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text": {
                        // 👇 ASSISTANT → rich UI (tabs, sources, images)
                        if (message.role === "assistant") {
                          const adapted = adaptAssistantMessage(message);

                          return (
                            <Message
                              from="assistant"
                              key={`${message.id}-${i}`}
                            >
                              <MessageContent>
                                <BotMessage message={adapted} />
                              </MessageContent>
                            </Message>
                          );
                        }

                        //  USER → keep existing simple rendering
                        return (
                          <Message from="user" key={`${message.id}-${i}`}>
                            <MessageContent>
                              <Response>{part.text}</Response>
                            </MessageContent>
                          </Message>
                        );
                      }
                      case "reasoning":
                        return (
                          <Reasoning
                            className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
                            key={`${message.id}-${i}`}
                          >
                            <ReasoningTrigger />
                            <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
                              {part.text}
                            </ReasoningContent>
                          </Reasoning>
                        );
                      case "step-start":
                        return i > 0 ? (
                          <div
                            key={`${message.id}-${i}`}
                            className="my-4 text-gray-500"
                          >
                            <hr className="border-gray-300" />
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
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="px-6 pt-10 ">
          <PromptInput onSubmit={handleSubmit} className=" ">
            {/* BODY */}
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to know?"
                disabled={status === "streaming"}
                className="pt-5 pl-6 resize-none"
              />
            </PromptInputBody>

            {/* TOOLBAR */}
            <PromptInputFooter>
              <PromptInputToolbar className="flex w-full items-center justify-between">
                {/* LEFT */}
                <PromptInputTools className="flex items-center gap-1">
                  {isModelLoading ? (
                    <Spinner />
                  ) : (
                    <ModelSelector
                      models={models?.models}
                      selectedModelId={selectedModel || ""}
                      onModelSelect={setSelectedModel}
                      className={undefined}
                    />
                  )}
                </PromptInputTools>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                  {status === "streaming" ? (
                    <PromptInputButton onClick={handleStop}>
                      <StopCircleIcon size={16} />
                      <span>Stop</span>
                    </PromptInputButton>
                  ) : (
                    messageToRender.length > 0 && (
                      <PromptInputButton onClick={handleRetry}>
                        <RotateCcwIcon size={16} />
                        <span>Retry</span>
                      </PromptInputButton>
                    )
                  )}

                  <PromptInputSubmit
                    className="rounded-2xl p-2"
                    status={status}
                  />
                </div>
              </PromptInputToolbar>
            </PromptInputFooter>
          </PromptInput>
          <p className="text-center text-[11px] text-muted-foreground mt-1">
            Cortex can make mistakes. Double-check.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
