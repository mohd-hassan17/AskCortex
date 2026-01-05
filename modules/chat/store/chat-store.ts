"use client";

import { create } from 'zustand';

interface Chat {
  id: string;
  [key: string]: any;
}

interface Message {
  id: string;
  [key: string]: any;
}

interface ChatStore {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  triggeredChats: Set<string>;
  setChats: (chats: Chat[]) => void;
  setActiveChatId: (chatId: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addChat: (chat: Chat) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  markChatAsTriggered: (chatId: string) => void;
  hasChatBeenTriggered: (chatId: string) => boolean;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  triggeredChats: new Set(),
  
  setChats: (chats) => set({ chats }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  setMessages: (messages) => set({ messages }),

  addChat: (chat) => set({ chats: [chat, ...get().chats] }),

  addMessage: (message) => set({ messages: [...get().messages, message] }),

  clearMessages: () => set({ messages: [] }),

  markChatAsTriggered: (chatId) => {
    const triggered = new Set(get().triggeredChats);
    triggered.add(chatId);
    set({ triggeredChats: triggered });
  },

  hasChatBeenTriggered: (chatId) => {
    return get().triggeredChats.has(chatId);
  },
}));