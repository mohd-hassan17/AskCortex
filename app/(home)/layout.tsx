import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@/modules/auth/actions";
import { getAllChats } from "@/modules/chat/actions";
import { ShareButton } from "@/components/providers/ShareButton";

export const metadata = {
  title: {
    default: "Features | AskCortex",
    template: " AskCortex | %s",
    absolute: "",
  },
  description:
    "Discover the powerful features of AskCortex, your AI-powered assistant for seamless knowledge management and collaboration.",
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

            
              <ShareButton />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto relative">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
