const hre = require("hardhat");

async function main() {
  const SimpleToken = await hre.ethers.getContractFactory("SimpleToken");
  const simpleToken = await SimpleToken.deploy("0x5e6cBeb8C26B52B9DdDBCd3A011f3a268fb2e345");

  await simpleToken.deployed();

  console.log("Deployed to:", simpleToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });