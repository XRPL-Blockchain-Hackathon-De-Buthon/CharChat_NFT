
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export type WalletStatus = {
  connected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
};

const initialWalletStatus: WalletStatus = {
  connected: false,
  address: null,
  chainId: null,
  balance: null,
};

const MetamaskWallet = () => {
  const [walletStatus, setWalletStatus] = useState<WalletStatus>(initialWalletStatus);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    checkIfWalletIsInstalled();
    checkIfWalletIsConnected();

    if (window.ethereum) {
      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          updateWalletInfo(accounts[0]);
        } else {
          setWalletStatus(initialWalletStatus);
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  const checkIfWalletIsInstalled = () => {
    setIsInstalled(typeof window.ethereum !== "undefined");
  };

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          updateWalletInfo(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking if wallet is connected:", error);
      }
    }
  };

  const updateWalletInfo = async (address: string) => {
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      
      // Convert balance from wei to ETH (1 ETH = 10^18 wei)
      const balanceInWei = parseInt(balanceHex, 16);
      const balanceInEth = balanceInWei / Math.pow(10, 18);
      
      setWalletStatus({
        connected: true,
        address,
        chainId,
        balance: balanceInEth.toFixed(4),
      });
    } catch (error) {
      console.error("Error updating wallet info:", error);
    }
  };

  const connectWallet = async () => {
    if (!isInstalled) {
      toast.error("MetaMask is not installed!", {
        description: "Please install MetaMask to use this feature.",
        action: {
          label: "Install",
          onClick: () => window.open("https://metamask.io/download.html", "_blank"),
        },
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      toast.success("Wallet connected successfully!");
      updateWalletInfo(accounts[0]);
    } catch (error) {
      toast.error("Failed to connect wallet", {
        description: "Please try again or check MetaMask.",
      });
      console.error("Error connecting wallet:", error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!walletStatus.connected) {
    return (
      <Button 
        onClick={connectWallet} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        <Wallet size={16} />
        Connect
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-secondary/70 rounded-full px-3 py-1.5 text-sm">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span title={walletStatus.address || undefined}>
        {walletStatus.address ? formatAddress(walletStatus.address) : "Connected"}
      </span>
      <div className="text-muted-foreground text-xs border-l border-border pl-2">
        {walletStatus.balance} ETH
      </div>
    </div>
  );
};

export default MetamaskWallet;
