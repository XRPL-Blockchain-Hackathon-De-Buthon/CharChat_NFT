
import { useState, useEffect } from "react";

export interface ChatMessageProps {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  botName?: string;
  botImage?: string;
  onProfileClick?: () => void;
}

const ChatMessage = ({ 
  content, 
  sender, 
  timestamp,
  botName,
  botImage,
  onProfileClick
}: ChatMessageProps) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 150);
    
    return () => clearTimeout(timer);
  }, []);
  
  const isUser = sender === "user";
  
  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {!isUser && botImage && (
        <div 
          className={`h-8 w-8 rounded-full overflow-hidden mr-2 flex-shrink-0 ${onProfileClick ? 'cursor-pointer hover:ring-2 ring-white/20' : ''}`}
          onClick={onProfileClick}
        >
          <img src={botImage} alt={botName} className="h-full w-full object-cover" />
        </div>
      )}
      
      <div className={`max-w-[75%] ${isUser ? 'bg-token-purple text-white' : 'glass'} rounded-2xl px-4 py-3`}>
        {!isUser && botName && (
          <div className="text-xs text-muted-foreground mb-1">{botName}</div>
        )}
        <div className="text-sm">{content}</div>
        <div className="text-[10px] opacity-70 mt-1 text-right">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
