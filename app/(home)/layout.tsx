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

export const metadata = {
  title: {
    default: "Features | AskCortex",
    template: " AskCortex | %s",
    absolute: ""
  },
  description: "Discover the powerful features of AskCortex, your AI-powered assistant for seamless knowledge management and collaboration.",
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
  <Button asChild className="cursor-pointer">
    <Link href="/sign-in">Login</Link>
  </Button>
) : null}

    {/* Share button */}
    <button 
    className="flex items-center gap-1">
      <Share2 className="w-4 h-4" /> 
      <span className="text-sm">Share</span>
    </button>

  </div>
</header>

          {/* Page area */}
          <main className="flex-1 overflow-y-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
