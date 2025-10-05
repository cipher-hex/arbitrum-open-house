const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy Coin first
  const Coin = await hre.ethers.getContractFactory("Coin");
  const coin = await Coin.deploy();
  await coin.deployed();
  console.log("Coin deployed to:", coin.address);

  // Deploy ZeroLossLottery using the Coin address
  const ZeroLossLottery = await hre.ethers.getContractFactory(
    "ZeroLossLottery"
  );
  const lottery = await ZeroLossLottery.deploy(coin.address);
  await lottery.deployed();
  console.log("ZeroLossLottery deployed to:", lottery.address);

  // Save the contract addresses to a file that the frontend can access
  const contractAddresses = {
    Coin: coin.address,
    ZeroLossLottery: lottery.address,
  };

  // Create a config file for the frontend
  fs.writeFileSync(
    path.join(__dirname, "../artifacts/addresses.json"),
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("Contract addresses saved to addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
