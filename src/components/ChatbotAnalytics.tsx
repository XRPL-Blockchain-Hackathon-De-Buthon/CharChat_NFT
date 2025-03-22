
import { useState } from "react";
import { Coins, Users, MessageSquare, TrendingUp, Clock, ChevronDown } from "lucide-react";
import TokenPriceChart from "./TokenPriceChart";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./ui/drawer";

interface ChatbotAnalyticsProps {
  id: string;
  name: string;
  image: string;
  tokenPrice: number;
  priceChange: number;
  monthlyRevenue: number;
  totalRevenue: number;
  userCount: number;
  avgSessionTime: number;
  messagesPerDay: number;
  chartData: Array<{ name: string; price: number }>;
}

// Generate mock data for user growth chart
const generateUserGrowthData = (days: number = 30, startUsers: number = 1000) => {
  return Array.from({ length: days }, (_, i) => {
    // Add some randomness but with an overall upward trend
    const randomFactor = Math.random() * 0.1 - 0.02; // Between -0.02 and 0.08
    const growth = 1 + (0.03 + randomFactor); // Base growth of 3% with randomness
    const userCount = Math.round(startUsers * Math.pow(growth, i/3));
    return {
      name: `Day ${i + 1}`,
      price: userCount
    };
  });
};

// Generate mock data for messages per day
const generateMessagesData = (days: number = 30, avgMessages: number = 1500) => {
  return Array.from({ length: days }, (_, i) => {
    // Random fluctuation around the average
    const randomFactor = Math.random() * 0.4 - 0.2; // Between -0.2 and 0.2
    const messageCount = Math.round(avgMessages * (1 + randomFactor));
    return {
      name: `Day ${i + 1}`,
      price: messageCount
    };
  });
};

const ChatbotAnalytics = ({
  id,
  name,
  image,
  tokenPrice,
  priceChange,
  monthlyRevenue,
  totalRevenue,
  userCount,
  avgSessionTime,
  messagesPerDay,
  chartData
}: ChatbotAnalyticsProps) => {
  const [activeTimeframe, setActiveTimeframe] = useState<"1W" | "1M" | "3M" | "1Y">("1M");
  const [activeChart, setActiveChart] = useState<"price" | "users" | "messages">("price");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const userGrowthData = generateUserGrowthData(30, userCount - Math.round(userCount * 0.3));
  const messagesData = generateMessagesData(30, messagesPerDay);
  
  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <div className="aspect-square rounded-xl overflow-hidden mb-4">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          
          <h1 className="text-xl font-bold mb-2">{name}</h1>
          
          <div className="glass p-4 rounded-xl mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Token Price</span>
              <div className="flex items-center gap-1 text-lg font-medium text-token-purple">
                <Coins size={16} />
                {tokenPrice.toFixed(2)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">24h Change</span>
              <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp size={16} />
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-red-500 hover:bg-red-500/90 mb-2"
            onClick={() => setIsDrawerOpen(true)}
          >
            Sell this Chatbot
          </Button>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveChart("price")} 
                className={`px-3 py-1.5 rounded-full text-sm ${activeChart === "price" ? 'bg-token-purple text-white' : 'bg-white/10'}`}
              >
                Token Price
              </button>
              <button 
                onClick={() => setActiveChart("users")} 
                className={`px-3 py-1.5 rounded-full text-sm ${activeChart === "users" ? 'bg-token-blue text-white' : 'bg-white/10'}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveChart("messages")} 
                className={`px-3 py-1.5 rounded-full text-sm ${activeChart === "messages" ? 'bg-green-500 text-white' : 'bg-white/10'}`}
              >
                Messages
              </button>
            </div>
            
            <div className="flex gap-1">
              {(["1W", "1M", "3M", "1Y"] as const).map((timeframe) => (
                <button 
                  key={timeframe}
                  onClick={() => setActiveTimeframe(timeframe)} 
                  className={`px-2 py-1 rounded text-xs ${activeTimeframe === timeframe ? 'bg-white/20' : 'bg-white/5'}`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl mb-6">
            {activeChart === "price" && (
              <TokenPriceChart 
                data={chartData} 
                color="#8B5CF6" 
                height={200} 
                showGrid 
                showAxis 
              />
            )}
            
            {activeChart === "users" && (
              <TokenPriceChart 
                data={userGrowthData} 
                color="#3B82F6" 
                height={200} 
                showGrid 
                showAxis 
              />
            )}
            
            {activeChart === "messages" && (
              <TokenPriceChart 
                data={messagesData} 
                color="#22C55E" 
                height={200} 
                showGrid 
                showAxis 
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass p-4 rounded-xl">
              <h3 className="text-muted-foreground text-sm mb-1">Monthly Revenue</h3>
              <div className="flex items-center gap-2">
                <Coins className="text-token-purple" size={20} />
                <span className="text-xl font-medium">{monthlyRevenue.toFixed(2)} ETH</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +12% from last month
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <h3 className="text-muted-foreground text-sm mb-1">Active Users</h3>
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="text-xl font-medium">{userCount.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                +{Math.floor(Math.random() * 20) + 5}% new users this month
              </div>
            </div>
            
            <div className="glass p-4 rounded-xl">
              <h3 className="text-muted-foreground text-sm mb-1">Messages/Day</h3>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                <span className="text-xl font-medium">{messagesPerDay.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg {Math.floor(messagesPerDay / userCount)} per user
              </div>
            </div>
          </div>
          
          <div className="glass p-4 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">User Engagement</h3>
              <button className="flex items-center gap-1 text-sm text-muted-foreground bg-white/5 px-2 py-1 rounded">
                <span>This Month</span>
                <ChevronDown size={14} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Avg. Session Time</span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock size={14} className="mr-1" />
                    {avgSessionTime} min
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-token-blue rounded-full" style={{ width: `${Math.min(avgSessionTime / 15 * 100, 100)}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Return Rate</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Token Purchases</span>
                  <span className="text-sm font-medium">32%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-token-purple rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-xl font-bold">{totalRevenue.toFixed(2)} ETH</div>
                </div>
                <Button className="bg-token-purple">Revenue Details</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sell Chatbot Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader>
            <DrawerTitle>Sell Your Chatbot NFT</DrawerTitle>
            <DrawerDescription>
              You're selling the full IP rights to {name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            <div className="flex p-4 glass rounded-xl">
              <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover mr-4" />
              <div>
                <h3 className="font-medium">{name}</h3>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Current Market Value</span>
                  <span className="text-xl font-bold">2.45 ETH</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Set Your Price</h3>
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center">
                  <input 
                    type="number" 
                    className="w-full bg-transparent p-2 text-2xl font-bold border-none focus:outline-none" 
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    defaultValue="2.45"
                  />
                  <span className="text-2xl font-bold">ETH</span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  ≈ $4,532.50 USD
                </div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">What You're Selling</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-token-blue flex items-center justify-center text-white mr-2 mt-0.5 flex-shrink-0">✓</div>
                  <span>Full IP ownership of the chatbot</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-token-blue flex items-center justify-center text-white mr-2 mt-0.5 flex-shrink-0">✓</div>
                  <span>30% of all future token transactions</span>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-token-blue flex items-center justify-center text-white mr-2 mt-0.5 flex-shrink-0">✓</div>
                  <span>Control over chatbot training and updates</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Sale Price</span>
                <span>2.45 ETH</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Platform Fee (2.5%)</span>
                <span>0.061 ETH</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-medium">
                <span>You Receive</span>
                <span>2.389 ETH</span>
              </div>
            </div>
            
            <Button className="w-full bg-red-500 hover:bg-red-500/90 h-12">List for Sale</Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ChatbotAnalytics;
