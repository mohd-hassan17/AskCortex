
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/lib/theme-toggle';


const UserInfoCard = ({ userData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="border-none shadow-sm bg-background">
      {/* Reduced padding on mobile (p-5) to save space, p-8 on desktop */}
      <CardContent className="p-5 md:p-8 relative">
        
        {/* Absolute positioning is fine, but we ensure z-index prevents overlap issues */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative shrink-0">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-muted/50 shadow-sm">
              <AvatarImage
                src={userData?.image}
                alt={`${userData.name}`}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl md:text-4xl font-bold bg-muted">
                {userData.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 border-4 border-background">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Text Details Section */}
          <div className="flex-1 text-center md:text-left w-full min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 truncate">
              {userData.name}
            </h1>

            {/* Email & Badge Row - Added flex-wrap for small screens */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1 rounded-full text-sm">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate max-w-50">{userData.email}</span>
              </div>
              <Badge variant="destructive" className="px-2 py-0.5 text-xs">
                USER
              </Badge>
            </div>

            {/* Dates Row - Added flex-wrap so it stacks on tiny phones */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
              <div className="hidden sm:block text-border">•</div> {/* Separator hidden on tiny screens */}
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Last active {formatDate(userData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;