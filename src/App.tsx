
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Pages
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Marketplace from "./pages/Marketplace";
import MyChatbots from "./pages/MyChatbots";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import NFTDetail from "./pages/NFTDetail";
import TokenDetail from "./pages/TokenDetail";

// Components
import NavBar from "./components/NavBar";

const queryClient = new QueryClient();

// ScrollToTop component to reset scroll position on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Main layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const showNavBar = !location.pathname.includes("/chat/");
  
  return (
    <>
      {children}
      {showNavBar && <NavBar />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/my-chatbots" element={<MyChatbots />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/token/:id" element={<TokenDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
