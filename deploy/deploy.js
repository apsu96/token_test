module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    console.log("deploying token");

    await deploy("SimpleToken", {
      from: deployer,
      args: ["0x5e6cBeb8C26B52B9DdDBCd3A011f3a268fb2e345"],
      log: true,
    });
  };

module.exports.tags = ["SimpleToken"];