
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NFTDetailCard from "@/components/NFTDetailCard";

// Mock chart data
const generateChartData = (points: number = 30, min: number = 0.5, max: number = 2) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(3))
  }));
};

// Mock NFT data
const mockNFTDetails = {
  "1": {
    id: "1",
    name: "Creative Helper IP",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 0.85,
    creator: "ArtistOne",
    priceChange: 5.2,
    monthlyRevenue: 0.12,
    userCount: 3240,
    description: "Creative Helper is an AI chatbot designed to assist with creative tasks like brainstorming, writing, and design concepts. This NFT gives you full IP ownership of the chatbot, including all future earnings from token usage."
  },
  "2": {
    id: "2",
    name: "Brainstorm Buddy IP",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 1.2,
    creator: "CreatorTwo",
    priceChange: -2.1,
    monthlyRevenue: 0.18,
    userCount: 4120,
    description: "Brainstorm Buddy helps users generate ideas and think creatively. This NFT represents full intellectual property ownership of the chatbot's personality, training data, and future developments."
  },
  "3": {
    id: "3",
    name: "Code Ninja IP",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    price: 0.75,
    creator: "DevMaster",
    priceChange: 1.8,
    monthlyRevenue: 0.09,
    userCount: 2870,
    description: "Code Ninja is an AI assistant that helps with programming tasks, debugging, and learning to code. Owning this NFT gives you complete IP rights to the Code Ninja chatbot."
  },
  "4": {
    id: "4",
    name: "Fitness Coach IP",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    price: 0.65,
    creator: "FitPro",
    priceChange: 3.5,
    monthlyRevenue: 0.08,
    userCount: 2340,
    description: "Fitness Coach is an AI chatbot that provides workout plans, nutrition advice, and motivation for fitness enthusiasts. This NFT includes full ownership of the chatbot's IP."
  }
};

const NFTDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if NFT exists
  const nftDetails = mockNFTDetails[id as keyof typeof mockNFTDetails];
  
  if (!nftDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">NFT Not Found</h1>
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
        <h1 className="text-xl font-semibold">NFT IP Details</h1>
      </header>
      
      <main className="px-4 py-2">
        <NFTDetailCard 
          {...nftDetails}
          chartData={generateChartData(30, 0.5, 1.5)}
        />
      </main>
    </div>
  );
};

export default NFTDetail;
