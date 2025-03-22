
import { useState } from "react";
import { Search, Filter, Grid3X3, List, TagIcon } from "lucide-react";
import NFTCard from "@/components/NFTCard";
import TokenPriceChart from "@/components/TokenPriceChart";

// Mock chart data
const generateChartData = (points: number = 7, min: number = 0.5, max: number = 2) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }));
};

// Mock NFT data
const mockNFTs = [
  {
    id: "1",
    name: "Creative Helper NFT",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 0.85,
    creator: "ArtistOne",
    ownershipType: "nft" as const
  },
  {
    id: "2",
    name: "Brainstorm Buddy IP",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 1.2,
    creator: "CreatorTwo",
    ownershipType: "nft" as const
  },
  {
    id: "3",
    name: "Code Ninja NFT",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    price: 0.75,
    creator: "DevMaster",
    ownershipType: "nft" as const
  },
  {
    id: "4",
    name: "Fitness Coach NFT",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    price: 0.65,
    creator: "FitPro",
    ownershipType: "nft" as const
  }
];

// Mock token data
const mockTokens = [
  {
    id: "1",
    name: "Creative Helper Token",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 124,
    creator: "ArtistOne",
    ownershipType: "token" as const
  },
  {
    id: "2",
    name: "Brainstorm Buddy Token",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    price: 95,
    creator: "CreatorTwo",
    ownershipType: "token" as const
  },
  {
    id: "3",
    name: "Code Ninja Token",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    price: 87,
    creator: "DevMaster",
    ownershipType: "token" as const
  },
  {
    id: "4",
    name: "Fitness Coach Token",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    price: 76,
    creator: "FitPro",
    ownershipType: "token" as const
  }
];

type MarketTab = "nft" | "token";
type ViewMode = "grid" | "list";

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState<MarketTab>("nft");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="pt-8 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center bg-secondary border border-border rounded-full pl-3 pr-2 py-1">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm px-2 w-28"
                autoFocus
                onBlur={() => !searchTerm && setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <Search size={20} />
            </button>
          )}
          
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10">
            <Filter size={20} />
          </button>
          
          <div className="h-8 flex rounded-full bg-secondary border border-border overflow-hidden">
            <button 
              onClick={() => setViewMode("grid")}
              className={`h-8 w-8 flex items-center justify-center ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`h-8 w-8 flex items-center justify-center ${viewMode === 'list' ? 'bg-white/10' : ''}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="px-4 mt-6">
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium relative ${
              activeTab === "nft" 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("nft")}
          >
            NFT IP Ownership
            {activeTab === "nft" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-token-blue" />
            )}
          </button>
          
          <button
            className={`flex-1 py-2 text-center text-sm font-medium relative ${
              activeTab === "token" 
                ? "text-foreground" 
                : "text-muted-foreground"
            }`}
            onClick={() => setActiveTab("token")}
          >
            Utility Tokens
            {activeTab === "token" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-token-purple" />
            )}
          </button>
        </div>
      </div>
      
      {/* NFT Trading Section */}
      {activeTab === "nft" && (
        <section className="px-4 mt-6">
          <div className="glass p-6 rounded-xl mb-6">
            <h2 className="text-lg font-medium mb-4">NFT Market Overview</h2>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Total Volume</div>
                <div className="text-2xl font-bold">13.45 ETH</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Floor Price</div>
                <div className="text-2xl font-bold">0.65 ETH</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Listed NFTs</div>
                <div className="text-2xl font-bold">26</div>
              </div>
            </div>
            <TokenPriceChart data={generateChartData(10, 0.65, 1.2)} color="#3B82F6" height={120} showGrid />
          </div>
          
          <h2 className="text-lg font-medium mb-4">Available NFTs</h2>
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {mockNFTs.map((nft) => (
                <NFTCard key={nft.id} {...nft} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {mockNFTs.map((nft) => (
                <div key={nft.id} className="glass flex overflow-hidden">
                  <div className="w-24 h-24">
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{nft.name}</h3>
                      <div className="text-xs text-muted-foreground">by {nft.creator}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">{nft.price} ETH</div>
                      <button className="bg-token-blue hover:bg-token-blue/90 text-white text-xs px-3 py-1 rounded-full">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      
      {/* Token Trading Section */}
      {activeTab === "token" && (
        <section className="px-4 mt-6">
          <div className="glass p-6 rounded-xl mb-6 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
            <h2 className="text-lg font-medium mb-4">Token Market Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="glass p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Market Cap</div>
                <div className="text-xl font-bold">$14.2M</div>
              </div>
              <div className="glass p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">24h Volume</div>
                <div className="text-xl font-bold">$2.45M</div>
              </div>
              <div className="glass p-3 rounded-lg">
                <div className="text-xs text-muted-foreground">Trending</div>
                <div className="text-xl font-bold text-green-500">↑ 8.2%</div>
              </div>
            </div>
            <TokenPriceChart data={generateChartData(10, 50, 150)} color="#8B5CF6" height={120} showGrid />
          </div>
          
          <h2 className="text-lg font-medium mb-4">Available Tokens</h2>
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {mockTokens.map((token) => (
                <NFTCard key={token.id} {...token} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {mockTokens.map((token) => (
                <div key={token.id} className="glass flex overflow-hidden bg-gradient-to-r from-purple-900/10 to-transparent">
                  <div className="w-24 h-24">
                    <img src={token.image} alt={token.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{token.name}</h3>
                      <div className="text-xs text-muted-foreground">by {token.creator}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-token-purple">{token.price} tokens</div>
                      <button className="bg-token-purple hover:bg-token-purple/90 text-white text-xs px-3 py-1 rounded-full">
                        Trade Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Marketplace;
