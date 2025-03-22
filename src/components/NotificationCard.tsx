
import { ArrowUpRight, Bell, ChevronsUp, ChevronsDown, DollarSign } from "lucide-react";

type NotificationType = 'rank' | 'token' | 'nft' | 'general';

interface NotificationCardProps {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  linkTo: string;
  isRead: boolean;
}

const NotificationCard = ({
  type,
  title,
  description,
  timestamp,
  linkTo,
  isRead
}: NotificationCardProps) => {
  const getIcon = () => {
    switch(type) {
      case 'rank':
        return <ChevronsUp className="text-token-green" />;
      case 'token':
        return <DollarSign className="text-token-yellow" />;
      case 'nft':
        return <DollarSign className="text-token-blue" />;
      default:
        return <Bell className="text-token-purple" />;
    }
  };
  
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className={`glass p-3 rounded-xl mb-3 transition-all duration-200 ${isRead ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full glass flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-muted-foreground">
              {timeAgo(timestamp)}
            </span>
            
            <button className="flex items-center gap-1 text-xs font-medium text-token-blue">
              <span>View</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
