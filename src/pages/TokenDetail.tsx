
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TokenDetailCard from "@/components/TokenDetailCard";

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
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <button 
          onClick={() => navigate("/marketplace")}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Token Details</h1>
      </header>
      
      <main className="px-4 py-2">
        <TokenDetailCard 
          {...tokenDetails}
          chartData={generateChartData(30, 50, 150)}
          transactions={generateTransactions(10)}
        />
      </main>
    </div>
  );
};

export default TokenDetail;
