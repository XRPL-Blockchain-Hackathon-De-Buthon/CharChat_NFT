import { ethers } from 'ethers';
import { getSigner, XRPL_EVM_RPC_URL } from './web3Provider';

// NFT Contract ABI (example, modify according to actual contract)
export const NFT_CONTRACT_ABI = [
  // ERC721 standard functions
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function approve(address to, uint256 tokenId)',
  'function getApproved(uint256 tokenId) view returns (address)',
  'function setApprovalForAll(address operator, bool approved)',
  'function isApprovedForAll(address owner, address operator) view returns (bool)',
  'function transferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
  'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',

  // AIChatbotNFT functions
  'function getPromptTemplate() view returns (string)',
  'function updatePromptTemplate(string calldata newPromptTemplate)',
  'function mintInitialNFT()',
  'function getNFTOwner() view returns (address)',
  'function canUpdatePrompt(address user) view returns (bool)',
  'function isNFTMinted() view returns (bool)',
  'function transferOwnership(address newOwner)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
  'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
  'event PromptUpdated(address indexed owner, string newPrompt)'
];

// Token Contract ABI
export const TOKEN_CONTRACT_ABI = [
  // ERC20 standard functions
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',

  // ChatbotToken functions
  'function mint(address to, uint256 amount)',
  'function canUseSuperChat(address user) view returns (bool)',
  'function useSuperChat()',
  'function updateSuperChatThreshold(uint256 newThreshold)',
  'function getSuperChatThreshold() view returns (uint256)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event SuperChatRequested(address indexed user, uint256 timestamp)',
  'event SuperChatThresholdUpdated(uint256 newThreshold)'
];

// Chatbot Factory Contract ABI
export const CHATBOT_FACTORY_ABI = [
  'function createChatbot(string memory name, string memory symbol, string memory initialPromptTemplate, uint256 initialPrice) returns (address)',
  'function getUserChatbots(address user) view returns (address[])',
  'function getTotalChatbots() view returns (uint256)',
  'function userChatbots(address, uint256) view returns (address)',
  'function allChatbots(uint256) view returns (address)',
  
  // Events
  'event ChatbotCreated(address indexed creator, address chatbotContract, string name)'
];

// Deployed contract addresses on XRPL EVM sidechain
export const NFT_CONTRACT_ADDRESS = '0x7f939e09Dfc7e1AEe009B50cb7e68cCd1D82A0c9';
export const TOKEN_CONTRACT_ADDRESS = '0x1FA7cF651292Cfa4a0F89Ef3dcA6078E509D3Ac8';
// Factory contract address (update this value after deployment)
export const CHATBOT_FACTORY_ADDRESS = '0x6221f02562505f5038B5672ecc12D28DFCf05ee5';

// Get NFT contract instance
export const getNFTContract = async (withSigner = true) => {
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  } else {
    // Modified for ethers v6
    const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
    return new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, provider);
  }
};

// Get Token contract instance
export const getTokenContract = async (withSigner = true) => {
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, signer);
  } else {
    const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
    return new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_CONTRACT_ABI, provider);
  }
};

// Mint initial NFT (owner only)
export const mintInitialNFT = async () => {
  try {
    const contract = await getNFTContract();
    const tx = await contract.mintInitialNFT();
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while minting NFT:', error);
    return {
      success: false,
      error
    };
  }
};

// Get prompt template
export const getPromptTemplate = async () => {
  try {
    const contract = await getNFTContract(false);
    const promptTemplate = await contract.getPromptTemplate();
    
    return {
      success: true,
      promptTemplate
    };
  } catch (error) {
    console.error('Error while getting prompt template:', error);
    return {
      success: false,
      error
    };
  }
};

// Update prompt template (NFT owner only)
export const updatePromptTemplate = async (newPromptTemplate: string) => {
  try {
    const contract = await getNFTContract();
    const tx = await contract.updatePromptTemplate(newPromptTemplate);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while updating prompt template:', error);
    return {
      success: false,
      error
    };
  }
};

// Check NFT owner
export const getNFTOwner = async () => {
  try {
    const contract = await getNFTContract(false);
    const owner = await contract.getNFTOwner();
    
    return {
      success: true,
      owner
    };
  } catch (error) {
    console.error('Error while checking NFT owner:', error);
    return {
      success: false,
      error
    };
  }
};

// Check prompt update permission
export const canUpdatePrompt = async (userAddress: string) => {
  try {
    const contract = await getNFTContract(false);
    const canUpdate = await contract.canUpdatePrompt(userAddress);
    
    return {
      success: true,
      canUpdate
    };
  } catch (error) {
    console.error('Error while checking prompt update permission:', error);
    return {
      success: false,
      error
    };
  }
};

// Transfer NFT ownership
export const transferNFT = async (to: string, tokenId: string) => {
  try {
    const contract = await getNFTContract();
    const signer = await getSigner();
    const from = await signer.getAddress();
    
    const tx = await contract.transferFrom(from, to, tokenId);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while transferring NFT ownership:', error);
    return {
      success: false,
      error
    };
  }
};

// Check token balance
export const getTokenBalance = async (address: string) => {
  try {
    const contract = await getTokenContract(false);
    const balance = await contract.balanceOf(address);
    
    return {
      success: true,
      balance: ethers.formatUnits(balance, 18) // Assuming 18 decimals
    };
  } catch (error) {
    console.error('Error while checking token balance:', error);
    return {
      success: false,
      error
    };
  }
};

// Mint tokens (owner only)
export const mintTokens = async (to: string, amount: string) => {
  try {
    const contract = await getTokenContract();
    const amountWei = ethers.parseUnits(amount, 18); // Assuming 18 decimals
    const tx = await contract.mint(to, amountWei);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while minting tokens:', error);
    return {
      success: false,
      error
    };
  }
};

// Check if super chat can be used
export const canUseSuperChat = async (address: string) => {
  try {
    const contract = await getTokenContract(false);
    const canUse = await contract.canUseSuperChat(address);
    
    return {
      success: true,
      canUse
    };
  } catch (error) {
    console.error('Error while checking super chat availability:', error);
    return {
      success: false,
      error
    };
  }
};

// Use super chat
export const useSuperChat = async () => {
  try {
    const contract = await getTokenContract();
    const tx = await contract.useSuperChat();
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while using super chat:', error);
    return {
      success: false,
      error
    };
  }
};

// Get super chat threshold
export const getSuperChatThreshold = async () => {
  try {
    const contract = await getTokenContract(false);
    const threshold = await contract.getSuperChatThreshold();
    
    return {
      success: true,
      threshold: ethers.formatUnits(threshold, 18) // Assuming 18 decimals
    };
  } catch (error) {
    console.error('Error while checking super chat threshold:', error);
    return {
      success: false,
      error
    };
  }
};

// Update super chat threshold (owner only)
export const updateSuperChatThreshold = async (newThreshold: string) => {
  try {
    const contract = await getTokenContract();
    const thresholdWei = ethers.parseUnits(newThreshold, 18); // Assuming 18 decimals
    const tx = await contract.updateSuperChatThreshold(thresholdWei);
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error while updating super chat threshold:', error);
    return {
      success: false,
      error
    };
  }
};

// Get chatbot factory contract instance
export const getChatbotFactoryContract = async (withSigner = true) => {
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(CHATBOT_FACTORY_ADDRESS, CHATBOT_FACTORY_ABI, signer);
  } else {
    const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
    return new ethers.Contract(CHATBOT_FACTORY_ADDRESS, CHATBOT_FACTORY_ABI, provider);
  }
};

// Create new chatbot contract
export const createNewChatbot = async (
  name: string,
  symbol: string,
  initialPromptTemplate: string,
  initialPrice: number
): Promise<{ success: boolean; chatbotAddress?: string; transactionHash?: string; error?: unknown }> => {
  try {
    const factoryContract = await getChatbotFactoryContract();
    
    // Convert price to wei
    const priceWei = ethers.parseUnits(initialPrice.toString(), 18);
    
    // Check metadata size
    if (initialPromptTemplate.length > 10000) {
      console.warn('Metadata is too large. This may consume a lot of gas.');
      // Limit to 10000 characters
      initialPromptTemplate = initialPromptTemplate.substring(0, 10000);
    }
    
    // Create new chatbot contract through factory contract (with gas optimization)
    console.log('Creating new chatbot contract...');
    const tx = await factoryContract.createChatbot(
      name, 
      symbol, 
      initialPromptTemplate, 
      priceWei,
      {
        gasLimit: 5000000, // Set gas limit
      }
    );
    console.log('Transaction sent, waiting for confirmation...');
    const receipt = await tx.wait();
    
    // Extract new chatbot contract address from event
    const event = receipt.logs
      .map((log: any) => {
        try {
          return factoryContract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data
          });
        } catch (e) {
          return null;
        }
      })
      .find((event: any) => event && event.name === 'ChatbotCreated');
    
    let chatbotAddress = '';
    if (event) {
      chatbotAddress = event.args.chatbotContract;
      console.log('New chatbot created:', chatbotAddress);
      
      // 자동으로 NFT 민팅 시도
      try {
        // NFT 컨트랙트 ABI
        const nftContractABI = [
          'function mintInitialNFT()',
          'function isNFTMinted() view returns (bool)'
        ];
        
        // signer로 NFT 컨트랙트 연결
        const signer = await getSigner();
        const nftContract = new ethers.Contract(chatbotAddress, nftContractABI, signer);
        
        // NFT가 이미 민팅되었는지 확인
        const isNFTMinted = await nftContract.isNFTMinted();
        if (!isNFTMinted) {
          console.log('Automatically minting initial NFT...');
          const mintTx = await nftContract.mintInitialNFT();
          console.log('Mint transaction sent, waiting for confirmation...');
          const mintReceipt = await mintTx.wait();
          console.log('Initial NFT minted successfully:', mintReceipt.hash);
        } else {
          console.log('NFT is already minted for this chatbot');
        }
      } catch (mintError) {
        console.error('Error during automatic NFT minting:', mintError);
        // 민팅 실패해도 챗봇 생성은 성공한 것으로 간주
      }
    } else {
      console.log('Event not found, check address through getUserChatbots');
    }
    
    return {
      success: true,
      chatbotAddress,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error('Error creating chatbot contract:', error);
    return {
      success: false,
      error
    };
  }
};

// Get all chatbot contract addresses for a user
export const getUserChatbots = async (userAddress: string): Promise<{ success: boolean; chatbots?: string[]; error?: unknown }> => {
  try {
    const factoryContract = await getChatbotFactoryContract(false);
    const chatbots = await factoryContract.getUserChatbots(userAddress);
    
    return {
      success: true,
      chatbots
    };
  } catch (error) {
    console.error('Error retrieving user chatbot list:', error);
    return {
      success: false,
      error
    };
  }
};

// Get prompt template for a specific chatbot contract
export const getChatbotPromptTemplate = async (chatbotAddress: string): Promise<{ success: boolean; promptTemplate?: string; error?: unknown }> => {
  try {
    const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
    const chatbotContract = new ethers.Contract(chatbotAddress, NFT_CONTRACT_ABI, provider);
    
    const promptTemplate = await chatbotContract.getPromptTemplate();
    
    return {
      success: true,
      promptTemplate
    };
  } catch (error) {
    console.error('Error retrieving chatbot prompt template:', error);
    return {
      success: false,
      error
    };
  }
};

// Get owner for a specific chatbot contract
export const getChatbotOwner = async (chatbotAddress: string): Promise<{ success: boolean; owner?: string; error?: unknown }> => {
  try {
    const provider = new ethers.JsonRpcProvider(XRPL_EVM_RPC_URL);
    const chatbotContract = new ethers.Contract(chatbotAddress, NFT_CONTRACT_ABI, provider);
    
    console.log(`Checking is NFT minted for ${chatbotAddress}...`);
    try {
      const isNFTMinted = await chatbotContract.isNFTMinted();
      console.log(`is NFT minted: ${isNFTMinted}`);
    } catch (e) {
      console.error('Error checking if NFT is minted:', e);
    }
    
    console.log(`Getting NFT owner for ${chatbotAddress}...`);
    const owner = await chatbotContract.getNFTOwner();
    console.log(`Chatbot ${chatbotAddress} owner:`, owner);
    
    return {
      success: true,
      owner
    };
  } catch (error) {
    console.error(`Error retrieving chatbot owner for ${chatbotAddress}:`, error);
    // Check if this is the expected error from the contract
    if (error instanceof Error) {
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      // If the error is "NFT not yet minted", we should handle it gracefully
      if (error.message.includes('NFT not yet minted')) {
        return {
          success: false,
          error: new Error('This chatbot NFT has not been minted yet')
        };
      }
    }
    return {
      success: false,
      error
    };
  }
};

// Update prompt template for a specific chatbot (NFT owner only)
export const updateChatbotPromptTemplate = async (chatbotAddress: string, newPromptTemplate: string): Promise<{ success: boolean; transactionHash?: string; error?: unknown }> => {
  try {
    const signer = await getSigner();
    const chatbotContract = new ethers.Contract(chatbotAddress, NFT_CONTRACT_ABI, signer);
    
    // Get current user address
    const signerAddress = await signer.getAddress();
    
    // Check user's token balance first
    console.log(`Checking token balance for user ${signerAddress}...`);
    try {
      const balance = await chatbotContract.balanceOf(signerAddress);
      console.log(`User's token balance: ${balance.toString()}`);
    } catch (e) {
      console.error('Error checking balance:', e);
    }
    
    // Check if user can update prompt
    console.log(`Checking if user ${signerAddress} can update prompt...`);
    const canUpdate = await chatbotContract.canUpdatePrompt(signerAddress);
    console.log(`Can user update prompt: ${canUpdate}`);
    
    if (!canUpdate) {
      try {
        // For debugging, also check who the NFT owner is
        console.log(`Getting NFT owner to verify...`);
        const owner = await chatbotContract.getNFTOwner();
        console.log('Not chatbot owner. Owner:', owner, 'Current user:', signerAddress);
      } catch (e) {
        console.error('Error while checking NFT owner:', e);
      }
      
      return {
        success: false,
        error: new Error('Only the NFT owner can update the prompt template.')
      };
    }
    
    console.log(`Updating prompt template for chatbot ${chatbotAddress}...`);
    const tx = await chatbotContract.updatePromptTemplate(newPromptTemplate);
    console.log('Transaction sent, waiting for confirmation...');
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.hash
    };
  } catch (error) {
    console.error(`Error updating prompt template for ${chatbotAddress}:`, error);
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
    }
    return {
      success: false,
      error
    };
  }
};

// Create chatbot and issue NFT
export const createChatbotNFT = async (
  name: string,
  metadataUri: string,
  initialTokenSupply: number,
  tokenPrice: number
): Promise<{ success: boolean; transactionHash?: string; error?: unknown }> => {
  try {
    // 1. Issue NFT (using AIChatbotNFT contract)
    const nftContract = await getNFTContract();
    
    // Execute NFT minting transaction - contract error will occur if already minted
    console.log('Attempting to mint NFT...');
    const mintTx = await nftContract.mintInitialNFT();
    console.log('Minting transaction sent, waiting for confirmation...');
    const mintReceipt = await mintTx.wait();
    console.log('Minting successful, transaction hash:', mintReceipt.hash);
    
    // 2. Update system prompt
    console.log('Updating prompt template...');
    const updateResult = await updatePromptTemplate(metadataUri);
    if (!updateResult.success) {
      console.error('Failed to update prompt template:', updateResult.error);
      return {
        success: false,
        error: new Error('NFT was created but prompt update failed.')
      };
    }
    console.log('Prompt template update successful');
    
    // 3. Issue tokens using ChatbotToken contract (omitted in POC)
    
    return {
      success: true,
      transactionHash: mintReceipt.hash
    };
  } catch (error) {
    console.error('Error creating chatbot NFT:', error);
    // Output information for error message analysis
    if (error instanceof Error) {
      console.log('Error type:', error.name);
      console.log('Error message:', error.message);
    }
    return {
      success: false,
      error
    };
  }
};