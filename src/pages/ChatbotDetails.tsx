import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, MessageSquare, Save, Users, Clock, Send, AlertTriangle, Lock, Bug, Coins } from "lucide-react";
import { toast } from "sonner";
import ChatbotAnalytics from "@/components/ChatbotAnalytics";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  getChatbotPromptTemplate, 
  updateChatbotPromptTemplate, 
  getChatbotOwner
} from "@/lib/nftContract";
import { getSigner, XRPL_EVM_RPC_URL } from "@/lib/web3Provider";
import OpenAI from 'openai';
import { ethers } from 'ethers';

// OpenAI API key from environment variables
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser usage
});

// Mock chart data
const generateChartData = (points: number = 30, min: number = 50, max: number = 150) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `Day ${i + 1}`,
    price: parseFloat((Math.random() * (max - min) + min).toFixed(2))
  }));
};

// Define interfaces for better type safety
interface ChatbotMetadata {
  name: string;
  description?: string;
  image?: string;
  systemPrompt?: string;
  [key: string]: unknown;
}

interface ChatbotDetailsData {
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
}

const ChatbotDetails = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState("");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [chatbotDetails, setChatbotDetails] = useState<ChatbotDetailsData | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserAddress();
    fetchChatbotData();
  }, [id]);
  
  // Get user wallet address
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
  
  // Fetch chatbot data
  const fetchChatbotData = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      
      // Get prompt template
      const promptResult = await getChatbotPromptTemplate(id);
      
      if (promptResult.success && promptResult.promptTemplate) {
        try {
          // Store the raw prompt template
          setPromptTemplate(promptResult.promptTemplate);
          
          // Set chatbot details from the contract data
          try {
            const metadata = { name: "My Chatbot", image: "" };
            
            // Try to parse metadata from promptTemplate (if it's JSON)
            try {
              const parsedMetadata = JSON.parse(promptResult.promptTemplate);
              if (parsedMetadata.name) {
                metadata.name = parsedMetadata.name;
              }
              if (parsedMetadata.image) {
                metadata.image = parsedMetadata.image;
                console.log('Found image in metadata:', parsedMetadata.image.substring(0, 100) + '...');
              } else {
                console.log('No image found in metadata');
              }
              console.log('Successfully parsed metadata:', metadata.name);
            } catch (e) {
              // Not JSON or parsing error, use default values
              console.log('Error parsing metadata, using default values:', e);
            }
            
            // If image is empty or not a valid URL/data URL, use placeholder
            if (!metadata.image || 
                (!metadata.image.startsWith('data:image') && 
                 !metadata.image.startsWith('http') && 
                 !metadata.image.startsWith('blob'))) {
              console.log('Using default image for chatbot');
              metadata.image = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(metadata.name)}`;
            }
            
            // If image is a data URL, check its size
            if (metadata.image && metadata.image.startsWith('data:image')) {
              // Calculate approximate size in KB
              const sizeInKB = Math.round(metadata.image.length * 0.75 / 1024);
              console.log(`Image size: ~${sizeInKB}KB`);
              
              if (sizeInKB > 1000) {
                console.warn('Image is very large (>1MB). Consider resizing or hosting externally.');
              }
            }
            
            setChatbotDetails({
              id: id,
              name: metadata.name,
              // Use an optimized approach for images
              image: metadata.image,
              tokenPrice: 0.5, // Example price
              priceChange: 0,
              monthlyRevenue: 0,
              totalRevenue: 0,
              userCount: 0,
              avgSessionTime: 0,
              messagesPerDay: 0
            });
          } catch (error) {
            console.error('Error processing metadata:', error);
            setChatbotDetails({
              id: id,
              name: "My Chatbot",
              image: `https://via.placeholder.com/400x400.png?text=AI+Chatbot`,
              tokenPrice: 0.5,
              priceChange: 0,
              monthlyRevenue: 0,
              totalRevenue: 0,
              userCount: 0,
              avgSessionTime: 0,
              messagesPerDay: 0
            });
          }
          
          // Check ownership using balanceOf directly
          // NFT Contract ABI for simple check
          const contractABI = [
            'function balanceOf(address owner) view returns (uint256)',
            'function canUpdatePrompt(address user) view returns (bool)',
            'function isNFTMinted() view returns (bool)'
          ];
          
          const signer = await getSigner();
          const userAddr = await signer.getAddress();
          setUserAddress(userAddr);
          
          const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
          const contract = new ethers.Contract(id, contractABI, provider);
          
          try {
            // Check if NFT is minted
            const isNFTMinted = await contract.isNFTMinted();
            console.log('NFT minted:', isNFTMinted);
            
            if (isNFTMinted) {
              // Simple check - if user balance > 0, they're the owner
              const balance = await contract.balanceOf(userAddr);
              console.log('User NFT balance:', balance.toString());
              
              // Use canUpdatePrompt function which is specifically for this purpose
              const canUpdate = await contract.canUpdatePrompt(userAddr);
              console.log('Can update prompt:', canUpdate);
              
              setIsOwner(balance > 0 && canUpdate);
              console.log('Set is owner:', balance > 0 && canUpdate);
            } else {
              console.log('NFT not minted yet');
              setIsOwner(false);
            }
          } catch (error) {
            console.error('Error checking ownership:', error);
            setIsOwner(false);
          }
        } catch (error) {
          console.error('Error processing chatbot data:', error);
          toast.error('Error processing chatbot data.');
        }
      } else {
        toast.error('Failed to load prompt template.');
      }
    } catch (error) {
      console.error('Error loading chatbot data:', error);
      toast.error('Error loading chatbot data.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a simple debug function
  const handleDebugContract = async () => {
    if (!id) return;
    
    try {
      toast.info("Checking ownership...");
      
      const signer = await getSigner();
      const address = await signer.getAddress();
      
      // Basic NFT Contract ABI 
      const contractABI = [
        'function balanceOf(address owner) view returns (uint256)',
        'function updatePromptTemplate(string calldata newPromptTemplate)',
        'function isNFTMinted() view returns (bool)',
        'function canUpdatePrompt(address user) view returns (bool)'
      ];
      
      const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
      const readContract = new ethers.Contract(id, contractABI, provider);
      
      // Check if NFT is minted
      const isNFTMinted = await readContract.isNFTMinted();
      console.log('NFT minted:', isNFTMinted);
      
      // Check user's token balance
      const balance = await readContract.balanceOf(address);
      console.log('User NFT balance:', balance.toString());
      
      // Check if user can update prompt
      const canUpdate = await readContract.canUpdatePrompt(address);
      console.log('Can update prompt:', canUpdate);
      
      toast.success(`Ownership check result: balance=${balance.toString()}, canUpdate=${canUpdate}`);
      
      // Update isOwner state based on the results
      setIsOwner(balance > 0 && canUpdate);
      
    } catch (error) {
      console.error('Debug error:', error);
      toast.error('Error checking ownership.');
    }
  };
  
  // Add function to mint the initial NFT
  const handleMintInitialNFT = async () => {
    if (!id) return;
    
    try {
      toast.loading("Minting initial NFT...", { id: 'minting-nft' });
      
      const signer = await getSigner();
      
      // Basic NFT Contract ABI
      const contractABI = [
        'function mintInitialNFT()',
        'function isNFTMinted() view returns (bool)'
      ];
      
      // Create contract with signer
      const contract = new ethers.Contract(id, contractABI, signer);
      
      // Check if NFT is already minted
      try {
        const isNFTMinted = await contract.isNFTMinted();
        if (isNFTMinted) {
          toast.error("NFT is already minted", { id: 'minting-nft' });
          return;
        }
      } catch (error) {
        console.error('Error checking if NFT is minted:', error);
      }
      
      // Mint the initial NFT
      console.log('Minting initial NFT...');
      const tx = await contract.mintInitialNFT();
      console.log('Transaction sent, waiting for confirmation...');
      await tx.wait();
      console.log('NFT minted successfully');
      
      toast.success("Initial NFT minted successfully", { id: 'minting-nft' });
      
      // Refresh ownership status
      handleDebugContract();
      
    } catch (error) {
      console.error('Error minting initial NFT:', error);
      
      let errorMessage = 'Error minting NFT';
      if (error instanceof Error) {
        console.log('Error message:', error.message);
        
        if (error.message.includes("execution reverted")) {
          errorMessage = "NFT minting failed. It might already be minted or you're not the owner.";
        }
      }
      
      toast.error(errorMessage, { id: 'minting-nft' });
    }
  };
  
  // Simple prompt update function
  const handleSavePrompt = async () => {
    if (!promptTemplate.trim()) {
      toast.error("Prompt template cannot be empty");
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const signer = await getSigner();
      
      // Basic NFT Contract ABI
      const contractABI = [
        'function updatePromptTemplate(string calldata newPromptTemplate)',
        'function balanceOf(address owner) view returns (uint256)'
      ];
      
      const contract = new ethers.Contract(id, contractABI, signer);
      
      // Check balance directly before updating
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      
      if (balance > 0) {
        console.log('Updating prompt template...');
        const tx = await contract.updatePromptTemplate(promptTemplate);
        console.log('Transaction sent, waiting for confirmation...');
        await tx.wait();
        console.log('Prompt updated successfully');
        
        toast.success("Prompt template updated successfully");
        setIsEditingPrompt(false);
      } else {
        console.log('Not NFT owner');
        toast.error("Only NFT owner can update the prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Error updating prompt template");
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Test prompt
  const handleTestPrompt = async () => {
    if (!testPrompt.trim()) {
      toast.error("Please enter a test message");
      return;
    }
    
    setIsTestingPrompt(true);
    
    try {
      // Generate real response with OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: promptTemplate },
          { role: 'user', content: testPrompt }
        ],
      });
      
      const response = completion.choices[0].message?.content || 
        "There was a problem generating a response.";
      
      setTestResponse(response);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setTestResponse("Error calling OpenAI API. Please try again later.");
    } finally {
      setIsTestingPrompt(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-white rounded-full mx-auto mb-4"></div>
          <p>Loading chatbot data...</p>
        </div>
      </div>
    );
  }
  
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
        <h1 className="text-xl font-semibold">Chatbot Details</h1>
        
        {/* Debug Button */}
        <button 
          onClick={handleDebugContract}
          className="ml-auto h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
          title="Debug Contract"
        >
          <Bug size={18} />
        </button>
        
        {/* Add a direct debugging button for better visibility */}
        <button 
          onClick={handleDebugContract}
          className="ml-2 bg-yellow-500/20 text-yellow-200 px-3 py-1 text-xs rounded-full flex items-center"
        >
          <Bug size={14} className="mr-1" />
          Debug
        </button>
        
        {/* Add Mint NFT button */}
        <button 
          onClick={handleMintInitialNFT}
          className="ml-2 bg-purple-500/20 text-purple-200 px-3 py-1 text-xs rounded-full flex items-center"
        >
          <Coins size={14} className="mr-1" />
          Mint NFT
        </button>
      </header>
      
      <main className="px-4 py-2">
        <ChatbotAnalytics 
          {...chatbotDetails}
          chartData={generateChartData(30, 20, 60)}
        />
        
        {/* Add image optimization tips */}
        {chatbotDetails.image && chatbotDetails.image.startsWith('data:image') && chatbotDetails.image.length > 1000000 && (
          <div className="mt-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              <AlertTriangle size={14} className="inline mr-1" />
              The image is very large ({Math.round(chatbotDetails.image.length * 0.75 / 1024)}KB). Consider using a smaller image or an external image hosting service.
            </p>
          </div>
        )}
        
        {/* NFT Ownership Status */}
        <div className={`mt-6 p-3 rounded-lg flex items-center justify-between ${isOwner ? 'bg-green-900/20 border border-green-500/30' : 'bg-yellow-900/20 border border-yellow-500/30'}`}>
          <div className="flex items-center">
            {isOwner ? (
              <>
                <Lock size={18} className="text-green-400 mr-2" />
                <span className="text-green-400 font-medium">NFT Owner Verified</span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="text-yellow-400 mr-2" />
                <span className="text-yellow-400 font-medium">Not NFT Owner</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {isOwner ? "You can modify the prompt" : "You cannot modify the prompt"}
          </div>
        </div>
        
        {/* Prompt Template Editor */}
        <div className="mt-4 glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2 text-token-purple" />
              <h3 className="text-lg font-medium">Prompt Template</h3>
            </div>
            
            {!isEditingPrompt ? (
              <Button 
                onClick={() => setIsEditingPrompt(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                disabled={!isOwner}
              >
                <Edit size={16} />
                Edit Prompt
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={handleSavePrompt}
                  variant="default"
                  size="sm"
                  className="bg-token-purple hover:bg-token-purple/90 flex items-center gap-1"
                  disabled={isUpdating || !isOwner}
                >
                  <Save size={16} />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
          
          {!isEditingPrompt ? (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="whitespace-pre-wrap">{promptTemplate}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Textarea
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                placeholder="Enter your prompt template..."
                className="min-h-[150px] bg-white/5 border border-white/10"
                disabled={!isOwner}
              />
              
              <div className="p-4 bg-token-purple/10 border border-token-purple/20 rounded-lg">
                <h4 className="font-medium text-token-purple flex items-center mb-2">
                  <Users size={16} className="mr-1" />
                  Test Your Updated Prompt
                </h4>
                
                <p className="text-sm text-muted-foreground mb-3">
                  Try sending a message to see how your chatbot would respond with the new prompt.
                </p>
                
                <div className="flex gap-2 mb-3">
                  <Input
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Enter a test message..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTestPrompt}
                    disabled={isTestingPrompt}
                    className="bg-token-purple"
                  >
                    {isTestingPrompt ? 'Testing...' : 'Test'}
                    <Send size={16} className="ml-1" />
                  </Button>
                </div>
                
                {testResponse && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-sm mb-1 text-muted-foreground">Response:</p>
                    <p>{testResponse}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Add a direct prompting for users having issues */}
          {!isOwner && (
            <div className="mt-4 p-3 bg-orange-900/10 border border-orange-500/20 rounded-lg">
              <p className="text-sm text-center text-orange-400">
                <AlertTriangle size={14} className="inline mr-1" />
                Only the NFT owner can modify the prompt
              </p>
              <div className="mt-3 flex justify-center">
                <button 
                  onClick={handleDebugContract}
                  className="bg-orange-500/20 text-orange-200 px-3 py-1 text-xs rounded flex items-center"
                >
                  <Bug size={14} className="mr-1" />
                  Check Ownership
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat Button */}
        <div className="mt-8 flex justify-center">
          <Button 
            variant="default" 
            className="bg-token-purple hover:bg-token-purple/90 py-6 px-8"
            onClick={() => navigate(`/chat/${id}`)}
          >
            <MessageSquare size={20} className="mr-2" />
            Chat with this Chatbot
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChatbotDetails;
