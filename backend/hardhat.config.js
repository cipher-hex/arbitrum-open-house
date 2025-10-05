require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Handle private key correctly by removing 0x prefix if it exists
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-infura-key";
const FUJI_RPC_URL =
  process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    fuji: {
      url: FUJI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 43113,
    },
    // add poylgon amoy testnet
    polygonAmoy: {
      url: "https://rpc-amoy.polygon.technology",
      accounts: [PRIVATE_KEY],
      chainId: 80002,
    },
    // add zeta-testnet
    zeta: {
      url: "https://zetachain-athens.g.allthatnode.com/archive/evm",
      accounts: [PRIVATE_KEY],
      chainId: 7001,
    },
    // add sonic-testnet
    sonic: {
      url: "https://rpc.testnet.soniclabs.com",
      accounts: [PRIVATE_KEY],
      chainId: 14601,
    },
    // add somnia testnet
    somnia: {
      url: "https://dream-rpc.somnia.network/",
      accounts: [PRIVATE_KEY],
      chainId: 50312,
    },
    // add vechain testnet
    vechain: {
      url: "https://testnet.rpc.vechain.org/",
      accounts: [PRIVATE_KEY],
      chainId: 100010,
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
  },
};
