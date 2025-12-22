"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Search,
  Compass,
  GalleryHorizontalEnd,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import { redirect } from 'next/navigation';
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
} from "@/components/ui/sidebar"
import Image from "next/image"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { signOut } from "@/lib/auth-client"

// This is sample data.
const data = {
  user: {
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
    }
  ],
  MenuOptions: [
    {
      title: "Home",
      icon: Search,
      url: "/",
    },
    {
      title: "Discover",
      icon: Compass,
      url: "/discover",
    },
    {
      title: "Library",
      icon: GalleryHorizontalEnd,
      url: "/library",
    }
  ]
}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { session: any }) {

  async function handleLogout() {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    redirect('/sign-in');
                },
            },
        });
    }

  return (
    <Sidebar collapsible="icon" {...props}>
     
       <SidebarHeader>
          <SidebarMenuItem>
           
    <a href="/" >
      <div className="flex items-center justify-center px-2  py-3 ">
  <Avatar className="h-8 w-8 rounded-lg transition-transform duration-200 ease-out hover:scale-110 ">
                <AvatarImage src={"/favicon.ico"} alt='AC' />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <span className="truncate font-medium ">AskCortex</span> */}
              </div>
      </div>
  </a>

          </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent >
        <SidebarGroup >
        
        <SidebarContent>
          <SidebarMenu>
           {data.MenuOptions.map((option, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild className={' py-5 '}>
                  <a href={option.url} className="">
                    <option.icon className="size-10" />
                    <span className="text-[15px]">{option.title}</span>
                  </a>
                </SidebarMenuButton> 
                </SidebarMenuItem>
           ))}

           <NavProjects projects={data.projects} />
       
          </SidebarMenu >

        </SidebarContent>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} session={session} onLogout={handleLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
