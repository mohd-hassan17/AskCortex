import ActiveChatLoader from "@/modules/chat/components/active-chat-loader";
import MessageViewWithForm from "@/modules/chat/components/message-view-form";


const page = async ({params}: {params: {chatId: string}}) => {

    const {chatId} = await params;

  return (
      <>
      <ActiveChatLoader chatId={chatId} />
    
      <MessageViewWithForm chatId={chatId} />
    </>
  )
}

export default page