import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

async function deployToken() {
  // UP controller used for deployment
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with Universal Profile controller: ', deployer.address);

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDRESS as string,
  );

  // Create custom bytecode for the EurocupLegends deployment
  const eclBytecode = (await ethers.getContractFactory('EurocupLegends'))
    .bytecode;

  // Encode constructor parameters
  // args
  interface Creator {
    owner: string;
    share: number;
  }
  const creators: Creator[] = [
    {owner: '0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095', share: 100}
  ]
  const admin = '0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095'

  const abiEncoder = new ethers.AbiCoder();
  const encodedConstructorParams = abiEncoder.encode(
    ['Creator[]', 'address'],
    [
      creators, // Eurocup Legends creators' addresses and shares
      admin, // admin
    ],
  );

  // Add the constructor parameters to the token bytecode
  const tokenBytecodeWithConstructor = ethers.concat([eclBytecode, encodedConstructorParams]);

  // Get the address of the custom token contract that will be created
  const eclAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    tokenBytecodeWithConstructor, // Payload of the contract
  );

  // Deploy EurocupLegends conract by the Universal Profile
  const tx = await universalProfile.execute(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    tokenBytecodeWithConstructor, // Payload of the contract
  )

  // Wait for the transaction to be included in a block
  await tx.wait();

  console.log("Eurocup Legends deployed at: ", eclAddress)
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });