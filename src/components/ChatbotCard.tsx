import { ArrowUp, ArrowDown, MessageSquare, Settings, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 이미지 미리 로드 - 이미지가 유효한지 확인
  useEffect(() => {
    if (!image || image === 'undefined' || image === 'null') {
      setImageError(true);
      setIsLoading(false);
      return;
    }
    
    // SVG 데이터 URL인 경우 바로 표시
    if (image.startsWith('data:image/svg+xml')) {
      setIsLoading(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      setIsLoading(false);
      setImageError(false);
    };
    img.onerror = () => {
      console.error('Error loading image:', image.substring(0, 50) + '...');
      setImageError(true);
      setIsLoading(false);
    };
    img.src = image;
  }, [image]);
  
  const getRankChangeIcon = () => {
    if (rankChange > 0) {
      return <ArrowUp size={16} className="text-green-500" />;
    } else if (rankChange < 0) {
      return <ArrowDown size={16} className="text-red-500" />;
    }
    return null;
  };
  
  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chat/${id}`);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/chatbot/${id}`);
  };

  // 첫 두 글자를 이용한 이니셜 생성
  const getInitials = () => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="chatbot-card card-hover">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800">
        {isLoading ? (
          // 로딩 중 표시
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse h-8 w-8 border-t-2 border-white rounded-full"></div>
          </div>
        ) : !imageError ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          // 이미지 에러 시 이니셜 기반 플레이스홀더 표시
          <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
            <div className="flex flex-col items-center text-gray-400">
              <div className="mb-2 w-16 h-16 rounded-full bg-token-purple/30 flex items-center justify-center">
                <span className="text-xl font-medium text-white">{getInitials()}</span>
              </div>
              <span className="text-xs text-center px-2">{name}</span>
            </div>
          </div>
        )}
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
      
      <div className="flex gap-2 mt-auto">
        <button 
          className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors py-2 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
          onClick={handleChatClick}
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
        
        <button 
          className="bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors py-2 px-3 rounded-lg flex items-center justify-center gap-1 text-sm font-medium"
          onClick={handleDetailsClick}
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatbotCard;
