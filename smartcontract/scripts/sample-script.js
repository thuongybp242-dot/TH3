const hre = require("hardhat");

async function main() {
  const FirstSmartContract = await hre.ethers.getContractFactory("FirstSmartContract");
  const firstSmartContract = await FirstSmartContract.deploy();

  await firstSmartContract.deployed();

  console.log("FirstSmartContract deployed to:", firstSmartContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
