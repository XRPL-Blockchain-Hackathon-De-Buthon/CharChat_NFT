
import { Coins, ArrowUpRight, TrendingUp, TrendingDown, Users } from "lucide-react";
import TokenPriceChart from "./TokenPriceChart";
import { Button } from "./ui/button";

interface NFTDetailCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  creator: string;
  priceChange: number;
  monthlyRevenue: number;
  userCount: number;
  description: string;
  chartData: Array<{ name: string; price: number }>;
}

const NFTDetailCard = ({
  id,
  name,
  image,
  price,
  creator,
  priceChange,
  monthlyRevenue,
  userCount,
  description,
  chartData,
}: NFTDetailCardProps) => {
  const isPriceUp = priceChange >= 0;

  return (
    <div className="glass p-4 md:p-6 rounded-xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-xl overflow-hidden mb-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-xl font-bold mb-2">{name}</h1>
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <span>Created by {creator}</span>
          </div>
          
          <div className="glass p-4 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <div className="flex items-center gap-1 text-lg font-medium">
                {price.toFixed(3)} ETH
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <div className={`flex items-center gap-1 ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
                {isPriceUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <Button className="w-full mb-2">Buy NFT</Button>
          <Button variant="outline" className="w-full">Make Offer</Button>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="glass p-4 rounded-xl mb-6">
            <h2 className="text-lg font-medium mb-3">Price History</h2>
            <TokenPriceChart 
              data={chartData} 
              color="#3B82F6" 
              height={200} 
              showGrid 
              showAxis 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="glass p-4 rounded-xl">
              <h3 className="text-muted-foreground text-sm mb-1">Monthly Revenue</h3>
              <div className="flex items-center gap-2">
                <Coins className="text-token-purple" size={20} />
                <span className="text-xl font-medium">{monthlyRevenue.toFixed(2)} ETH</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Estimated based on current token value
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <h3 className="text-muted-foreground text-sm mb-1">Active Users</h3>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="text-xl font-medium">{userCount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Users actively chatting with this bot
              </div>
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <h2 className="text-lg font-medium mb-2">About This NFT</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-medium mb-2">NFT IP Ownership Benefits</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowUpRight size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Earn revenue from all token transactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Control chatbot's training and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Participate in future IP development</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailCard;
