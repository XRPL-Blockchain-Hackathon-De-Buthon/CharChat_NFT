
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ChatbotAnalytics from "@/components/ChatbotAnalytics";

// Mock chart data
const generateChartData = (points: number = 30, min: number = 50, max: number = 150) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }));
};

// Mock chatbot details
const mockChatbotDetails = {
  "1": {
    id: "1",
    name: "Personal Assistant",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    tokenPrice: 0.45,
    priceChange: 5.2,
    monthlyRevenue: 0.08,
    totalRevenue: 0.45,
    userCount: 2150,
    avgSessionTime: 8,
    messagesPerDay: 3200
  },
  "2": {
    id: "2",
    name: "Fantasy Guide",
    image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 0.32,
    priceChange: -1.8,
    monthlyRevenue: 0.05,
    totalRevenue: 0.28,
    userCount: 1580,
    avgSessionTime: 6,
    messagesPerDay: 2400
  }
};

const ChatbotDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Check if chatbot exists
  const chatbotDetails = mockChatbotDetails[id as keyof typeof mockChatbotDetails];
  
  if (!chatbotDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chatbot Not Found</h1>
          <button 
            onClick={() => navigate("/my-chatbots")}
            className="bg-white text-black font-medium px-5 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            Back to My Chatbots
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-20 min-h-screen animate-fade-in">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <button 
          onClick={() => navigate("/my-chatbots")}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Chatbot Analytics</h1>
      </header>
      
      <main className="px-4 py-2">
        <ChatbotAnalytics 
          {...chatbotDetails}
          chartData={generateChartData(30, 20, 60)}
        />
      </main>
    </div>
  );
};

export default ChatbotDetails;
