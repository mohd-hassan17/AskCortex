"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";

export async function getProfileOverview() {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const userId = user.id;

    const [chatCount, messageCount, chats] = await Promise.all([
      db.chat.count({
        where: { userId },
      }),
      db.message.count({
        where: {
          chat: { userId },
        },
      }),
      db.chat.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          model: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      chatCount,
      messageCount,
      recentChats: chats,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Failed to fetch data",
    };
  }
}

export async function getModelUsage() {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        message: "Unauthorized user",
      };
    }

    const userId = user.id;

    const chats = await db.chat.findMany({
      where: { userId },
      select: { model: true },
    });

    const usage: Record<string, number> = {};

    chats.forEach((chat) => {
      if (!chat.model) return;
      usage[chat.model] = (usage[chat.model] || 0) + 1;
    });

    return Object.entries(usage)
      .map(([model, count]) => ({ model, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      success: false,
      message: "Failed to fetch data",
    };
  }
}
