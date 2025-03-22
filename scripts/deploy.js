// AIChatbotNFT와 ChatbotToken 배포 스크립트
import { ethers } from "hardhat";

async function main() {
  console.log("배포 스크립트 시작...");

  // 계정 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("배포 계정:", deployer.address);

  // AIChatbotNFT 배포
  console.log("AIChatbotNFT 컨트랙트 배포 중...");
  const AIChatbotNFT = await ethers.getContractFactory("AIChatbotNFT");
  const aiChatbotNFT = await AIChatbotNFT.deploy(
    "AI Chatbot NFT",                      // 이름
    "ACNFT",                              // 심볼
    "You are a friendly AI assistant.",   // 초기 프롬프트
    ethers.parseEther("0.1")             // 초기 가격 (0.1 ETH)
  );

  await aiChatbotNFT.waitForDeployment();
  console.log("AIChatbotNFT 배포 완료, 주소:", await aiChatbotNFT.getAddress());

  // ChatbotToken 배포
  console.log("ChatbotToken 컨트랙트 배포 중...");
  const ChatbotToken = await ethers.getContractFactory("ChatbotToken");
  const chatbotToken = await ChatbotToken.deploy(
    "Chatbot Token",                      // 이름
    "CTK",                               // 심볼
    1000000,                            // 초기 공급량 (1,000,000 토큰)
    100                                // 슈퍼챗 사용 기준 (100 토큰)
  );

  await chatbotToken.waitForDeployment();
  console.log("ChatbotToken 배포 완료, 주소:", await chatbotToken.getAddress());

  console.log("배포 완료!");
}

// 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 