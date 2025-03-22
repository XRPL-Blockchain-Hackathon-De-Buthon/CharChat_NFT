
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatbotCreator from "@/components/ChatbotCreator";

const CreateChatbot = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pb-20 animate-fade-in">
      <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <button 
          onClick={() => navigate("/my-chatbots")}
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold">Create New Chatbot</h1>
      </header>
      
      <main>
        <ChatbotCreator />
      </main>
    </div>
  );
};

export default CreateChatbot;
