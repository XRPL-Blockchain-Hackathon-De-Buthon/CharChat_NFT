
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ChatbotCardProps {
  id: string;
  name: string;
  image: string;
  tokenPrice: number;
  rankChange: number;
  rank: number;
}

const ChatbotCard = ({ id, name, image, tokenPrice, rankChange, rank }: ChatbotCardProps) => {
  const navigate = useNavigate();
  
  const getRankChangeIcon = () => {
    if (rankChange > 0) {
      return <ArrowUp size={16} className="text-green-500" />;
    } else if (rankChange < 0) {
      return <ArrowDown size={16} className="text-red-500" />;
    }
    return null;
  };
  
  const handleClick = () => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="chatbot-card card-hover" onClick={handleClick}>
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full py-1 px-2 text-sm font-medium flex items-center gap-1">
          #{rank}
        </div>
      </div>
      
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-0.5">
              {getRankChangeIcon()}
              {Math.abs(rankChange)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="token-badge bg-token-purple/10 text-token-purple">
            <span>{tokenPrice.toFixed(2)}</span>
            <span className="text-[10px]">COIN</span>
          </div>
        </div>
      </div>
      
      <button className="w-full mt-auto bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium">
        <MessageSquare size={16} />
        <span>Start Chat</span>
      </button>
    </div>
  );
};

export default ChatbotCard;
