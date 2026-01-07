"use client";

import React, { useState } from 'react';
import { Newspaper, Code, GraduationCap} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Globe, Cpu, ArrowRight } from "lucide-react";

const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Write code to invert a binary search tree in Python",
      "What is the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
];

function ChatWelcomeTabs({ userName = "", onMessageSelect }: any) {
    const [activeTab, setActiveTab] = useState(0);
    const twoWordsName = userName ? userName.split(" ").slice(0, 2).join(" ") : "there";

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-0">
  <div className="w-full max-w-3xl space-y-6 md:space-y-8">
    
    {/* BADGES: Moved inside content wrapper & added 'md:justify-start' for alignment */}
    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Badge 
        variant="outline" 
        className="px-3 py-1 text-xs font-medium rounded-full border-sky-500/30 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 transition-colors"
      >
        <Globe className="mr-1.5 h-3 w-3" />
        Live Web Search
      </Badge>
      
      <Badge 
        variant="outline" 
        className="px-3 py-1 text-xs font-medium rounded-full border-violet-500/30 bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 transition-colors"
      >
        <Cpu className="mr-1.5 h-3 w-3" />
        30+ LLMs Available
      </Badge>
    </div>

    {/* Responsive Text */}
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center md:text-left">
      How can I help you, {twoWordsName}?
    </h1>

    {/* Tab Buttons (Your Original Version) */}
    <div className="flex flex-wrap gap-2 w-full justify-center md:justify-start">
      {CHAT_TAB_MESSAGE.map((tab, index) => (
        <Button
          key={tab.tabName}
          variant={activeTab === index ? "default" : "secondary"}
          onClick={() => setActiveTab(index)}
          // Mobile: Grow to fill space slightly, Desktop: fixed width
          className="flex-1 sm:flex-none sm:w-auto min-w-25 justify-center sm:justify-start"
        >
          {tab.icon}
          <span className="ml-2">{tab.tabName}</span>
        </Button>
      ))}
    </div>

    {/* Message Suggestions */}
    <div className="space-y-2 md:space-y-3 w-full min-h-50 md:min-h-60">
      {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
        <div key={index}>
          <button
            onClick={() => onMessageSelect(message)}
            className="w-full text-left text-sm md:text-base text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out py-2 md:py-3 active:scale-[0.99]"
          >
            {message}
          </button>
          {index < CHAT_TAB_MESSAGE[activeTab].messages.length - 1 && (
            <Separator />
          )}
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

export default ChatWelcomeTabs;