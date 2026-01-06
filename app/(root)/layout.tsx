import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { LucideShare, Share, Share2 } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/modules/auth/actions";
import { getAllChats } from "@/modules/chat/actions";
import { ShareButton } from "@/components/providers/ShareButton";

export const metadata = {
  title: "AskCortex",
  description: "AskCortex - Your AI-Powered Knowledge Assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // PERFORMANCE FIX: Fetch everything in parallel (faster load times)
  const [session, user, chatsResponse] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    currentUser(),
    getAllChats(),
  ]);

  const chats = chatsResponse?.data;

  return (
    <SidebarProvider>
      <div className="flex h-svh w-full bg-background text-foreground overflow-hidden">
        
        {/* Sidebar */}
        <AppSidebar user={user} chats={chats || []} />
        <div className="flex flex-1 flex-col min-h-0 bg-background">
          
          {/* Top bar - flex-none ensures it doesn't shrink */}
          <header className="flex-none p-2 border-b border-border flex items-center justify-between z-10">
            <SidebarTrigger />

            <div className="flex items-center gap-3">
              {!session?.user ? (
                <Button asChild>
                  <Link href="/sign-in">Login</Link>
                </Button>
              ) : null}

              {/* <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </Button> */}
              <ShareButton />
            </div>
          </header>
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}