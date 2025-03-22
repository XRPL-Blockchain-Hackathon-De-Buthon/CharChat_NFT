// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AIChatbotNFT
 * @dev 단 하나의 AI 챗봇 NFT를 발행하는 컨트랙트
 * NFT 소유자는 AI 프롬프트를 수정할 수 있는 권한을 가짐
 */
contract AIChatbotNFT is ERC721, ERC721Enumerable, Ownable {
    // NFT ID 카운터
    uint256 private _tokenIdCounter;
    
    // AI 챗봇 NFT의 최대 공급량 = 1
    uint256 public constant MAX_SUPPLY = 1;
    
    // 챗봇의 현재 프롬프트
    string private _promptTemplate;
    
    // 초기 판매 가격
    uint256 public initialPrice;
    
    // NFT가 이미 발행되었는지 확인
    bool public isNFTMinted;
    
    // NFT 소유자가 수정한 프롬프트 이벤트
    event PromptUpdated(address indexed owner, string newPrompt);
    
    /**
     * @dev 생성자
     * @param name NFT 컬렉션 이름
     * @param symbol NFT 컬렉션 심볼
     * @param initialPromptTemplate 초기 프롬프트 템플릿
     * @param _initialPrice 초기 판매 가격
     */
    constructor(
        string memory name,
        string memory symbol,
        string memory initialPromptTemplate,
        uint256 _initialPrice
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _promptTemplate = initialPromptTemplate;
        initialPrice = _initialPrice;
        isNFTMinted = false;
    }
    
    /**
     * @dev 초기 NFT 발행 함수
     * 단 하나의 NFT만 발행 가능
     */
    function mintInitialNFT() external payable onlyOwner {
        require(!isNFTMinted, "NFT is already minted");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        isNFTMinted = true;
    }
    
    /**
     * @dev NFT 소유자만 호출 가능한 프롬프트 수정 함수
     * @param newPromptTemplate 새로운 프롬프트 템플릿
     */
    function updatePromptTemplate(string calldata newPromptTemplate) external {
        require(balanceOf(msg.sender) > 0, "Only NFT owner can update prompt");
        _promptTemplate = newPromptTemplate;
        
        emit PromptUpdated(msg.sender, newPromptTemplate);
    }
    
    /**
     * @dev 현재 프롬프트 템플릿 조회 함수
     * @return 현재 프롬프트 템플릿
     */
    function getPromptTemplate() external view returns (string memory) {
        return _promptTemplate;
    }
    
    /**
     * @dev NFT 소유자 조회 함수
     * @return NFT 소유자 주소
     */
    function getNFTOwner() external view returns (address) {
        require(isNFTMinted, "NFT not yet minted");
        return ownerOf(0); // 항상 tokenId = 0
    }
    
    /**
     * @dev 프롬프트 변경 권한 확인 함수
     * @param user 확인할 사용자 주소
     * @return 프롬프트 변경 권한 여부
     */
    function canUpdatePrompt(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }
    
    // OpenZeppelin 필수 오버라이드 함수들
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }
    
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 