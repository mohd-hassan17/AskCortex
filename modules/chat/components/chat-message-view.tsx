"use client";
import { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

const ChatMessageView = ({ user }: any) => {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [mode, setMode] = useState<"chat" | "research">("chat");
  // const [useWeb, setUseWeb] = useState(false);

  const handleMessageSelect = (message: any) => {
    setSelectedMessage(message);
  };
  const handleMessageChange = () => {
    setSelectedMessage("");
  };
  return (
    <div className="flex flex-col h-dvh supports-[height:100svh]:h-svh w-full overflow-hidden">
  <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full min-h-0">
    <ChatWelcomeTabs
      userName={user?.firstName || user?.name}
      onMessageSelect={handleMessageSelect}
    />
  </div>

  <div className="w-full shrink-0 p-4 md:p-6 pb-6 md:pb-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
    <ChatMessageForm
      initialMessage={selectedMessage}
      onMessageChange={handleMessageChange}
      mode={mode}
      onModeChange={(val) => {
        setMode(val);
      }}
    />
  </div>
</div>
  );
};

export default ChatMessageView;
