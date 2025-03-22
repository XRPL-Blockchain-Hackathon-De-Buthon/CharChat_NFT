require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 9999999
    },
    xrplEvm: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1440002
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}; 