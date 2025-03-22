// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./AIChatbotNFT.sol";

/**
 * @title ChatbotFactory
 * @dev 사용자가 여러 개의 AIChatbotNFT 컨트랙트를 생성할 수 있게 해주는 팩토리 컨트랙트
 */
contract ChatbotFactory {
    // 사용자별 생성한 챗봇 컨트랙트 주소 저장
    mapping(address => address[]) public userChatbots;
    
    // 모든 챗봇 컨트랙트 주소 저장
    address[] public allChatbots;
    
    // 챗봇 생성 이벤트
    event ChatbotCreated(address indexed creator, address chatbotContract, string name);
    
    /**
     * @dev 새로운 챗봇 NFT 컨트랙트 생성
     * @param name NFT 컬렉션 이름
     * @param symbol NFT 컬렉션 심볼
     * @param initialPromptTemplate 초기 프롬프트 템플릿
     * @param initialPrice 초기 판매 가격
     */
    function createChatbot(
        string memory name,
        string memory symbol,
        string memory initialPromptTemplate,
        uint256 initialPrice
    ) external returns (address) {
        // 새로운 AIChatbotNFT 컨트랙트 배포
        AIChatbotNFT newChatbot = new AIChatbotNFT(
            name,
            symbol,
            initialPromptTemplate,
            initialPrice
        );
        
        // 컨트랙트 소유권을 메시지 발신자(사용자)에게 이전
        newChatbot.transferOwnership(msg.sender);
        
        // 사용자의 챗봇 목록에 추가
        userChatbots[msg.sender].push(address(newChatbot));
        
        // 전체 챗봇 목록에 추가
        allChatbots.push(address(newChatbot));
        
        // 이벤트 발생
        emit ChatbotCreated(msg.sender, address(newChatbot), name);
        
        return address(newChatbot);
    }
    
    /**
     * @dev 사용자의 챗봇 목록 조회
     * @param user 조회할 사용자 주소
     * @return 사용자가 생성한 챗봇 컨트랙트 주소 배열
     */
    function getUserChatbots(address user) external view returns (address[] memory) {
        return userChatbots[user];
    }
    
    /**
     * @dev 전체 챗봇 개수 조회
     * @return 전체 챗봇 개수
     */
    function getTotalChatbots() external view returns (uint256) {
        return allChatbots.length;
    }
} 