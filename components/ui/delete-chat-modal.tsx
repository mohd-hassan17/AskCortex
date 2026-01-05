'use client';

import Modal from "@/components/ui/modal";
import {useDeleteChat} from "@/modules/chat/hooks/chat";

import { toast } from "sonner";

const DeleteChatModal = ({
  isModalOpen,
  setIsModalOpen,
  chatId,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  chatId: string;
}) => {
    const { mutateAsync, isPending } = useDeleteChat(chatId);

    const handleDelete = async () => {

        try {
            await mutateAsync();
            setIsModalOpen(false);
            toast.success("Chat deleted successfully");
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    }

    return (
    <Modal
      title="Delete Chat"
      description="Are you sure you want to delete this Chat? This action cannot be undone."
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleDelete}
      submitText={isPending ? "Deleting..." : "Delete"}
      submitVariant="destructive"
    >
      <p className="text-sm text-zinc-500">
        Once deleted, all requests and data in this Chat will be permanently removed.
      </p>
    </Modal>
  );
};

export default DeleteChatModal;