import Hero from "@/components/home/Hero";
import { currentUser } from "@/modules/auth/actions";
import ChatMessageView from "@/modules/chat/components/chat-message-view";

export default async function Home() {

  const user = await currentUser();

  return (
    <>
    <ChatMessageView user={user} />
    
    </>
  );
    // <div className="flex flex-1 items-center justify-center p-6 mt-30">
    //   <div className="w-full max-w-4xl">
        {/* <Hero /> */}
    //   </div>
    // </div>
}

