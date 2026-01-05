"use client";

import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  SquareTerminal,
  Search,
  Compass,
  GalleryHorizontalEnd,
  Pencil,
  EllipsisIcon,
  Trash,
  SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input"
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/lib/auth-client";
import { useMemo, useState } from "react";
import { useChatStore } from "@/modules/chat/store/chat-store";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import DeleteChatModal from "../ui/delete-chat-modal";
// This is sample data.
const data = {
  guest: {
    name: "guest user",
    email: "guest@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Chats",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Hover scale effect",
      url: "#",
    },
    {
      name: "Register and login flow",
      url: "#",
    },
    {
      name: "Dashboard UI Design",
      url: "#",
    },
    {
      name: "Marketing site content",
      url: "#",
    },
    {
      name: "AI Chatbot integration",
      url: "#",
    },
    {
      name: "Performance optimization",
      url: "#",
    },
  ],
  MenuOptions: [
    {
      title: "New chat",
      icon: Pencil,
      url: "/",
    },
    {
      title: "Search chat",
      icon: Search,
      action: "search",
    },
    // {
    //   title: "Discover",
    //   icon: Compass,
    //   url: "/discover",
    // },
    // {
    //   title: "Library",
    //   icon: GalleryHorizontalEnd,
    //   url: "/library",
    // },
  ],
};

export function AppSidebar({
 chats,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {  user: any, chats: any }) {


  // const { activeChatId, setActiveChatId } = useChatStore();
   const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  async function handleLogout() {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect("/sign-in");
        },
      },
    });
  }
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chats;
    }
    
    const query = searchQuery.toLowerCase();
    return chats.filter((chat: any) => 
      chat.title?.toLowerCase().includes(query) ||
      chat.messages?.some((msg: any) => 
        msg.content?.toLowerCase().includes(query)
      )
    );
  }, [chats, searchQuery]);

  // Group chats by date
  const groupedChats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups: { today: any[]; yesterday: any[]; lastWeek: any[]; older: any[] } = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    filteredChats.forEach((chat: any) => {
      const chatDate = new Date(chat.createdAt);
      
      if (chatDate >= today) {
        groups.today.push(chat);
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat);
      } else if (chatDate >= lastWeek) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    });

    return groups;
  }, [filteredChats]);

  const onDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderChatList = (chatList: any[]) => {
    if (chatList.length === 0) return null;

    return chatList.map((chat: any) => (
      <Link
        key={chat.id}
        href={`/chat/${chat.id}`}
        className={cn(
          "block rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors", 
          // chat.id === activeChatId && "bg-sidebar-accent"
        )}
      >
        <div className="flex flex-row justify-between items-center gap-2">
          <span className="truncate flex-1">{chat.title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 group-hover:opacity-100 hover:bg-sidebar-accent-foreground/10"
                onClick={(e) => e.preventDefault()}
              >
                <EllipsisIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-row gap-2 cursor-pointer" 
                onClick={(e) => onDelete(e, chat.id)}
              >
                <Trash className="h-4 w-4 text-red-500" />
                <span className="text-red-500">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    ));
  };

  return (
    <>
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenuItem>
          <a href="/">
            <div className="flex items-center justify-center px-2  py-3 ">
              <Avatar className="h-8 w-8 rounded-lg transition-transform duration-200 ease-out hover:scale-110 ">
                <AvatarImage src={"/favicon.ico"} alt="AC" />
                {/* <span className="truncate font-medium ">AskCortex</span> */}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight"></div>
            </div>
          </a>
        </SidebarMenuItem>
      </SidebarHeader>
      <Dialog>
      <SidebarContent>
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {data.MenuOptions.map((option, index) => {
            // 🔍 SEARCH CHAT → OPEN DIALOG
            if (option.action === "search") {
              return (
                <SidebarMenuItem key={index}>
                  <DialogTrigger asChild>
                    <SidebarMenuButton className="py-4.5">
                      <option.icon className="size-10" />
                      <span className="text-[15px]">
                        {option.title}
                      </span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                </SidebarMenuItem>
              )
            }

            // 🔗 NORMAL NAVIGATION
            return (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild className="py-4.5">
                  <a href={option.url}>
                    <option.icon className="size-10" />
                    <span className="text-[15px]">
                      {option.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
          {chats.length > 0 && (
            <SidebarMenuItem>
              <NavProjects chats={chats} />
            </SidebarMenuItem>
          )}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      {/* //Dialog for Search Chats */}
      <DialogContent className="max-w-xl p-0 max-h-[80vh]">
  {/* Header */}
  <div className="border-b px-4 py-3">
    <DialogTitle className="text-base font-semibold">
      Search chats
    </DialogTitle>
  </div>

  {/* Body */}
  <div className="flex flex-col">
    
    {/* 🔍 Search input */}
    <div className="px-4 pb-4 pt-3">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search your threads..."
          className="pl-9 bg-sidebar-accent border-sidebar-border pr-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="mt-2 text-xs text-muted-foreground">
          Found {filteredChats.length}{" "}
          {filteredChats.length === 1 ? "chat" : "chats"}
        </div>
      )}
    </div>

    {/* 📜 Thread list */}
    <div className="flex-1 overflow-y-auto px-2 max-h-105">
      {filteredChats.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {searchQuery ? "No chats found" : "No chats yet"}
        </div>
      ) : (
        <>
          {groupedChats.today.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Today
              </div>
              {renderChatList(groupedChats.today)}
            </div>
          )}

          {groupedChats.yesterday.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Yesterday
              </div>
              {renderChatList(groupedChats.yesterday)}
            </div>
          )}

          {groupedChats.lastWeek.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Last 7 Days
              </div>
              {renderChatList(groupedChats.lastWeek)}
            </div>
          )}

          {groupedChats.older.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Older
              </div>
              {renderChatList(groupedChats.older)}
            </div>
          )}
        </>
      )}
    </div>
  </div>
</DialogContent>

      </Dialog>
      <SidebarFooter>
        {user && <NavUser user={user} guest={data.guest} onLogout={handleLogout} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <DeleteChatModal
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      chatId={selectedChatId!}
    />  
    </>
  );
}
