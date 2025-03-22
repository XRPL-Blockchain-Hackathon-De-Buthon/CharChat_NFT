// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ChatbotToken
 * @dev AI 챗봇과 상호작용하기 위한 토큰
 * 일정 수량 이상 보유 시 슈퍼챗 기능 사용 가능
 */
contract ChatbotToken is ERC20, ERC20Burnable, Ownable {
    // 슈퍼챗 기능 사용에 필요한 최소 토큰 보유량
    uint256 public superChatThreshold;
    
    // 슈퍼챗 이벤트
    event SuperChatRequested(address indexed user, uint256 tokenAmount, string message);
    
    /**
     * @dev 생성자
     * @param name 토큰 이름
     * @param symbol 토큰 심볼
     * @param initialSupply 초기 발행량
     * @param _superChatThreshold 슈퍼챗 사용 최소 보유량
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _superChatThreshold
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
        superChatThreshold = _superChatThreshold * (10 ** decimals());
    }
    
    /**
     * @dev 추가 토큰 발행 (오너만 가능)
     * @param to 받는 주소
     * @param amount 발행량
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev 슈퍼챗 사용 가능 여부 확인
     * @param user 확인할 사용자 주소
     * @return 슈퍼챗 사용 가능 여부
     */
    function canUseSuperChat(address user) public view returns (bool) {
        return balanceOf(user) >= superChatThreshold;
    }
    
    /**
     * @dev 슈퍼챗 기능 사용 (토큰 사용)
     * @param tokenAmount 슈퍼챗에 사용할 토큰 수량
     * @param message 슈퍼챗 메시지
     */
    function useSuperChat(uint256 tokenAmount, string calldata message) external {
        require(canUseSuperChat(msg.sender), "Not enough tokens to use SuperChat");
        require(tokenAmount <= balanceOf(msg.sender), "Insufficient token balance");
        require(tokenAmount > 0, "Token amount must be greater than 0");
        
        // 토큰 소각 (슈퍼챗에 사용된 토큰은 소각됨)
        _burn(msg.sender, tokenAmount);
        
        // 슈퍼챗 이벤트 발생
        emit SuperChatRequested(msg.sender, tokenAmount, message);
    }
    
    /**
     * @dev 슈퍼챗 사용 기준 수정 (오너만 가능)
     * @param newThreshold 새 기준값
     */
    function updateSuperChatThreshold(uint256 newThreshold) external onlyOwner {
        superChatThreshold = newThreshold * (10 ** decimals());
    }
} 