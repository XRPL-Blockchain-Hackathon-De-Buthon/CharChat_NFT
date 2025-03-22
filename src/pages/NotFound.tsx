
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      
      <button 
        onClick={() => navigate("/")}
        className="bg-white text-black font-medium px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-colors"
      >
        <Home size={20} />
        <span>Return Home</span>
      </button>
    </div>
  );
};

export default NotFound;
