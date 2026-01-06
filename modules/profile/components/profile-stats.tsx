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
}: any) {
  return (
    // Mobile: 1 column, Small Tablet: 3 columns. 
    // If you want 2 columns on mobile, use 'grid-cols-2 sm:grid-cols-3' and make the last one span 2.
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard 
        title="Chats" 
        value={chatCount} 
        icon={<MessageSquare className="h-5 w-5 text-muted-foreground" />} 
      />
      <StatCard 
        title="Messages" 
        value={messageCount} 
        icon={<MessagesSquare className="h-5 w-5 text-muted-foreground" />} 
      />
      
      {/* Custom card for Model to handle the Badge logic */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Most Used Model
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          {topModel ? (
            <Badge variant="secondary" className="text-sm px-2 py-0.5">
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

// Helper component to reduce code repetition
function StatCard({ title, value, icon }: any) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="text-2xl font-semibold">{value}</div>
        {icon}
      </CardContent>
    </Card>
  )
}