"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import DeleteChatModal from "../ui/delete-chat-modal"
import { useState } from "react"

export function NavProjects({
  chats,
  
}: {
  chats: any[],
}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const { isMobile } = useSidebar();

  const onDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  }

  return (
    <>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">

      <Accordion type="single" collapsible defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
      {/* <SidebarGroupLabel className="text-[13px] font-light "> */}
        
        <div className="text-[14px]  text-muted-foreground">Your chats</div>
        {/* </SidebarGroupLabel> */}
        </AccordionTrigger>
        <AccordionContent>
      <SidebarMenu>
        {chats.map((chat, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild className={" py-4 "}>
            
              <a href={`/chat/${chat.id}`}>
                <span>{chat.title}</span>
              </a>
             
            </SidebarMenuButton>          
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">more</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                <a href={`/chat/${chat.id}`}>
                  <Folder className="text-muted-foreground" />
                  <span>View Chat</span>
                </a>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center" variant="destructive">
                  <Trash2 className="text-muted-foreground " />
                  <span onClick={(e) => onDelete(e, chat.id)}>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SidebarGroup>

         <DeleteChatModal
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              chatId={selectedChatId!}
            />  
    </>
  )
}
