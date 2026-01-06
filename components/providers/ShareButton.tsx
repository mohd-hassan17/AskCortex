"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; // Optional: if you use Sonner/Toast

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    // 1. Try Native Share (Mobile/Tablet)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this chat',
          text: 'I found this interesting conversation on Cortex.',
          url: url,
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        console.log("Share cancelled");
      }
    }

    // 2. Fallback to Clipboard (Desktop)
    handleCopy(url);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    // Optional: Show a toast if you have one installed
    // toast.success("Link copied to clipboard!"); 

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className={`
        flex items-center gap-2 transition-all duration-300
        ${copied ? "text-green-500 bg-green-500/10" : "text-muted-foreground hover:text-foreground"}
      `}
    >
      <div className="relative w-4 h-4">
        {/* Animate between icons using absolute positioning and opacity */}
        <Share2 
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            copied ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
          }`} 
        />
        <Check 
          className={`absolute inset-0 w-4 h-4 transition-all duration-300 ${
            copied ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`} 
        />
      </div>
      <span className="text-sm font-medium">
        {copied ? "Copied!" : "Share"}
      </span>
    </Button>
  );
}