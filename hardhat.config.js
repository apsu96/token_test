require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('hardhat-deploy');
// require("hardhat-deploy-ethers");
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INFURA_KEY = process.env.INFURA_KEY;
const Private_Key = process.env.PRIVATE_KEY.toString();
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY.toString();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.14",
  defaultNetwork: "rinkeby",
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [`${Private_Key}`],
      // chainId: 4,
      // live: true,
      // saveDeployments: true,
      // tags: ["staging"],
      // gasPrice: 8000000000,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
