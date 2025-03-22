import { ethers, BrowserProvider } from 'ethers';

// 로컬 Hardhat 네트워크 설정
export const HARDHAT_CHAIN_ID = '9999999'; 
export const HARDHAT_HEX_CHAIN_ID = '0x98967F'; // 16진수 형태의 체인 ID (9999999)
export const HARDHAT_RPC_URL = 'http://127.0.0.1:8545'; // 로컬 Hardhat 노드 URL
export const HARDHAT_NETWORK_NAME = 'Custom Hardhat Network';

// XRPL EVM 사이드체인 설정
export const XRPL_EVM_CHAIN_ID = '1440002'; 
export const XRPL_EVM_HEX_CHAIN_ID = '0x15F3A2'; 
export const XRPL_EVM_RPC_URL = 'https://rpc-evm-sidechain.xrpl.org'; 
export const XRPL_EVM_NETWORK_NAME = 'XRPL EVM Sidechain Devnet';
export const XRPL_EVM_BLOCK_EXPLORER_URL = 'https://evm-sidechain.xrpl.org';

// 현재 사용할 네트워크 설정 (XRPL EVM 사이드체인으로 설정)
export const CURRENT_CHAIN_ID = XRPL_EVM_CHAIN_ID;
export const CURRENT_HEX_CHAIN_ID = XRPL_EVM_HEX_CHAIN_ID;
export const CURRENT_RPC_URL = XRPL_EVM_RPC_URL;
export const CURRENT_NETWORK_NAME = XRPL_EVM_NETWORK_NAME;

// 블록 익스플로러 URL (MetamaskWallet.tsx에서 사용)
export const BLOCK_EXPLORER_URL = XRPL_EVM_BLOCK_EXPLORER_URL;

// ethers v6 방식으로 메타마스크 프로바이더 가져오기
export const getProvider = () => {
  if (!window.ethereum) {
    throw new Error('메타마스크가 설치되어 있지 않습니다');
  }
  return new BrowserProvider(window.ethereum);
};

// 네트워크 확인 및 전환
export const checkAndSwitchNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('메타마스크가 설치되어 있지 않습니다');
  }

  try {
    // 현재 체인 ID 가져오기
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    // 체인 ID가 현재 설정된 네트워크가 아니면 전환
    if (chainId !== CURRENT_HEX_CHAIN_ID) {
      try {
        // 체인 변경 시도
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CURRENT_HEX_CHAIN_ID }],
        });
      } catch (switchError: { code: number } | unknown) {
        // 체인이 지갑에 추가되지 않은 경우 추가
        if (switchError && typeof switchError === 'object' && 'code' in switchError && switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: CURRENT_HEX_CHAIN_ID,
                chainName: CURRENT_NETWORK_NAME,
                rpcUrls: [CURRENT_RPC_URL],
                nativeCurrency: {
                  name: 'XRP',
                  symbol: 'XRP',
                  decimals: 18,
                },
                blockExplorerUrls: [XRPL_EVM_BLOCK_EXPLORER_URL],
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('네트워크 전환 중 오류 발생:', error);
    throw error;
  }
};

// 연결된 계정 가져오기
export const getAccounts = async () => {
  const provider = await getProvider();
  const accounts = await provider.listAccounts();
  return accounts;
};

// 서명자 가져오기
export const getSigner = async () => {
  const provider = await getProvider();
  return await provider.getSigner();
};

// 지갑 연결 상태 확인
export const getConnectionStatus = async () => {
  if (!window.ethereum) {
    return { isConnected: false, account: null, chainId: null };
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
    
    return {
      isConnected: accounts.length > 0,
      account: accounts.length > 0 ? accounts[0] : null,
      chainId,
    };
  } catch (error) {
    console.error('지갑 연결 상태 확인 중 오류 발생:', error);
    return { isConnected: false, account: null, chainId: null };
  }
};

// 지갑 연결 요청
export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('메타마스크가 설치되어 있지 않습니다');
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
    await checkAndSwitchNetwork();
    
    return {
      isConnected: accounts.length > 0,
      account: accounts.length > 0 ? accounts[0] : null,
    };
  } catch (error) {
    console.error('지갑 연결 중 오류 발생:', error);
    throw error;
  }
};

// 이벤트 리스너 추가
export const addWalletListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void
) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', onAccountsChanged);
    window.ethereum.on('chainChanged', onChainChanged);
  }
};

// 이벤트 리스너 제거
export const removeWalletListeners = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void
) => {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    window.ethereum.removeListener('chainChanged', onChainChanged);
  }
}; 