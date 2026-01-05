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

//      const scrollToChats = () => {
//     const container = document.querySelector(
//       "[data-scroll-container]"
//     ) as HTMLElement | null;

//     const target = document.getElementById("all-chats");

//     if (!container || !target) return;

//     const containerTop = container.getBoundingClientRect().top;
//     const targetTop = target.getBoundingClientRect().top;

//     container.scrollTo({
//       top: container.scrollTop + (targetTop - containerTop),
//       behavior: "smooth",
//     });
//   };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Chats</CardTitle>
        {/* <Button variant="ghost" size="sm" onClick={scrollToChats}>
      View all
      <ArrowDown className="ml-1 h-4 w-4" />
    </Button> */}
      </CardHeader>

      <CardContent className="space-y-2">
        {chats.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No chats yet.
          </p>
        )}

        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chat/${chat.id}`}
            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{chat.title}</p>
              <p className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(chat.updatedAt))} ago
              </p>
            </div>

            <Badge variant="outline" className="ml-3 shrink-0">
              {chat.model}
            </Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
