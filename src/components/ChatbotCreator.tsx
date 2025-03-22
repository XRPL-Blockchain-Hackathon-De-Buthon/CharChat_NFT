import { useState, useRef, useEffect } from "react";
import { Upload, X, Bot, Brain, Coins, Check, MessageSquare, Wand, Box, Send, Palette, PlusCircle, Key, Lock, LockOpen, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createNewChatbot } from "@/lib/nftContract";
import { getSigner } from "@/lib/web3Provider";

// Image compression function - 압축 함수 개선
const compressImage = (base64Image: string, maxSizeKB: number = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // 이미지 사이즈 제한 - 최대 1024x1024
      const maxDimension = 1024;
      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context is not available'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // 초기 품질 설정 - 높은 품질에서 시작
      let quality = 0.9;
      let result = canvas.toDataURL('image/jpeg', quality);
      
      // 크기가 목표보다 크면 점진적으로 품질 낮추기
      const iterations = 0;
      const maxIterations = 10;
      while (result.length > maxSizeKB * 1024 * 1.35 && quality > 0.1 && iterations < maxIterations) {
        quality -= 0.1;
        result = canvas.toDataURL('image/jpeg', quality);
      }
      
      // 최종 압축 크기 확인
      const finalSizeKB = Math.round(result.length * 0.75 / 1024);
      console.log(`Compressed image from ${base64Image.length * 0.75 / 1024}KB to ${finalSizeKB}KB (quality: ${quality.toFixed(1)})`);
      
      resolve(result);
    };
    
    img.onerror = (err) => {
      reject(err);
    };
    
    img.src = base64Image;
  });
};

// Default avatar SVG generation function
const generateDefaultAvatar = (name: string) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Generate random background color
  const colors = ['#3498db', '#9b59b6', '#e74c3c', '#f1c40f', '#1abc9c', '#34495e'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${randomColor.replace('#', '%23')}" /><text x="50" y="50" font-family="Arial" font-size="35" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text></svg>`;
};

const ChatbotCreator = () => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  const [selectedTokenAmount, setSelectedTokenAmount] = useState(10000);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    systemPrompt: "You are a helpful assistant that...",
    tokenPrice: 1,
    initialSupply: 10000,
    unlockAmount: 5,
    freeMessages: 5,
    image: ""
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Add image size validation
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image is too large. Please select an image smaller than 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Check dimensions
          const maxDimension = 800; // Limit width/height to 800px
          let width = img.width;
          let height = img.height;
          
          // Resize only if needed
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round(height * (maxDimension / width));
              width = maxDimension;
            } else {
              width = Math.round(width * (maxDimension / height));
              height = maxDimension;
            }
            
            // Create canvas to resize
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to more efficient format with quality setting
              const optimizedImage = canvas.toDataURL('image/jpeg', 0.85);
              const imageSizeKB = Math.round(optimizedImage.length * 0.75 / 1024);
              
              // 중요: imagePreview와 formData.image 모두 업데이트
              setImagePreview(optimizedImage);
              setFormData(prev => ({
                ...prev,
                image: optimizedImage
              }));
              
              toast.success(`Image optimized to ~${imageSizeKB}KB`);
              return;
            }
          }
          
          // If no resize needed or canvas not available
          const imageData = event.target?.result as string;
          setImagePreview(imageData); // 여기에도 imagePreview 업데이트 추가
          setFormData(prev => ({
            ...prev,
            image: imageData
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    // formData의 이미지도 초기화
    setFormData(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleNextStep = () => {
    if (step === 1 && (!formData.name || !formData.description || !formData.category)) {
      toast.error("Please fill required fields (name, description, and category)");
      return;
    }
    
    if (step === 2 && !formData.systemPrompt) {
      toast.error("Please add a system prompt");
      return;
    }
    
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleTestPrompt = () => {
    if (!testPrompt.trim()) {
      toast.error("Please enter a test message");
      return;
    }
    
    setIsTestingPrompt(true);
    
    // Simulate AI response
    setTimeout(() => {
      setTestResponse("This is a simulated response based on your prompt. In a real application, this would be generated by an AI model using your system prompt.");
      setIsTestingPrompt(false);
    }, 1500);
  };
  
  const handleCreate = async () => {
    if (!userAddress) {
      toast.error('Wallet is not connected. Please check MetaMask.');
      return;
    }
    
    if (!formData.name || !formData.description || !formData.category || !formData.systemPrompt) {
      toast.error('Please fill in all required information.');
      return;
    }
    
    setIsCreating(true);
    toast.loading('Creating chatbot...', { id: 'creating-chatbot' });
    
    try {
      // Image processing
      let imageUrl = formData.image || '';
      
      if (!imageUrl) {
        // Generate default avatar if no image provided
        imageUrl = generateDefaultAvatar(formData.name);
        console.log('Using default avatar');
      } else {
        // Check image size - 이미지 크기 제한 증가 (200KB까지 허용)
        const imageSizeKB = Math.round(imageUrl.length * 0.75 / 1024);
        console.log(`Original image size: ~${imageSizeKB}KB`);
        
        if (imageSizeKB > 200) {
          console.log('Large image detected, compressing...');
          // Compress the image
          try {
            toast.loading('Optimizing image...', { id: 'optimizing-image' });
            imageUrl = await compressImage(imageUrl, 150); // 150KB 목표로 압축
            const newImageSizeKB = Math.round(imageUrl.length * 0.75 / 1024);
            console.log(`Compressed image to: ~${newImageSizeKB}KB`);
            toast.success(`Image optimized to ~${newImageSizeKB}KB`, { id: 'optimizing-image' });
            
            // Even after compression, if still too large, use simpler version but with higher limit
            if (newImageSizeKB > 300) {
              console.warn('Image still large after compression, generating placeholder');
              toast.info('Using simplified image to save gas costs');
              // 이미지가 여전히 너무 크면 아바타 사용하되, 최소 300KB까지는 허용
              imageUrl = generateDefaultAvatar(formData.name);
            }
          } catch (error) {
            console.error('Image compression error:', error);
            toast.error('Error processing image, using default avatar', { id: 'optimizing-image' });
            imageUrl = generateDefaultAvatar(formData.name);
          }
        }
      }
      
      // Ensure image is set
      if (!imageUrl) {
        console.log('No image available, using placeholder');
        imageUrl = `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(formData.name)}`;
      }
      
      // Minimize metadata to save gas costs
      const metadata = JSON.stringify({
        name: formData.name,
        description: formData.description.substring(0, 100), // Limit description length
        category: formData.category,
        systemPrompt: formData.systemPrompt,
        image: imageUrl,
        freeMessages: formData.freeMessages
      });
      
      console.log('Optimized metadata created:', formData.name);
      
      // Create new NFT contract (using factory contract)
      const symbol = formData.name.split(' ').map(word => word[0]).join('').toUpperCase();
      
      // Set tokenPrice very low to save gas costs (can be changed later)
      const veryLowPrice = 0.01; 
      const result = await createNewChatbot(
        formData.name,
        symbol, // Symbol is generated from first letters of name
        metadata, // Pass metadata directly
        veryLowPrice, // Start with very low price
        false // 자동 NFT 민팅 비활성화 - 수동으로 민팅하도록 함
      );
      
      if (result.success) {
        toast.success('Chatbot created successfully!', { id: 'creating-chatbot' });
        toast.info(`New chatbot contract address: ${result.chatbotAddress?.substring(0, 10)}...`);
        
        // NFT 민팅이 필요함을 사용자에게 알리는 메시지 추가
        if (result.chatbotAddress) {
          toast.info('Please mint NFT in the Chatbot Details page to enable prompt editing');
          
          // Navigate to chat page immediately after success (only if address is available)
          navigate(`/chatbot/${result.chatbotAddress}`);
        } else {
          navigate("/my-chatbots");
        }
      } else {
        console.error('Chatbot creation failed:', result.error);
        let errorMessage = 'Failed to create chatbot.';
        
        // Handle specific error messages
        if (result.error && typeof result.error === 'object') {
          const errorString = String(result.error);
          if (errorString.includes("user rejected transaction")) {
            errorMessage = 'User rejected transaction.';
          } else if (errorString.includes("insufficient funds")) {
            errorMessage = 'Insufficient funds for gas fees.';
          }
        }
        
        toast.error(errorMessage, { id: 'creating-chatbot' });
      }
    } catch (error) {
      console.error('Chatbot creation error:', error);
      let errorMessage = 'Error occurred while creating chatbot.';
      
      if (error instanceof Error) {
        console.log('Error message:', error.message);
        if (error.message.includes("user rejected transaction")) {
          errorMessage = 'User rejected transaction.';
        }
      }
      
      toast.error(errorMessage, { id: 'creating-chatbot' });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Progress bar */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(i => (
          <div 
            key={i}
            className={`flex flex-col items-center ${i < step ? 'text-token-purple' : i === step ? 'text-white' : 'text-muted-foreground'}`}
            style={{ width: 'calc(100% / 3)' }}
          >
            <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
              i < step 
                ? 'bg-token-purple text-white' 
                : i === step 
                  ? 'bg-white/10 text-white' 
                  : 'bg-white/5 text-muted-foreground'
            }`}>
              {i < step ? (
                <Check size={20} />
              ) : i === 1 ? (
                <Bot size={20} />
              ) : i === 2 ? (
                <MessageSquare size={20} />
              ) : (
                <Coins size={20} />
              )}
            </div>
            <div className="text-sm font-medium">
              {i === 1 ? 'Setup' : i === 2 ? 'Prompt' : 'Launch'}
            </div>
            
            {i < 3 && (
              <div className={`h-0.5 w-full mt-2 ${i < step ? 'bg-token-purple' : 'bg-white/10'}`}></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step 1: Setup */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Setup Your Chatbot</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2">Chatbot Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Creative Assistant"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple"
              />
            </div>
            
            <div>
              <Label htmlFor="chatbotImage" className="block text-sm font-medium mb-2">Chatbot Image</Label>
              {formData.image ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden group">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <label className="block w-40 h-40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition">
                  <Upload size={24} className="mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                  <input 
                    id="chatbotImage"
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-sm font-medium mb-2">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What does your chatbot do? What is its purpose?"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple min-h-[100px]"
              />
            </div>
            
            <div>
              <Label htmlFor="category" className="block text-sm font-medium mb-2">Category</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple"
              >
                <option value="">Select a category</option>
                <option value="creative">Creative Assistant</option>
                <option value="productivity">Productivity</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="health">Health & Wellness</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="unlockAmount" className="block text-sm font-medium mb-2">Chat-Unlock Settings</Label>
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <LockOpen size={20} className="mr-2 text-token-purple" />
                  <span className="font-medium">Chat-Unlock Activation</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="freeMessages" className="text-sm text-muted-foreground">Free messages before unlock required</Label>
                    <Input
                      id="freeMessages"
                      type="number"
                      name="freeMessages"
                      value={formData.freeMessages}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      className="mt-1 w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unlockAmount" className="text-sm text-muted-foreground">Required tokens to unlock unlimited chats</Label>
                    <Input
                      id="unlockAmount"
                      type="number"
                      name="unlockAmount"
                      value={formData.unlockAmount}
                      onChange={handleChange}
                      min="1"
                      className="mt-1 w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 5-20 tokens</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleNextStep}
              className="bg-token-purple hover:bg-token-purple/90 px-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Prompt */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Define Your Chatbot's Personality</h2>
          
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Wand size={20} className="mr-2 text-token-purple" />
                <h3 className="text-lg font-medium">System Prompt</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">This is the base instruction set for your chatbot's behavior.</p>
              
              <Textarea
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                placeholder="You are a helpful assistant that..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple min-h-[150px]"
              />
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Palette size={20} className="mr-2 text-token-purple" />
                <h3 className="text-lg font-medium">Personality Traits</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Friendly", "Professional", "Funny", "Sarcastic", "Enthusiastic", "Calm", "Creative", "Analytical", "Motivational"].map(trait => (
                  <div key={trait} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={trait} 
                      className="w-4 h-4 rounded border-white/20 text-token-purple focus:ring-token-purple"
                    />
                    <label htmlFor={trait} className="text-sm">{trait}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <UserPlus size={20} className="mr-2 text-token-purple" />
                <h3 className="text-lg font-medium">Knowledge Areas</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">What topics should your chatbot be knowledgeable about?</p>
              
              <div className="flex flex-wrap gap-2">
                {["Art", "Literature", "Science", "Technology", "History", "Business", "Sports", "Gaming", "Music", "Movies", "Health", "Food", "Travel"].map(area => (
                  <div key={area} className="bg-white/10 rounded-full px-3 py-1.5 text-sm">
                    {area}
                  </div>
                ))}
                <div className="bg-token-purple/20 text-token-purple rounded-full px-3 py-1.5 text-sm flex items-center">
                  <span>Add Custom</span>
                  <span className="ml-1 font-bold">+</span>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <MessageSquare size={20} className="mr-2 text-token-purple" />
                <h3 className="text-lg font-medium">Test Your Chatbot</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">Try sending a message to see how your chatbot will respond.</p>
              
              <div className="flex gap-2 mb-4">
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
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-sm mb-1 text-muted-foreground">Response:</p>
                  <p>{testResponse}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button 
              onClick={handlePrevStep}
              variant="outline"
            >
              Back
            </Button>
            <Button 
              onClick={handleNextStep}
              className="bg-token-purple hover:bg-token-purple/90 px-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 3: Launch */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Launch Your Chatbot</h2>
          
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Box size={20} className="mr-2 text-token-blue" />
                <h3 className="text-lg font-medium">IP NFT Minting</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">Create an NFT representing the intellectual property of your chatbot.</p>
              
              <div className="bg-token-blue/10 rounded-lg p-4 border border-token-blue/20">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Box size={24} className="text-token-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-token-blue">IP NFT Benefits</h4>
                    <ul className="text-sm space-y-1 mt-2 text-muted-foreground">
                      <li>• Earn 30% of all token transactions</li>
                      <li>• Maintain IP rights to your chatbot</li>
                      <li>• Sell partial ownership through fractionalization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Coins size={20} className="mr-2 text-token-purple" />
                <h3 className="text-lg font-medium">Utility Token Minting</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">Create utility tokens that users can purchase to access your chatbot.</p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tokenPrice" className="block text-sm font-medium mb-2">Initial Token Price (in USD cents)</Label>
                  <Input
                    id="tokenPrice"
                    type="number"
                    name="tokenPrice"
                    value={formData.tokenPrice}
                    onChange={handleChange}
                    min="1"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 50-200 cents</p>
                </div>
                
                <div>
                  <Label htmlFor="initialSupply" className="block text-sm font-medium mb-2">Initial Token Supply</Label>
                  <div className="flex flex-col space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[10000, 50000, 100000].map(amount => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedTokenAmount === amount ? "default" : "outline"}
                          className={selectedTokenAmount === amount ? "bg-token-purple" : ""}
                          onClick={() => {
                            setSelectedTokenAmount(amount);
                            setFormData(prev => ({ ...prev, initialSupply: amount }));
                          }}
                        >
                          {amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <Input
                      id="initialSupply"
                      type="number"
                      name="initialSupply"
                      value={formData.initialSupply}
                      onChange={(e) => {
                        handleChange(e);
                        setSelectedTokenAmount(parseInt(e.target.value));
                      }}
                      min="1000"
                      placeholder="Custom amount"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 10,000-100,000 tokens</p>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Revenue Model</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-medium">NFT IP Ownership</h4>
                    <p className="text-sm text-muted-foreground">Earn 30% of all token transactions</p>
                  </div>
                  <div className="text-token-blue font-medium">30%</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-medium">Creator Royalty</h4>
                    <p className="text-sm text-muted-foreground">Your share of token revenue</p>
                  </div>
                  <div className="text-token-purple font-medium">40%</div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="font-medium">Platform Fee</h4>
                    <p className="text-sm text-muted-foreground">ChatCoin NFT platform cut</p>
                  </div>
                  <div className="text-muted-foreground font-medium">30%</div>
                </div>
              </div>
            </div>
            
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Initial Market Cap</span>
                  <span className="font-medium">${(formData.tokenPrice * formData.initialSupply / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Initial Tokens</span>
                  <span className="font-medium">{(formData.initialSupply * 0.2).toLocaleString()} (20%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available for Public</span>
                  <span className="font-medium">{(formData.initialSupply * 0.8).toLocaleString()} (80%)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between">
            <Button 
              onClick={handlePrevStep}
              variant="outline"
            >
              Back
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={isCreating}
              className="bg-token-purple hover:bg-token-purple/90 px-8"
            >
              {isCreating ? 'Creating...' : 'Create Chatbot'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotCreator;
