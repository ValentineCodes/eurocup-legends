import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

async function deployToken() {
  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDRESS as string,
  );

  // Create custom bytecode for the EurocupLegends deployment
  const eclBytecode = (await ethers.getContractFactory('EurocupLegends'))
    .bytecode;

  // Get the address of the custom token contract that will be created
  const eclAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    eclBytecode, // Payload of the contract
  );

  // Deploy EurocupLegends conract by the Universal Profile
  const tx = await universalProfile.execute(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    eclBytecode, // Payload of the contract
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