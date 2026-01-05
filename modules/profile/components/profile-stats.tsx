import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MessagesSquare, Bot } from "lucide-react";

interface ProfileStatsProps {
  chatCount: number;
  messageCount: number;
  topModel?: string;
}

export function ProfileStats({
  chatCount,
  messageCount,
  topModel,
}: ProfileStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Chats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Chats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-semibold">{chatCount}</div>
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-semibold">{messageCount}</div>
          <MessagesSquare className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Top Model */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Most Used Model
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {topModel ? (
            <Badge variant="secondary" className="text-sm">
              {topModel}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
          <Bot className="h-5 w-5 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
