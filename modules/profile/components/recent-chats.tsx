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
    <Card>
      <CardHeader className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">

        <CardTitle className="text-lg">Recent Chats</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 p-4 pt-0 max-h-[60vh] overflow-y-auto">

        {chats.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No chats started yet.
          </div>
        )}

        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="group flex items-center justify-between rounded-lg border p-3 md:p-4 transition-all hover:bg-muted/50 hover:border-primary/20"
          >
            <div className="min-w-0 flex-1 mr-3">
              <div className="flex items-center gap-2 mb-1">
                 {/* Truncate is crucial here for mobile */}
                <p className="truncate font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors">
                  {chat.title || "Untitled Chat"}
                </p>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(chat.updatedAt))} ago
              </p>
            </div>

            <Badge variant="outline" className="shrink-0 text-[10px] md:text-xs">
              {chat.model}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
