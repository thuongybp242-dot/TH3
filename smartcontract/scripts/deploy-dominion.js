const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Đang deploy DominionDAO...");
  const DominionDAO = await hre.ethers.getContractFactory("DominionDAO");
  const dominionDAO = await DominionDAO.deploy();

  await dominionDAO.deployed();

  console.log("DominionDAO deployed to:", dominionDAO.address);

  // Lưu ABI và contract address cho frontend web3-app
  const artifactPath = path.join(__dirname, "../artifacts/contracts/DominionDAO.sol/DominionDAO.json");
  const targetAbisDir = path.join(__dirname, "../../web3-app/src/abis");
  
  if (fs.existsSync(artifactPath)) {
    if (!fs.existsSync(targetAbisDir)) {
      fs.mkdirSync(targetAbisDir, { recursive: true });
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    fs.writeFileSync(
      path.join(targetAbisDir, "DominionDAO.json"),
      JSON.stringify(artifact, null, 2)
    );
    console.log(`Đã sao chép ABI sang: ${path.join(targetAbisDir, "DominionDAO.json")}`);
  }

  console.log("\n=======================================================");
  console.log("HƯỚNG DẪN CẤU HÌNH FRONTEND:");
  console.log(`Hãy mở file web3-app/.env và cập nhật:`);
  console.log(`REACT_APP_CONTRACT_ADDRESS=${dominionDAO.address}`);
  console.log("=======================================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
