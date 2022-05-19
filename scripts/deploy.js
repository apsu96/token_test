async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const Token = await ethers.getContractFactory("SimpleToken");
    const token = await Token.deploy("0x5e6cBeb8C26B52B9DdDBCd3A011f3a268fb2e345");
  
    console.log("Token address:", token.address);
}
  
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
});