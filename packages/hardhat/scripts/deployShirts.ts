import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

const shirt = {
    name: "England",
    symbol: "ENG",
    owner: '0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095',
    price: ethers.parseEther("5")
}

const ECL_ADDRESS = ethers.ZeroAddress /* paste Eurocup Legends address */

async function deployShirts() {
  // UP controller used for deployment
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with Universal Profile controller: ', deployer.address);

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDRESS as string,
  );

  // Create custom bytecode for the Shirts deployment
  const shirtBytecode = (await ethers.getContractFactory('Shirts'))
    .bytecode;

  const abiEncoder = new ethers.AbiCoder();

  // Encode constructor parameters
  const encodedShirtConstructorParams = abiEncoder.encode(
    ['string', 'string', 'address', 'address', 'uint256'],
    [
      shirt.name, // token name
      shirt.symbol, // token symbol
      shirt.owner, // token owner
      ECL_ADDRESS, // prize pool
      shirt.price, // shirt price
    ],
  );

  // Add the constructor parameters to the shirt bytecode
  const shirtBytecodeWithConstructor = ethers.concat([
    shirtBytecode,
    encodedShirtConstructorParams,
  ]);

  // Get the address of the custom token contract that will be created
  const shirtAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    shirtBytecodeWithConstructor, // Payload of the contract
  );

  // Deploy the contract by the Universal Profile
  const tx = await universalProfile.execute(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    shirtBytecodeWithConstructor, // Payload of the contract
  );

  // Wait for the transaction to be included in a block
  await tx.wait();

  console.log("Shirts deployed at: ", shirtAddress)
}

deployShirts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });