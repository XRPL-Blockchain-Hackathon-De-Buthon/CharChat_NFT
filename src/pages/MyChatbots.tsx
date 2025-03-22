import { useState, useEffect } from "react";
import { Plus, ArrowUp, ArrowDown, Sparkles, MessageSquare, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatbotCard, { ChatbotCardProps } from "@/components/ChatbotCard";
import TokenDisplay from "@/components/TokenDisplay";
import { getNFTOwner, getPromptTemplate, getUserChatbots, getChatbotPromptTemplate, NFT_CONTRACT_ADDRESS } from "@/lib/nftContract";
import { getSigner } from "@/lib/web3Provider";
import { toast } from "sonner";

type UserMode = "creator" | "user";

// Mock data for created chatbots
const myCreatedChatbots: ChatbotCardProps[] = [
  {
    id: "1",
    name: "Personal Assistant",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
    tokenPrice: 0.45,
    rankChange: 2,
    rank: 12
  },
  {
    id: "2",
    name: "Fantasy Guide",
    image: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenPrice: 0.32,
    rankChange: -1,
    rank: 18
  }
];

// Mock data for owned tokens
const myOwnedTokens = [
  {
    id: "1",
    chatbotName: "Creative Helper",
    image: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenBalance: 35,
    tokenPrice: 1.24,
    lastChange: "+5.3%",
    isPositive: true
  },
  {
    id: "2",
    chatbotName: "Brainstorm Buddy",
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
    tokenBalance: 12,
    tokenPrice: 0.95,
    lastChange: "-2.1%",
    isPositive: false
  },
  {
    id: "3",
    chatbotName: "Code Ninja",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80",
    tokenBalance: 8,
    tokenPrice: 0.87,
    lastChange: "+1.4%",
    isPositive: true
  }
];

const MyChatbots = () => {
  const [mode, setMode] = useState<UserMode>("user");
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [createdChatbots, setCreatedChatbots] = useState<ChatbotCardProps[]>([]);
  const [isNFTOwner, setIsNFTOwner] = useState(false);
  const navigate = useNavigate();
  
  // Get user wallet address
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const signer = await getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (error) {
        console.error('Wallet connection error:', error);
        toast.error('Failed to connect wallet. Please check MetaMask.');
      }
    };
    
    fetchUserAddress();
  }, []);
  
  // Fetch list of chatbots created by the user
  useEffect(() => {
    const fetchUserChatbots = async () => {
      if (!userAddress) return;
      
      try {
        setIsLoading(true);
        
        // Get all chatbot addresses created by the user through the factory contract
        const result = await getUserChatbots(userAddress);
        
        if (result.success && result.chatbots && result.chatbots.length > 0) {
          console.log('User chatbot list:', result.chatbots);
          
          // Get metadata for each chatbot contract
          const chatbotPromises = result.chatbots.map(async (address, index) => {
            try {
              const promptResult = await getChatbotPromptTemplate(address);
              
              if (promptResult.success && promptResult.promptTemplate) {
                try {
                  // Parse metadata stored as JSON string
                  console.log(`Chatbot ${index + 1} prompt template received:`, promptResult.promptTemplate.substring(0, 100) + '...');
                  
                  let metadata;
                  try {
                    metadata = JSON.parse(promptResult.promptTemplate);
                    console.log(`Chatbot ${index + 1} metadata parsing successful`);
                  } catch (parseError) {
                    console.error('JSON parsing error, using template directly:', parseError);
                    // Use template itself as part of metadata when parsing fails
                    metadata = {
                      name: `Chatbot ${index + 1}`,
                      description: promptResult.promptTemplate.substring(0, 100) + '...',
                      systemPrompt: promptResult.promptTemplate
                    };
                  }
                  
                  // Create chatbot card data from metadata
                  return {
                    id: address, // Use contract address as ID
                    name: metadata.name || `Chatbot ${index + 1}`,
                    image: metadata.image || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(metadata.name || `Chatbot ${index + 1}`)}`,
                    tokenPrice: 0.5, // Example price
                    rankChange: 0,
                    rank: 999
                  } as ChatbotCardProps;
                } catch (error) {
                  console.error(`Chatbot ${index + 1} metadata parsing error:`, error);
                  // Return default chatbot data even if error occurs
                  return {
                    id: address,
                    name: `Chatbot ${index + 1}`,
                    image: `https://via.placeholder.com/400x400.png?text=Chatbot+${index + 1}`,
                    tokenPrice: 0.5,
                    rankChange: 0,
                    rank: 999
                  } as ChatbotCardProps;
                }
              } else {
                // Use default values if prompt template retrieval fails
                return {
                  id: address,
                  name: `Chatbot ${index + 1}`,
                  image: `https://via.placeholder.com/400x400.png?text=Chatbot+${index + 1}`,
                  tokenPrice: 0.5,
                  rankChange: 0,
                  rank: 999
                } as ChatbotCardProps;
              }
            } catch (error) {
              console.error(`Error retrieving chatbot ${index + 1} information:`, error);
              return null;
            }
          });
          
          const chatbots = (await Promise.all(chatbotPromises)).filter(Boolean) as ChatbotCardProps[];
          setCreatedChatbots(chatbots);
          console.log('Created chatbot card data:', chatbots);
        } else {
          // Check single NFT contract ownership logic
          const ownerResult = await getNFTOwner();
          
          if (ownerResult.success && ownerResult.owner) {
            const isOwner = ownerResult.owner.toLowerCase() === userAddress.toLowerCase();
            setIsNFTOwner(isOwner);
            
            if (isOwner) {
              const promptResult = await getPromptTemplate();
              
              if (promptResult.success && promptResult.promptTemplate) {
                try {
                  console.log('Existing NFT prompt template received:', promptResult.promptTemplate.substring(0, 100) + '...');
                  
                  let metadata;
                  try {
                    metadata = JSON.parse(promptResult.promptTemplate);
                    console.log('Metadata parsing successful');
                  } catch (parseError) {
                    console.error('JSON parsing error, using template directly:', parseError);
                    metadata = {
                      name: "My Chatbot",
                      description: promptResult.promptTemplate.substring(0, 100) + '...',
                      systemPrompt: promptResult.promptTemplate
                    };
                  }
                  
                  const newChatbot: ChatbotCardProps = {
                    id: NFT_CONTRACT_ADDRESS, // Existing NFT contract address
                    name: metadata.name || "My Chatbot",
                    image: metadata.image || "https://via.placeholder.com/400x400.png?text=AI+Chatbot",
                    tokenPrice: 0.5,
                    rankChange: 0,
                    rank: 999
                  };
                  
                  console.log('Existing NFT chatbot data created:', newChatbot.name);
                  setCreatedChatbots([newChatbot]);
                } catch (error) {
                  console.error('Chatbot metadata parsing error:', error);
                  setCreatedChatbots([{
                    id: "1",
                    name: "My Chatbot",
                    image: "https://via.placeholder.com/400x400.png?text=My+Chatbot",
                    tokenPrice: 0.5,
                    rankChange: 0,
                    rank: 999
                  }]);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error retrieving chatbot list:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserChatbots();
  }, [userAddress]);
  
  const handleCreateChatbot = () => {
    navigate("/create-chatbot");
  };
  
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="pt-8 px-4">
        <h1 className="text-2xl font-semibold">My Chatbots</h1>
        <div className="flex gap-4 mt-4">
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              mode === "user" 
                ? "bg-white text-black" 
                : "bg-white/10 text-white"
            }`}
            onClick={() => setMode("user")}
          >
            User Mode
          </button>
          <button
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              mode === "creator" 
                ? "bg-white text-black" 
                : "bg-white/10 text-white"
            }`}
            onClick={() => setMode("creator")}
          >
            Creator Mode
          </button>
        </div>
      </header>
      
      {/* Creator Mode UI */}
      {mode === "creator" && (
        <section className="px-4 mt-8">
          <div className="glass p-6 rounded-xl mb-8 bg-gradient-to-r from-purple-900/30 to-indigo-900/30">
            <h2 className="text-lg font-medium mb-2">Create New Chatbot</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Build your own chatbot, set rules and earn tokens when others chat with it
            </p>
            <button 
              className="bg-token-purple hover:bg-token-purple/90 transition-colors w-full py-3 rounded-lg text-white flex items-center justify-center gap-2"
              onClick={handleCreateChatbot}
            >
              <Plus size={20} />
              <span className="font-medium">Create New Chatbot</span>
            </button>
          </div>
          
          <h2 className="text-lg font-medium mb-4">
            My Created Chatbots
            {isLoading && <span className="text-sm ml-2 text-muted-foreground">(Loading...)</span>}
          </h2>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {!isLoading && createdChatbots.length > 0 && createdChatbots.map((chatbot) => (
              <div key={chatbot.id} className="cursor-pointer">
                <ChatbotCard {...chatbot} />
              </div>
            ))}
            
            {!isLoading && createdChatbots.length === 0 && !isNFTOwner && myCreatedChatbots.map((chatbot) => (
              <div key={chatbot.id} className="cursor-pointer">
                <ChatbotCard {...chatbot} />
              </div>
            ))}
          </div>
          
          {!isLoading && createdChatbots.length === 0 && isNFTOwner === false && myCreatedChatbots.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You haven't created any chatbots yet</p>
            </div>
          )}
        </section>
      )}
      
      {/* User Mode UI */}
      {mode === "user" && (
        <section className="px-4 mt-8">
          <h2 className="text-lg font-medium mb-4">My Token Holdings</h2>
          
          {myOwnedTokens.map((token) => (
            <div key={token.id} className="glass mb-4 rounded-xl overflow-hidden">
              <div className="flex p-4">
                <div className="h-12 w-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                  <img 
                    src={token.image} 
                    alt={token.chatbotName}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{token.chatbotName}</h3>
                    <div className={`flex items-center gap-1 text-sm ${
                      token.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {token.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      <span>{token.lastChange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <TokenDisplay amount={token.tokenBalance} size="md" />
                    <div className="flex gap-2">
                      <button className="bg-white/10 hover:bg-white/15 transition-colors py-1 px-3 rounded text-xs font-medium flex items-center gap-1"
                        onClick={() => navigate(`/token/${token.id}`)}
                      >
                        <Sparkles size={12} />
                        <span>Buy</span>
                      </button>
                      <button className="bg-white/10 hover:bg-white/15 transition-colors py-1 px-3 rounded text-xs font-medium flex items-center gap-1"
                        onClick={() => navigate(`/token/${token.id}`)}
                      >
                        <BarChart3 size={12} />
                        <span>Analytics</span>
                      </button>
                      <button className="bg-token-purple hover:bg-token-purple/90 transition-colors py-1 px-3 rounded text-xs font-medium flex items-center gap-1"
                        onClick={() => navigate(`/chat/${token.id}`)}
                      >
                        <MessageSquare size={12} />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {myOwnedTokens.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">You don't own any tokens yet</p>
              <button 
                className="mt-4 bg-token-purple hover:bg-token-purple/90 transition-colors px-4 py-2 rounded-lg text-white text-sm"
                onClick={() => navigate("/marketplace")}
              >
                Explore Marketplace
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default MyChatbots;
