
import { currentUser } from "@/modules/auth/actions";
import { getModelUsage, getProfileOverview } from "@/modules/profile/actions/profile";
import { ProfileStats } from "@/modules/profile/components/profile-stats";
import { RecentChats } from "@/modules/profile/components/recent-chats";
import UserInfoCard from "@/modules/profile/components/user-info-card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Profile ',
}

const ProfilePage = async () => {
  const profileData = await currentUser();
  const overview = await getProfileOverview();
  const modelUsage = await getModelUsage();

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-2">User not found</h2>
        <p className="text-muted-foreground">
          The profile you are looking for does not exist.
        </p>
      </div>
    );
  }
  return (
   
    <div className="min-h-dvh py-6 md:py-12 bg-muted/30"> 
      <div className="container mx-auto max-w-5xl px-4 space-y-6">
        
        <UserInfoCard userData={profileData} />

        <ProfileStats
          chatCount={overview.chatCount ?? 0}
          messageCount={overview.messageCount ?? 0}
          topModel={Array.isArray(modelUsage) ? modelUsage[0]?.model : undefined}
        />

        <div id="all-chats">
          <RecentChats chats={overview.recentChats ?? []} />
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;