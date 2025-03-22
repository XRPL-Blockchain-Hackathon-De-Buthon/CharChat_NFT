
import { Home, ShoppingCart, MessageSquare, Bell, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import MetamaskWallet from "./MetamaskWallet";

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-secondary border-t border-border flex items-center justify-around px-6 z-50">
      <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
        <Home size={24} />
        <span className="text-xs">Home</span>
      </Link>
      
      <Link to="/marketplace" className={`nav-link ${isActive("/marketplace") ? "active" : ""}`}>
        <ShoppingCart size={24} />
        <span className="text-xs">Market</span>
      </Link>
      
      <Link to="/my-chatbots" className={`nav-link ${isActive("/my-chatbots") ? "active" : ""}`}>
        <User size={24} />
        <span className="text-xs">My Bots</span>
      </Link>
      
      <Link to="/notifications" className={`nav-link ${isActive("/notifications") ? "active" : ""}`}>
        <Bell size={24} />
        <span className="text-xs">Alerts</span>
      </Link>

      <div className="fixed top-4 right-4">
        <MetamaskWallet />
      </div>
    </div>
  );
};

export default NavBar;
