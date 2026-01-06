"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown } from "lucide-react";

interface RecentChat {
  id: string;
  title: string;
  model: string;
  updatedAt: Date;
}

export function RecentChats({ chats }: { chats: RecentChat[] }) {

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="px-4 py-3 md:px-6 md:py-4 border-b bg-muted/20">
        <CardTitle className="text-lg">Recent Chats</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 max-h-125">
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
            <p>No chats started yet</p>
          </div>
        )}

        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border p-3 transition-all hover:bg-accent/50 hover:border-primary/20"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="truncate font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {chat.title || "Untitled Chat"}
                </p>
              </div>
              
              {/* FIX: suppressHydrationWarning added here to prevent Next.js errors */}
              <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
              </p>
            </div>

            <Badge 
              variant="secondary" 
              className="w-fit shrink-0 text-[10px] md:text-xs opacity-70 group-hover:opacity-100 transition-opacity"
            >
              {chat.model}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
