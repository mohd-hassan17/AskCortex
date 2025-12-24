import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Chat - AskCortex",
  description: "Engage in intelligent conversations with AskCortex's AI-powered chat.",
   
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth.api.getSession({
        headers: await headers(), 
    });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full  text-gray-100">

        {/* Sidebar */}
        <AppSidebar session={session} />

        {/* Content area */}
        <div className="flex flex-1 flex-col ">

          {/* Top bar */}
          <header className="p-2 border-b border-gray-800 flex items-center justify-between">
  <SidebarTrigger />

  <div className="flex items-center gap-3">

   {!session?.user ? (
  <Button asChild className="cursor-pointer">
    <Link href="/sign-in">Login</Link>
  </Button>
) : null}

    {/* Share button */}
    <button className="p-2 rounded-full hover:bg-[#333535] transition flex items-center gap-1 cursor-pointer" >
      <Share2 className="w-4 h-4" /> 
      <span className="text-sm">Share</span>
    </button>

    {/* 3-dot menu */}
    {/* <button className="p-2 rounded-lg hover:bg-gray-800 transition">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 16"
        className="w-5 h-5"
      >
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
      </svg>
    </button> */}
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
