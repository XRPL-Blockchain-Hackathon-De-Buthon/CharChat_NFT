// ChatbotFactory 배포 스크립트 (XRPL EVM 사이드체인용)

const hre = require("hardhat");

async function main() {
  console.log("🚀 XRPL EVM 사이드체인에 ChatbotFactory 컨트랙트 배포 시작...");

  // ChatbotFactory 컨트랙트 가져오기
  const ChatbotFactory = await hre.ethers.getContractFactory("ChatbotFactory");
  
  // 컨트랙트 배포
  console.log("컨트랙트 배포 중...");
  const factory = await ChatbotFactory.deploy();
  
  // 배포 완료 대기
  console.log("배포 트랜잭션 확인 대기 중...");
  await factory.waitForDeployment();
  
  // 배포된 컨트랙트 주소 출력
  const factoryAddress = await factory.getAddress();
  console.log(`✅ ChatbotFactory 컨트랙트가 ${factoryAddress} 주소에 배포되었습니다.`);
  console.log("이 주소를 src/lib/nftContract.ts 파일의 CHATBOT_FACTORY_ADDRESS 값으로 업데이트하세요.");

  return {
    factoryAddress,
  };
}

// 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ 배포 중 오류 발생:", error);
    console.error(error);
    process.exit(1);
  }); 