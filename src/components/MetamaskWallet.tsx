
import { useState, useEffect } from "react";
import { Wallet, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MetamaskWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(true);
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
          const balanceHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [accounts[0], 'latest'],
          });
          // Convert hex balance to ETH
          const balanceWei = parseInt(balanceHex, 16);
          const balanceEth = balanceWei / 10**18;
          setBalance(balanceEth.toFixed(4));
        }
      } catch (error) {
        console.error("Error checking if wallet is connected:", error);
      }
    } else {
      setIsInstalled(false);
    }
  };
  
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]);
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        // Convert hex balance to ETH
        const balanceWei = parseInt(balanceHex, 16);
        const balanceEth = balanceWei / 10**18;
        setBalance(balanceEth.toFixed(4));
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      window.open("https://metamask.io/download/", "_blank");
    }
  };
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {isConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                <Wallet size={14} className="text-white" />
              </div>
              <span>{formatAddress(account || "")}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                  <Wallet size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-medium">MetaMask Connected</div>
                  <div className="text-sm text-muted-foreground">{formatAddress(account || "")}</div>
                </div>
                <div className="ml-auto flex items-center justify-center h-6 w-6 bg-green-500/20 text-green-500 rounded-full">
                  <Check size={14} />
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="text-xl font-bold">{balance} ETH</div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <ExternalLink size={14} className="mr-2" />
                  View on Etherscan
                </Button>
                <Button variant="outline" size="sm" className="justify-start text-red-500 hover:text-red-500">
                  Disconnect
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Button 
          onClick={connectWallet}
          className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 border border-white/10"
        >
          <Wallet size={16} />
          <span>{isInstalled ? "Connect" : "Install MetaMask"}</span>
        </Button>
      )}
    </div>
  );
};

export default MetamaskWallet;
