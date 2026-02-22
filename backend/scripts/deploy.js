const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = await hre.ethers.provider.getNetwork();
  const networkName = network.name === "unknown" ? `chainId ${network.chainId}` : network.name;

  // Get the deployer's signer and network
  const [deployer] = await hre.ethers.getSigners();
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log(`\n🚀 Deploying to ${networkName}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${hre.ethers.utils.formatEther(balance)} ETH\n`);

  // Deploy Coin first
  const Coin = await hre.ethers.getContractFactory("Coin");
  const coin = await Coin.deploy();
  await coin.deployed();
  console.log("✅ Coin deployed to:", coin.address);

  // Deploy ZeroLossLottery using the Coin address
  const ZeroLossLottery = await hre.ethers.getContractFactory(
    "ZeroLossLottery"
  );
  const lottery = await ZeroLossLottery.deploy(coin.address);
  await lottery.deployed();
  console.log("✅ ZeroLossLottery deployed to:", lottery.address);

  // Save the contract addresses to backend artifacts
  const contractAddresses = {
    Coin: coin.address,
    ZeroLossLottery: lottery.address,
  };

  const backendPath = path.join(__dirname, "../artifacts/addresses.json");
  fs.writeFileSync(backendPath, JSON.stringify(contractAddresses, null, 2));
  console.log("\n📁 Backend addresses saved to:", backendPath);

  // Copy to frontend artifacts for convenience
  const frontendPath = path.join(__dirname, "../../frontend/src/artifacts/addresses.json");
  if (fs.existsSync(path.dirname(frontendPath))) {
    fs.writeFileSync(frontendPath, JSON.stringify(contractAddresses, null, 2));
    console.log("📁 Frontend addresses updated:", frontendPath);
  }

  console.log("\n✨ Deployment complete!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
