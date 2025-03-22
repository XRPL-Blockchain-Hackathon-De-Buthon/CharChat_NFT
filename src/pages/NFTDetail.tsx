
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet, Heart, Share2 } from "lucide-react";
import NFTDetailCard from "@/components/NFTDetailCard";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [isFavorite, setIsFavorite] = useState(false);
  
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
      <header className="p-4 flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/marketplace")}
            className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold">NFT IP Details</h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`h-10 w-10 flex items-center justify-center rounded-full ${isFavorite ? 'text-red-500 bg-red-500/10' : 'hover:bg-white/10'}`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10">
                <Share2 size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Share this NFT</h3>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={`https://chatcoin.app/nft/${id}`} 
                    readOnly
                    className="flex-1 bg-secondary p-2 rounded text-sm"
                  />
                  <Button size="sm">Copy</Button>
                </div>
                <div className="flex justify-center gap-4">
                  <button className="h-10 w-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="h-10 w-10 rounded-full bg-[#4267B2]/20 flex items-center justify-center text-[#4267B2]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="h-10 w-10 rounded-full bg-[#FF0000]/20 flex items-center justify-center text-[#FF0000]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      
      <main className="px-4 py-2">
        <NFTDetailCard 
          {...nftDetails}
          chartData={generateChartData(30, 0.5, 1.5)}
        />
      </main>
      
      {/* Buy NFT Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <div className="fixed bottom-20 left-0 right-0 px-4">
            <Button className="w-full h-12 bg-token-blue hover:bg-token-blue/90 text-lg font-medium shadow-lg">
              <Wallet className="mr-2" /> Buy this NFT
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader>
            <DrawerTitle>Buy NFT IP Ownership</DrawerTitle>
            <DrawerDescription>
              You're purchasing full IP rights to {nftDetails.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            <div className="flex p-4 glass rounded-xl">
              <img src={nftDetails.image} alt={nftDetails.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
              <div>
                <h3 className="font-medium">{nftDetails.name}</h3>
                <p className="text-sm text-muted-foreground">Created by {nftDetails.creator}</p>
                <div className="text-xl font-bold mt-1">{nftDetails.price} ETH</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Method</h3>
              <div className="glass p-3 rounded-lg flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/20 mr-3 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.99984 1.33337L3.1665 8.00004L7.99984 10.6667L12.8332 8.00004L7.99984 1.33337Z" fill="white"/>
                    <path d="M3.1665 8.88892L7.99984 14.6667L12.8332 8.88892L7.99984 11.5556L3.1665 8.88892Z" fill="white"/>
                  </svg>
                </div>
                <span>Ethereum</span>
              </div>
            </div>
            
            <div className="glass p-4 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Item Price</span>
                <span>{nftDetails.price} ETH</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Service Fee (2.5%)</span>
                <span>{(nftDetails.price * 0.025).toFixed(3)} ETH</span>
              </div>
              <div className="border-t border-white/10 my-2 pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>{(nftDetails.price * 1.025).toFixed(3)} ETH</span>
              </div>
            </div>
            
            <Button className="w-full bg-token-blue hover:bg-token-blue/90 h-12">Confirm Purchase</Button>
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Make Offer Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <div className="fixed bottom-20 left-0 right-0 px-4 mt-3 hidden">
            <Button variant="outline" className="w-full">Make Offer</Button>
          </div>
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader>
            <DrawerTitle>Make an Offer</DrawerTitle>
            <DrawerDescription>
              Make an offer for {nftDetails.name}
            </DrawerDescription>
          </DrawerHeader>
          <div className="space-y-4">
            {/* Offer form here */}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NFTDetail;
