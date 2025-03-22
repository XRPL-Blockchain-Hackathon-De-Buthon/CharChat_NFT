
import { User } from "lucide-react";
import TokenDisplay from "./TokenDisplay";
import { useNavigate } from "react-router-dom";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  creator: string;
  ownershipType: "nft" | "token";
}

const NFTCard = ({
  id,
  name,
  image,
  price,
  creator,
  ownershipType
}: NFTCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (ownershipType === "nft") {
      navigate(`/nft/${id}`);
    } else {
      navigate(`/token/${id}`);
    }
  };
  
  return (
    <div 
      className="glass card-hover overflow-hidden flex flex-col"
      onClick={handleClick}
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full py-1 px-2 text-xs font-medium">
          {ownershipType === "nft" ? "NFT" : "TOKEN"}
        </div>
      </div>
      
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-medium text-sm mb-1 line-clamp-1">{name}</h3>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <User size={12} />
          <span>{creator}</span>
        </div>
        
        <div className="mt-auto">
          {ownershipType === "nft" ? (
            <div className="bg-white/10 py-1.5 px-3 rounded-lg text-sm font-medium text-center">
              {price.toLocaleString()} ETH
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <TokenDisplay amount={price} size="sm" />
              <button 
                className="bg-white/10 hover:bg-white/15 transition-colors py-1 px-2 rounded text-xs font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  // Buy token logic here
                }}
              >
                Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
