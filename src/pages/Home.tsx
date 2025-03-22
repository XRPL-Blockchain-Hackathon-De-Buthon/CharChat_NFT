
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import ChatbotCard, { ChatbotCardProps } from "@/components/ChatbotCard";
import TokenPriceChart from "@/components/TokenPriceChart";

// Mock data for chart
const generateChartData = (points: number = 7, min: number = 0.5, max: number = 2) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }));
};

// Mock chatbot data 
const mockChatbots: ChatbotCardProps[] = [
  {
    id: "1",
    name: "Creative Helper",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 1.24,
    rankChange: 3,
    rank: 1
  },
  {
    id: "2",
    name: "Brainstorm Buddy",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 0.95,
    rankChange: -1,
    rank: 2
  },
  {
    id: "3",
    name: "Code Ninja",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    tokenPrice: 0.87,
    rankChange: 2,
    rank: 3
  },
  {
    id: "4",
    name: "Fitness Coach",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=928&q=80",
    tokenPrice: 0.76,
    rankChange: 0,
    rank: 4
  },
  {
    id: "5",
    name: "Travel Guide",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 0.68,
    rankChange: 1,
    rank: 5
  }
];

const Home = () => {
  const [chartData, setChartData] = useState(generateChartData());
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate loading delay for animation purposes
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="pt-8 px-4">
        <h1 className="text-2xl font-semibold">ChatCoin NFT</h1>
        <p className="text-muted-foreground text-sm mt-1">Discover, chat, and earn</p>
      </header>
      
      <section className="px-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">This Week's Hot Characters</h2>
          <button className="flex items-center text-sm text-muted-foreground">
            <span>View all</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="mb-6">
          <TokenPriceChart data={chartData} color="#8B5CF6" height={120} showGrid showAxis />
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mockChatbots.map((chatbot, index) => (
            <div 
              key={chatbot.id}
              className={`transform transition-all duration-500 ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ChatbotCard {...chatbot} />
            </div>
          ))}
        </div>
      </section>
      
      <section className="px-4 mt-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">New & Notable</h2>
          <button className="flex items-center text-sm text-muted-foreground">
            <span>View all</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {mockChatbots.slice(0, 2).map((chatbot, index) => (
            <div 
              key={`new-${chatbot.id}`}
              className={`transform transition-all duration-500 ${
                isLoaded 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${(index + 5) * 100}ms` }}
            >
              <ChatbotCard 
                {...chatbot} 
                name={`${chatbot.name} Plus`}
                tokenPrice={chatbot.tokenPrice * 0.8} 
                rankChange={0}
                rank={index + 6}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
