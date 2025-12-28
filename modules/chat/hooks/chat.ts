import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createChatWithMessage, deleteChat } from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: { content: string; model: string }) =>
      createChatWithMessage(values),
    onSuccess: (res) => {
      if (res.success && res.data) {
        const chat = res.data;

        queryClient.invalidateQueries({
          queryKey: ["chats"],
        });

        // Redirect WITH autoTrigger to stream AI response
        router.push(`/chat/${chat.id}?autoTrigger=true`);
      }
    },
    onError: (error) => {
      console.error("Create chat error:", error);
      toast.error("Failed to create chat");
    },
  });
};

export const useDeleteChat  = (chatId: string) => {
   const queryClient = useQueryClient();
   const router = useRouter();
   return useMutation({
      mutationFn: () => deleteChat(chatId),
      onSuccess: (res) => {
       queryClient.invalidateQueries({
          queryKey: ["chats"],
        });
        router.push("/");
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });

}