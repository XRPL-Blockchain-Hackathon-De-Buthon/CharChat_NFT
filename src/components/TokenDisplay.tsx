
import { Coins } from "lucide-react";

interface TokenDisplayProps {
  amount: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const TokenDisplay = ({ 
  amount, 
  color = "text-token-purple", 
  showLabel = true,
  size = "md" 
}: TokenDisplayProps) => {
  const sizeClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1.5",
  };
  
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]} font-medium ${color}`}>
      <Coins size={iconSizes[size]} className="animate-pulse-glow" />
      <span>{amount.toLocaleString()}</span>
      {showLabel && <span className="text-[10px] opacity-80">COIN</span>}
    </div>
  );
};

export default TokenDisplay;
