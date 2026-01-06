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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Chats"
        value={chatCount}
        icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatCard
        title="Total Messages"
        value={messageCount}
        icon={<MessagesSquare className="h-4 w-4 text-muted-foreground" />}
      />

      {/* On 'sm' (tablet), this becomes the 3rd item in a 2-col grid. 
         We use sm:col-span-2 lg:col-span-1 to make it take full width on tablet 
         so it doesn't look like an orphan, then back to 1 col on desktop.
      */}
      <Card className="sm:col-span-2 lg:col-span-1 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Model
          </CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center pt-1">
             {topModel ? (
                <Badge variant="secondary" className="px-2 py-1 text-sm">
                  {topModel}
                </Badge>
             ) : (
                <span className="text-xl font-bold">—</span>
             )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Most frequently used
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component to reduce code repetition
function StatCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          Lifetime stats
        </p>
      </CardContent>
    </Card>
  );
}