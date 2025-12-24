"use client";
import { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";

const ChatMessageView = ({ user }: any) => {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [mode, setMode] = useState<"chat" | "research">("chat");
  const [useWeb, setUseWeb] = useState(false);

  const handleMessageSelect = (message: any) => {
    setSelectedMessage(message);
  };
  const handleMessageChange = () => {
    setSelectedMessage("");
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Center content */}
      <div className="flex flex-1 items-center justify-center">
        <ChatWelcomeTabs
          userName={user?.name}
          onMessageSelect={handleMessageSelect}
        />
      </div>

      {/* Bottom input */}
      <div className="p-15">
        <ChatMessageForm
          initialMessage={selectedMessage}
          onMessageChange={handleMessageChange}
          mode={mode}
          onModeChange={(val) => {
            setMode(val);
            setUseWeb(val === "research");
          }}
        />
      </div>
    </div>
  );
};

export default ChatMessageView;
