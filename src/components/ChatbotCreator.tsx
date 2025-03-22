
import { useState } from "react";
import { Upload, X, Bot, Brain, Coins, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatbotCreator = () => {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tokenPrice: 100,
    initialSupply: 10000
  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
  };
  
  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
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
                <Brain size={20} />
              ) : (
                <Coins size={20} />
              )}
            </div>
            <div className="text-sm font-medium">
              {i === 1 ? 'Basic Info' : i === 2 ? 'Personality' : 'Tokenomics'}
            </div>
            
            {i < 3 && (
              <div className={`h-0.5 w-full mt-2 ${i < step ? 'bg-token-purple' : 'bg-white/10'}`}></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Create Your Chatbot</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Chatbot Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Creative Assistant"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Chatbot Image</label>
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <label className="block w-40 h-40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition">
                  <Upload size={24} className="mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What does your chatbot do? What is its purpose?"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple min-h-[100px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
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
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleNextStep}
              className="bg-token-purple hover:bg-token-purple/90 px-8"
              disabled={!formData.name || !imagePreview || !formData.description || !formData.category}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Step 2: Personality */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Define Your Chatbot's Personality</h2>
          
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Personality Traits</h3>
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
              <h3 className="text-lg font-medium mb-4">Knowledge Areas</h3>
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
              <h3 className="text-lg font-medium mb-4">Initial Prompt</h3>
              <p className="text-sm text-muted-foreground mb-4">This is the base instruction set for your chatbot's behavior.</p>
              
              <textarea
                placeholder="You are a helpful assistant that..."
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple min-h-[150px]"
              ></textarea>
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
      
      {/* Step 3: Tokenomics */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-6">Set Up Your Chatbot's Tokenomics</h2>
          
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-medium mb-4">Token Configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Token Price (in USD cents)</label>
                  <input
                    type="number"
                    name="tokenPrice"
                    value={formData.tokenPrice}
                    onChange={handleChange}
                    min="1"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 50-200 cents</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Token Supply</label>
                  <input
                    type="number"
                    name="initialSupply"
                    value={formData.initialSupply}
                    onChange={handleChange}
                    min="1000"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-token-purple"
                  />
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
            <Button className="bg-token-purple hover:bg-token-purple/90 px-8">
              Create Chatbot
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotCreator;
