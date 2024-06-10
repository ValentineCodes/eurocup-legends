import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "Shirts" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployShirts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // args
  const name = "England Shirts"
  const symbol = "ENG"
  const owner = "0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095"
  const prizePool = '0x0cdb6F0B99b3617323a09BB1b8ea38619D55B2a9'
  const price = ethers.parseEther("15")
  await deploy("Shirts", {
    from: deployer,
    // Contract constructor arguments
    args: [name, symbol, owner, prizePool, price],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
};

export default deployShirts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags Shirts
deployShirts.tags = ["Shirts"];
