import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { LucideShare, Share, Share2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/lib/theme-toggle";
import { currentUser } from "@/modules/auth/actions";
import { getAllChats } from "@/modules/chat/actions";

export const metadata = {
  title: "AskCortex",
  description: "AskCortex - Your AI-Powered Knowledge Assistant",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(), 
  });

  const user = await currentUser();

  const {data: chats} = await getAllChats();
 
  return (
   <SidebarProvider>
  <div className="flex h-screen w-full bg-background text-foreground">
    {/* Sidebar */}
    <AppSidebar  user={user} chats={chats || []} />

    {/* Content area */}
    <div className="flex flex-1 flex-col bg-background">
      {/* Top bar */}
      <header className="p-2 border-b border-border flex items-center justify-between">
        <SidebarTrigger />

        <div className="flex items-center gap-3">
          {!session?.user ? (
            <Button asChild>
              <Link href="/sign-in">Login</Link>
            </Button>
          ) : null}

          {/* Share button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </Button>
          
        </div>
      </header>

      {/* Page area */}
      <main className="h-screen overflow-hidden">
        {children}
      </main>
    </div>
  </div>
</SidebarProvider>
  );
}
