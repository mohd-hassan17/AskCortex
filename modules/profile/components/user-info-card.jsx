
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
    <Card className="border-none shadow-sm bg-background overflow-hidden relative">
      <CardContent className="p-6 md:p-8">
        {/* Theme Toggle - Absolute on desktop, but we handle mobile overlap via flex layout below if needed */}
        <div className="absolute top-4 right-4 z-10">
           {/* <ThemeToggle />  */}
           {/* Placeholder for your toggle */}
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar Group */}
          <div className="relative shrink-0 group">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-muted/30 shadow-sm transition-transform group-hover:scale-105">
              <AvatarImage
                src={userData?.image}
                alt={userData.name}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl md:text-4xl font-bold bg-muted text-muted-foreground">
                {userData.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 border-[3px] border-background shadow-sm">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left min-w-0 w-full space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
                {userData.name}
              </h1>
              {/* <p className="text-muted-foreground text-sm font-medium">
                 Full-Stack AI Engineer
              </p> */}
            </div>

            {/* Email & Role */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full text-xs font-medium border border-border/50 max-w-full">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{userData.email}</span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                User
              </Badge>
            </div>

            {/* Meta Data */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 opacity-70" />
                <span>Joined {formatDate(userData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 opacity-70" />
                <span suppressHydrationWarning>
                    Updated {formatDate(userData.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;