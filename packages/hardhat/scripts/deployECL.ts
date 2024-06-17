import { ethers, network } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP0Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';

// Load environment variables
dotenv.config();

async function deployECL() {
  // Load environment variables
  const PRIVATE_KEY = process.env.PRIVATE_KEY!;
  const UP_ADDRESS = process.env.UP_ADDRESS!;
  const RPC =
  network.name === "mainnet"
    ? "https://rpc.mainnet.lukso.network"
    : "https://rpc.testnet.lukso.network";

  // Setup the controller used to sign the deployment
  const provider = new ethers.JsonRpcProvider(RPC);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log(
    "Deploying contracts with Universal Profile Controller: ",
    signer.address
  );

  // Load the Universal Profile
  const universalProfile = await ethers.getContractAtFromArtifact(
    LSP0Artifact,
    UP_ADDRESS as string,
  );

  // Create custom bytecode for the SportsLegends deployment
  const eclBytecode = (await ethers.getContractFactory('SportsLegends'))
    .bytecode;

  // Encode constructor parameters
  // args
  const creatorType = {
    components: [
        { name: "creator", type: "address" },
        { name: "share", type: "uint256" }
    ],
    name: "Creator",
    type: "tuple(address creator, uint256 share)"
};
  const _creators = [
    {creator: '0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095', share: 100}
  ]

  const creators = _creators.map(creator => [creator.creator, creator.share])

  const admin = '0x413Bc0E7b6D4686C1D55CCFeBC7b5EDb91c31095'

  const abiEncoder = new ethers.AbiCoder();
  const encodedConstructorParams = abiEncoder.encode(
    [`${creatorType.type}[]`, 'address'],
    [
      creators, // Sports Legends creators' addresses and shares
      admin, // admin
    ],
  );

  // Add the constructor parameters to the ecl bytecode
  const eclBytecodeWithConstructor = ethers.concat([eclBytecode, encodedConstructorParams]);

  // Get the address of the custom ecl contract that will be created
  const eclAddress = await universalProfile
  .connect(signer)
  .getFunction("execute")
  .staticCall(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    eclBytecodeWithConstructor, // Payload of the contract
    { gasLimit: 10000000 }
  );

  // Deploy SportsLegends conract by the Universal Profile
  const tx = await universalProfile
  .connect(signer)
  .getFunction("execute")(
    1, // Operation type: CREATE
    ethers.ZeroAddress, // Target: 0x0 as contract will be initialized
    0, // Value is empty
    eclBytecodeWithConstructor, // Payload of the contract
    { gasLimit: 10000000 }
  )

  // Wait for the transaction to be included in a block
  await tx.wait();

  console.log("Sports Legends deployed at: ", eclAddress)
}

deployECL()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });