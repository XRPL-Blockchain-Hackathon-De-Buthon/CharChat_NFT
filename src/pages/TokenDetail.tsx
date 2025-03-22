
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, ChevronDown, ChevronUp, PieChart, Wallet, CreditCard } from "lucide-react";
import TokenDetailCard from "@/components/TokenDetailCard";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Mock chart data
const generateChartData = (points: number = 30, min: number = 50, max: number = 150) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }));
};

// Generate mock transactions
const generateTransactions = (count: number = 10) => {
  const types: ("buy" | "sell")[] = ["buy", "sell"];
  const addresses = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x7890abcdef1234567890abcdef1234567890abcd",
    "0xdef1234567890abcdef1234567890abcdef12345",
    "0x567890abcdef1234567890abcdef1234567890ab"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tx-${i}`,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 100) + 1,
    price: parseFloat((Math.random() * 100 + 50).toFixed(2)),
    from: addresses[Math.floor(Math.random() * addresses.length)],
    to: addresses[Math.floor(Math.random() * addresses.length)],
    time: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000))
  })).sort((a, b) => b.time.getTime() - a.time.getTime());
};

// Mock token data
const mockTokenDetails = {
  "1": {
    id: "1",
    name: "Creative Helper",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 124.32,
    priceChange: 5.2,
    totalSupply: 100000,
    marketCap: 12432000,
    volume24h: 534280,
    allTimeHigh: 145.78
  },
  "2": {
    id: "2",
    name: "Brainstorm Buddy",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 95.18,
    priceChange: -2.1,
    totalSupply: 150000,
    marketCap: 14277000,
    volume24h: 328940,
    allTimeHigh: 112.45
  },
  "3": {
    id: "3",
    name: "Code Ninja",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    price: 87.65,
    priceChange: 1.8,
    totalSupply: 120000,
    marketCap: 10518000,
    volume24h: 245690,
    allTimeHigh: 98.32
  },
  "4": {
    id: "4",
    name: "Fitness Coach",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    price: 76.21,
    priceChange: 3.5,
    totalSupply: 180000,
    marketCap: 13717800,
    volume24h: 189750,
    allTimeHigh: 88.49
  }
};

const TokenDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tokenAmount, setTokenAmount] = useState(10);
  const [activeDrawer, setActiveDrawer] = useState<"buy" | "sell" | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if token exists
  const tokenDetails = mockTokenDetails[id as keyof typeof mockTokenDetails];
  
  if (!tokenDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
          <button 
            onClick={() => navigate("/marketplace")}
            className="bg-white text-black font-medium px-5 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-20 min-h-screen animate-fade-in">
      <header className="p-4 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/marketplace")}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-semibold flex items-center">
              {tokenDetails.name} 
              <span className="text-token-purple ml-2 text-sm bg-token-purple/20 px-2 py-0.5 rounded-full">TOKEN</span>
            </h1>
            <div className="flex items-center text-sm">
              <span className={`flex items-center ${tokenDetails.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tokenDetails.priceChange >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {Math.abs(tokenDetails.priceChange).toFixed(2)}%
              </span>
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="text-token-purple font-medium">{tokenDetails.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white/5 rounded-full">
            <Clock size={20} />
          </button>
          <button className="p-2 bg-white/5 rounded-full">
            <PieChart size={20} />
          </button>
        </div>
      </header>
      
      <main className="px-4 py-2">
        <TokenDetailCard 
          {...tokenDetails}
          chartData={generateChartData(30, 50, 150)}
          transactions={generateTransactions(10)}
        />
      </main>
      
      {/* Buy/Sell Buttons */}
      <div className="fixed bottom-20 left-0 right-0 px-4 flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 h-12 font-medium bg-white/5"
          onClick={() => setActiveDrawer("sell")}
        >
          Sell Tokens
        </Button>
        <Button 
          className="flex-1 h-12 bg-token-purple hover:bg-token-purple/90 font-medium"
          onClick={() => setActiveDrawer("buy")}
        >
          Buy Tokens
        </Button>
      </div>
      
      {/* Buy Tokens Drawer */}
      <Drawer open={activeDrawer === "buy"} onOpenChange={(open) => !open && setActiveDrawer(null)}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader>
            <DrawerTitle>Buy {tokenDetails.name} Tokens</DrawerTitle>
            <DrawerDescription>
              Purchase utility tokens to chat with this AI character
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            <div className="flex p-4 glass rounded-xl items-center">
              <img src={tokenDetails.image} alt={tokenDetails.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
              <div className="flex-1">
                <h3 className="font-medium">{tokenDetails.name} Token</h3>
                <div className="text-sm text-token-purple">${tokenDetails.price.toFixed(2)} per token</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Amount to Buy</h3>
              <div className="glass p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                    onClick={() => setTokenAmount(Math.max(1, tokenAmount - 1))}
                  >-</button>
                  <div className="text-2xl font-bold">{tokenAmount}</div>
                  <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                    onClick={() => setTokenAmount(tokenAmount + 1)}
                  >+</button>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Total: ${(tokenAmount * tokenDetails.price).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              <div className="space-y-2">
                <div className="glass p-3 rounded-lg flex items-center">
                  <CreditCard className="mr-3 text-token-purple" size={20} />
                  <span>Credit Card</span>
                  <div className="ml-auto bg-token-purple/20 text-token-purple text-xs px-2 py-0.5 rounded-full">
                    Recommended
                  </div>
                </div>
                <div className="glass p-3 rounded-lg flex items-center opacity-70">
                  <Wallet className="mr-3" size={20} />
                  <span>Ethereum Wallet</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Tokens ({tokenAmount})</span>
                <span>${(tokenAmount * tokenDetails.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Processing Fee</span>
                <span>${(tokenAmount * tokenDetails.price * 0.025).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${(tokenAmount * tokenDetails.price * 1.025).toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full bg-token-purple hover:bg-token-purple/90 h-12">
              Confirm Purchase
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Sell Tokens Drawer */}
      <Drawer open={activeDrawer === "sell"} onOpenChange={(open) => !open && setActiveDrawer(null)}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader>
            <DrawerTitle>Sell {tokenDetails.name} Tokens</DrawerTitle>
            <DrawerDescription>
              Sell your tokens back to the marketplace
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            <div className="flex p-4 glass rounded-xl items-center">
              <img src={tokenDetails.image} alt={tokenDetails.name} className="w-12 h-12 rounded-lg object-cover mr-4" />
              <div className="flex-1">
                <h3 className="font-medium">{tokenDetails.name} Token</h3>
                <div className="text-sm text-token-purple">${tokenDetails.price.toFixed(2)} per token</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Your Balance</div>
                <div className="font-medium">35 tokens</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Amount to Sell</h3>
              <div className="glass p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                    onClick={() => setTokenAmount(Math.max(1, tokenAmount - 1))}
                  >-</button>
                  <div className="text-2xl font-bold">{tokenAmount}</div>
                  <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
                    onClick={() => setTokenAmount(Math.min(35, tokenAmount + 1))}
                  >+</button>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Total: ${(tokenAmount * tokenDetails.price).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Tokens ({tokenAmount})</span>
                <span>${(tokenAmount * tokenDetails.price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Transaction Fee (1%)</span>
                <span>-${(tokenAmount * tokenDetails.price * 0.01).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-medium">
                <span>You Receive</span>
                <span>${(tokenAmount * tokenDetails.price * 0.99).toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full bg-red-500 hover:bg-red-500/90 h-12">
              Confirm Sale
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TokenDetail;
