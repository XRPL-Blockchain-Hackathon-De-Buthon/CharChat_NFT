
import { useState } from "react";
import NotificationCard from "@/components/NotificationCard";
import { Bell } from "lucide-react";

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    type: "rank" as const,
    title: "Creative Helper Rank Change",
    description: "Your favorite chatbot has moved up 3 ranks this week! Now at #1.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    linkTo: "/chat/1",
    isRead: false
  },
  {
    id: "2",
    type: "token" as const,
    title: "Token Price Alert",
    description: "Code Ninja token price increased by 5% in the last 24 hours.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    linkTo: "/marketplace",
    isRead: false
  },
  {
    id: "3",
    type: "nft" as const,
    title: "NFT Sale Opportunity",
    description: "Someone is interested in your Fantasy Guide NFT. Check marketplace.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
    linkTo: "/marketplace",
    isRead: true
  },
  {
    id: "4",
    type: "general" as const,
    title: "New Feature Available",
    description: "You can now create themed chatbots with our new template library.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    linkTo: "/my-chatbots",
    isRead: true
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  
  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => !n.isRead);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="pt-8 px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-token-blue"
            >
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="flex gap-4 mt-4">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              filter === "all" 
                ? "bg-white text-black" 
                : "bg-white/10 text-white"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              filter === "unread" 
                ? "bg-white text-black" 
                : "bg-white/10 text-white"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>
      </header>
      
      <section className="px-4 mt-8">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} {...notification} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Bell size={28} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No notifications</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "all" 
                ? "You don't have any notifications yet" 
                : "You don't have any unread notifications"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
