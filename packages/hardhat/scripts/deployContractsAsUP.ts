import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

const ticket = {
    name: "England",
    symbol: "ENG",
    owner: ethers.ZeroAddress,
    price: ethers.parseEther("5")
}

const ECL_ADDRESS = ethers.ZeroAddress /* paste Eurocup Legends address */

async function deployToken() {
  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    process.env.UP_ADDRESS as string,
  );

  // Create custom bytecode for the Tickets deployment
  const ticketBytecode = (await ethers.getContractFactory('Tickets'))
    .bytecode;

  const abiEncoder = new ethers.AbiCoder();

  // Encode constructor parameters
  const encodedTicketConstructorParams = abiEncoder.encode(
    ['string', 'string', 'address', 'address', 'uint256'],
    [
      ticket.name, // token name
      ticket.symbol, // token symbol
      ticket.owner, // token owner
      ECL_ADDRESS, // prize pool
      ticket.price, // ticket price
    ],
  );

  // Add the constructor parameters to the ticket bytecode
  const ticketBytecodeWithConstructor = ethers.concat([
    ticketBytecode,
    encodedTicketConstructorParams,
  ]);

  // Get the address of the custom token contract that will be created
  const ticketAddress = await universalProfile.execute.staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    ticketBytecodeWithConstructor, // Payload of the contract
  );

  // Deploy the contract by the Universal Profile
  const tx = await universalProfile.execute(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    ticketBytecodeWithConstructor, // Payload of the contract
  );

  // Wait for the transaction to be included in a block
  await tx.wait();

  console.log("Tickets deployed at: ", ticketAddress)
}

deployToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });