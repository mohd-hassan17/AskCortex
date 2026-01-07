"use client";
import { useState } from "react";
import ChatWelcomeTabs from "./chat-welcome-tabs";
import ChatMessageForm from "./chat-message-form";
import { GuestHero } from "@/components/providers/GuestHero";
import { AuthDialog } from "@/components/providers/AuthDialog";

const ChatMessageView = ({ user }: any) => {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [mode, setMode] = useState<"chat" | "research">("chat");
  // const [useWeb, setUseWeb] = useState(false);
const [showAuthDialog, setShowAuthDialog] = useState(false); // State for the modal

  const handleMessageSelect = (message: any) => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setSelectedMessage(message);
  };
  const handleMessageChange = () => {
    setSelectedMessage("");
  };
  const handleAttemptSubmit = () => {
     if (!user) {
        setShowAuthDialog(true);
        return false; // tell form not to submit
     }
     return true; // tell form it's ok
  }
  return (
    <div className="flex flex-col h-dvh supports-[height:100svh]:h-svh w-full overflow-hidden relative">
      
      {/* 1. The Auth Intercept Modal */}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />

      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full min-h-0">
        {/* {user ? (
          <ChatWelcomeTabs
            userName={user?.firstName || user?.name}
            onMessageSelect={handleMessageSelect}
          />
        ) : (
          // 2. The Amazing Guest View
          <GuestHero />
        )} */}
        <ChatWelcomeTabs
            userName={user?.firstName || user?.name}
            onMessageSelect={handleMessageSelect}
          />
      </div>


      <div className="w-full shrink-0 p-4 md:p-6 pb-6 md:pb-10 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10">
        <ChatMessageForm
          user={user}
          initialMessage={selectedMessage}
          onMessageChange={handleMessageChange}
          mode={mode}
          onModeChange={setMode}
          // Pass a new prop to your form to handle the interception
          // OR handle it inside the form component itself using the `user` prop
          onGuestTry={handleAttemptSubmit} 
        />
      </div>
    </div>
  );
};

export default ChatMessageView;
