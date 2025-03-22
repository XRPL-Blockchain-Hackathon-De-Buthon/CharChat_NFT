import { useState, useEffect } from 'react';
import { Wallet, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  getConnectionStatus, 
  connectWallet, 
  addWalletListeners, 
  removeWalletListeners,
  BLOCK_EXPLORER_URL,
  XRPL_EVM_HEX_CHAIN_ID
} from '@/lib/web3Provider';

// Ethereum Provider 인터페이스 정의
interface RequestArguments {
  method: string;
  params?: unknown[];
}

// 특정 이벤트 콜백 타입
type AccountsChangedCallback = (accounts: string[]) => void;
type ChainChangedCallback = (chainId: string) => void;

interface EthereumProvider {
  request: (args: RequestArguments) => Promise<unknown>;
  on(event: 'accountsChanged', listener: AccountsChangedCallback): void;
  on(event: 'chainChanged', listener: ChainChangedCallback): void;
  on(event: string, listener: (params: unknown) => void): void;
  removeListener(event: 'accountsChanged', listener: AccountsChangedCallback): void;
  removeListener(event: 'chainChanged', listener: ChainChangedCallback): void;
  removeListener(event: string, listener: (params: unknown) => void): void;
  isMetaMask?: boolean;
}

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

const MetamaskWallet = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [isInstalled, setIsInstalled] = useState(true);
    const [chainId, setChainId] = useState<string | null>(null);

    // XRPL EVM 사이드체인 데브넷 설정 (샘플값, 실제 값으로 변경 필요)
    const XRPL_EVM_CHAIN_ID = '1440002'; // XRPL EVM 사이드체인 체인 ID
    const XRPL_EVM_RPC_URL = 'https://rpc-evm-sidechain.xrpl.org'; // 임시 예시 URL
    const NETWORK_NAME = 'XRPL EVM Sidechain Devnet';

    useEffect(() => {
        checkIfWalletIsInstalled();
        checkIfWalletIsConnected();

        // 메타마스크 이벤트 리스너 설정
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                // 사용자가 연결을 해제했습니다
                setIsConnected(false);
                setAccount(null);
                setBalance(null);
            } else if (accounts[0] !== account) {
                setAccount(accounts[0]);
                fetchBalance(accounts[0]);
            }
        };

        const handleChainChanged = (chainId: string) => {
            // 체인 ID가 변경되면 페이지를 새로고침합니다
            setChainId(chainId);
            window.location.reload();
        };

        addWalletListeners(handleAccountsChanged, handleChainChanged);

        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 정리
            removeWalletListeners(handleAccountsChanged, handleChainChanged);
        };
    }, [account]);

    const checkIfWalletIsInstalled = () => {
        if (!window.ethereum) {
            setIsInstalled(false);
            console.log('MetaMask is not installed!');
            return false;
        }
        return true;
    };

    const checkIfWalletIsConnected = async () => {
        if (!checkIfWalletIsInstalled()) return;

        try {
            const { isConnected: connected, account: connectedAccount, chainId: currentChainId } = await getConnectionStatus();
            
            if (connected && connectedAccount) {
                setIsConnected(true);
                setAccount(connectedAccount);
                setChainId(currentChainId);
                fetchBalance(connectedAccount);
            }
        } catch (error) {
            console.error('Error checking if wallet is connected:', error);
        }
    };

    const handleConnectWallet = async () => {
        if (!checkIfWalletIsInstalled()) {
            window.open('https://metamask.io/download.html', '_blank');
            return;
        }

        try {
            const { isConnected: connected, account: connectedAccount } = await connectWallet();
            
            if (connected && connectedAccount) {
                setIsConnected(true);
                setAccount(connectedAccount);
                fetchBalance(connectedAccount);
                
                // 현재 체인 ID 가져오기
                const response = await window.ethereum?.request({ method: 'eth_chainId' });
                if (response && typeof response === 'string') {
                    setChainId(response);
                }
            }
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    };

    const fetchBalance = async (address: string) => {
        try {
            const response = await window.ethereum?.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            });
            
            if (response && typeof response === 'string') {
                // wei에서 ETH로 변환 (XRPL EVM에서는 XRP 단위로 표시할 수 있음)
                const ethBalance = parseInt(response, 16) / 1e18;
                setBalance(ethBalance.toFixed(4));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    const disconnectWallet = () => {
        setIsConnected(false);
        setAccount(null);
        setBalance(null);
        // 메타마스크에는 직접적인 연결 해제 메서드가 없으므로, 상태만 리셋합니다
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
                            <span>{formatAddress(account || '')}</span>
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
                                    <div className="text-sm text-muted-foreground">{formatAddress(account || '')}</div>
                                </div>
                                <div className="ml-auto flex items-center justify-center h-6 w-6 bg-green-500/20 text-green-500 rounded-full">
                                    <Check size={14} />
                                </div>
                            </div>

                            <div className="p-3 bg-white/5 rounded-lg">
                                <div className="text-sm text-muted-foreground">Balance</div>
                                <div className="text-xl font-bold">{balance} XRP</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="justify-start"
                                    onClick={() => window.open(`${BLOCK_EXPLORER_URL}/address/${account}`, '_blank')}
                                >
                                    <ExternalLink size={14} className="mr-2" />
                                    View on XRPL Explorer
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="justify-start text-red-500 hover:text-red-500"
                                    onClick={disconnectWallet}
                                >
                                    Disconnect
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            ) : (
                <Button
                    onClick={handleConnectWallet}
                    className="bg-white/10 hover:bg-white/15 text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 border border-white/10"
                >
                    <Wallet size={16} />
                    <span>{isInstalled ? 'Connect Wallet' : 'Install MetaMask'}</span>
                </Button>
            )}
        </div>
    );
};

export default MetamaskWallet;
