"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";
import { MessageRole, MessageType } from "@/prisma/generated/browser";
import { revalidatePath } from "next/cache";
import { ChatMode } from "@/prisma/generated/enums";

export const createChatWithMessage = async (values: any) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }
    const { content, model, mode } = values;

    if (!content || !content.trim()) {
      return { success: false, message: "Message content is required" };
    }

    const chatMode =
      mode === "research" || mode === ChatMode.RESEARCH
      ? ChatMode.RESEARCH
      : ChatMode.CHAT;


    const title =
      content.length > 20 ? content.substring(0, 20) + "..." : content;

    const chat = await db.chat.create({
      data: {
        title,
        model,
        mode: chatMode, //  NEW
        userId: user.id,
        messages: {
          create: {
            content,
            messageRole: MessageRole.USER,
            messageType: MessageType.NORMAL,
            model,
          },
        },
      },
      include: { messages: true },
    });
    revalidatePath("/");
    return { success: true, message: "Chat created successfully", data: chat };
  } catch (error) {
    console.error("Error creating chat:", error);
    return { success: false, message: "Failed to create chat" };
  }
};

export const getAllChats = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }
    const chats = await db.chat.findMany({
      where: { userId: user.id },
      include: { messages: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: chats };
  } catch (error) {
    console.error("Error fetching chats:", error);
    return {
      success: false,
      message: "Failed to fetch chats",
    };
  }
};

export const deleteChat = async (chatId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }
    const chat = await db.chat.findUnique({
      where: { id: chatId, userId: user.id },
    });
    if (!chat) {
      return { success: false, message: "Chat not found" };
    }
    await db.chat.delete({
      where: { id: chatId },
    });
    revalidatePath("/");
    return { success: true, message: "Chat deleted successfully" };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return {
      success: false,
      message: "Failed to delete chat",
    };
  }
};

export const getChatById = async (chatId: string) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        model: true,
        mode: true, //  (research/chat)
        createdAt: true,
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            messageRole: true,
            createdAt: true,
            metadata: true, // 👈 THIS is the key line
          },
        },
      },
    });

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error fetching chat:", error);
    return {
      success: false,
      message: "Failed to fetch chat",
    };
  }
};
