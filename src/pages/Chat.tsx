
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Plus, ChevronRight, ChevronUp, Lock, Coins } from "lucide-react";
import ChatMessage, { ChatMessageProps } from "@/components/ChatMessage";
import TokenDisplay from "@/components/TokenDisplay";
import ProgressBar from "@/components/ProgressBar";
import TokenPriceChart from "@/components/TokenPriceChart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Mock chart data
const chartData = Array.from({ length: 7 }, (_, i) => ({
  name: `Day ${i + 1}`,
  price: parseFloat((Math.random() * 1.5 + 0.5).toFixed(2))
}));

// Sample chat history
const initialMessages: ChatMessageProps[] = [
  {
    id: "1",
    content: "Hi there! I'm your creative helper. I can assist with brainstorming, writing, design concepts, and more. What are you working on today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    botName: "Creative Helper",
    botImage: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
  }
];

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageProps[]>(initialMessages);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unlockModalVisible, setUnlockModalVisible] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock chatbot data
  const chatbot = {
    id: id || "1",
    name: "Creative Helper",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 1.24,
    rank: 1,
    tokenBalance: 35,
    tokensForUnlimited: 100,
    freeMessages: 5
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    // Check if user has reached the free message limit
    if (messages.filter(m => m.sender === "user").length >= chatbot.freeMessages && chatbot.tokenBalance < chatbot.tokensForUnlimited) {
      setUnlockModalVisible(true);
      return;
    }
    
    // Add user message
    const userMessage: ChatMessageProps = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botMessage: ChatMessageProps = {
        id: (Date.now() + 1).toString(),
        content: "I'm happy to help with your creative project! Would you like me to suggest some ideas or help refine what you already have in mind?",
        sender: "bot",
        timestamp: new Date(),
        botName: chatbot.name,
        botImage: chatbot.image
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleProfileClick = () => {
    navigate(`/token/${id}`);
  };
  
  const handleBuyTokens = () => {
    toast.success(`You purchased ${tokenAmount} tokens successfully!`);
    setUnlockModalVisible(false);
    
    // In a real app, you would update the user's token balance here
    // For now, we'll just simulate this
    setTimeout(() => {
      handleSendMessage();
    }, 500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border bg-secondary sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProfileClick}
            >
              <img 
                src={chatbot.image} 
                alt={chatbot.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-medium">{chatbot.name}</h2>
              <div className="flex items-center gap-1">
                <TokenDisplay amount={chatbot.tokenPrice} size="sm" />
                <span className="text-xs text-muted-foreground">• #{chatbot.rank}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => setIsInfoVisible(!isInfoVisible)}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          {isInfoVisible ? <ChevronUp size={20} /> : <ChevronRight size={20} />}
        </button>
      </header>
      
      {/* Token info panel */}
      {isInfoVisible && (
        <div className="border-b border-border p-4 bg-secondary/50 animate-slide-down">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Token Status</div>
            <TokenDisplay amount={chatbot.tokenBalance} size="sm" />
          </div>
          
          <div className="mb-4">
            <ProgressBar 
              value={chatbot.tokenBalance} 
              max={chatbot.tokensForUnlimited} 
              showLabel
            />
            <div className="text-xs text-muted-foreground mt-1 text-center">
              {chatbot.tokenBalance >= chatbot.tokensForUnlimited 
                ? "Unlimited chats unlocked!" 
                : `${chatbot.tokensForUnlimited - chatbot.tokenBalance} more tokens for unlimited chats`}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Price History</div>
            <div className="text-xs text-token-green">+5.3% this week</div>
          </div>
          
          <TokenPriceChart data={chartData} height={60} />
          
          <button 
            className="w-full py-2 mt-3 bg-token-purple rounded-lg text-sm font-medium"
            onClick={() => navigate(`/token/${id}`)}
          >
            Buy More Tokens
          </button>
        </div>
      )}
      
      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              {...msg} 
              onProfileClick={msg.sender === "bot" ? handleProfileClick : undefined}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="glass rounded-2xl px-4 py-3 max-w-[75%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="h-2 w-2 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Free message limit indicator */}
          {messages.filter(m => m.sender === "user").length < chatbot.freeMessages && chatbot.tokenBalance < chatbot.tokensForUnlimited && (
            <div className="flex justify-center my-4">
              <div className="bg-white/5 rounded-full px-3 py-1 text-xs text-muted-foreground flex items-center">
                <span>{chatbot.freeMessages - messages.filter(m => m.sender === "user").length} free messages remaining</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-border p-4 sticky bottom-0 bg-background">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <button className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10">
            <Plus size={20} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full bg-secondary border border-border rounded-2xl py-3 px-4 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-white/20 h-10 max-h-32 overflow-auto"
              style={{ minHeight: '40px' }}
              rows={1}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={message.trim() === ""}
              className="absolute right-2 bottom-2 h-6 w-6 flex items-center justify-center text-white bg-token-purple rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat-Unlock Modal */}
      {unlockModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass max-w-md w-full p-6 rounded-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-token-purple/20 flex items-center justify-center mb-2">
                <Lock size={32} className="text-token-purple" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">Chat Limit Reached</h3>
            
            <p className="text-muted-foreground text-center mb-6">
              You've used all your free messages with this chatbot. Buy tokens to continue chatting.
            </p>
            
            <div className="glass border border-token-purple/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Coins size={20} className="text-token-purple mr-2" />
                  <span className="font-medium">Tokens to Purchase</span>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => setTokenAmount(prev => Math.max(1, prev - 1))}
                    className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center"
                    disabled={tokenAmount <= 1}
                  >
                    -
                  </button>
                  <span className="mx-3 font-medium">{tokenAmount}</span>
                  <button 
                    onClick={() => setTokenAmount(prev => prev + 1)}
                    className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between text-sm p-2 bg-white/5 rounded-lg">
                <span>Total Cost</span>
                <span className="font-medium">${(tokenAmount * chatbot.tokenPrice).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setUnlockModalVisible(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-token-purple hover:bg-token-purple/90" 
                onClick={handleBuyTokens}
              >
                Buy Tokens
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-muted-foreground">
                Need more? <a href={`/token/${id}`} className="text-token-purple">Visit the token page</a> to buy in bulk.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
