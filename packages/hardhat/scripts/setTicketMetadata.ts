import { ethers } from 'hardhat';
import * as dotenv from 'dotenv';

import LSP7Artifact from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json';
import UniversalProfileArtifact from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json';
import { generateLSP4JSON } from '@lukso/lsp-utils';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAssetSchema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

// Load the environment variables
dotenv.config();

const name = 'England Tickets';

const description = 'England tickets for the European Cup Tournament';

const links = [
//   { title: 'Website', url: 'https://example.com' },
//   { title: 'Twitter', url: 'https://twitter.com/example' },
];

const attributes = [];

const hashVerification = {
  method: 'keccak256(bytes)',
  data: '0x6216ef2b4777755faa239eaf3c37c6e5bdf073b20d8b86a2bb5d214ff70194c2',
};

const icons = {
  icons: [
    {
      width: 200,
      height: 200,
      url: 'ipfs://QmWE3VGALUgQk1unq765vNbCf3zEYfBwtq1eAtQXLoi3vh',
      verification: hashVerification,
    }
  ],
  lsp7images: [],
  lsp8images: []
};

const images = {
  imageFields: [
    {
      images: [
        {
          width: 1200,
          height: 1200,
          url: 'ipfs://QmWE3VGALUgQk1unq765vNbCf3zEYfBwtq1eAtQXLoi3vh',
          verification: hashVerification,
        }
      ],
      lsp7images: [],
      lsp8images: [],
    },
  ],
};

const assets = {
  assets: [
    {
      url: 'ipfs://QmWE3VGALUgQk1unq765vNbCf3zEYfBwtq1eAtQXLoi3vh',
      fileType: 'image/png',
      verification: hashVerification,
    },
  ],
  lsp7assets: [],
  lsp8assets: [],
};

const json = generateLSP4JSON(
  name,
  description,
  links,
  attributes,
  icons,
  images,
  assets,
);

// Encode metadata
const encodedLSP4Metadata = ERC725.encodeData(
    {
      keyName: 'LSP4Metadata',
      value: {
        json: json,
        url: 'https://my-file-provider.com/my-file-link.json', // ipfs link to json file
      },
    },
    LSP4DigitalAssetSchema,
);

async function setTicketMetadata() {
    const [signer] = await ethers.getSigners();
    const ticketAddress = '0x...';
    
    // Instantiate asset
    const ticket = new ethers.Contract(ticketAddress, LSP7Artifact.abi, signer);
    
    // Instantiate executing Universal Profile
    const universalProfile = new ethers.Contract(
      process.env.UP_ADDRESS!,
      UniversalProfileArtifact.abi,
      signer,
    );

    // Create the transaction payload for the contract call
    const setDataPayload = ticket.interface.encodeFunctionData('setData', [
        encodedLSP4Metadata.keys[0],
        encodedLSP4Metadata.values[0],
    ]);
    
    // Update the ERC725Y storage of the LSP4 metadata
    const tx = await universalProfile.execute(
        0, // Operation type: CALL
        ticketAddress, // Target: asset address
        0, // Value is empty
        setDataPayload, // bytecode to be executed
    );
    
    // Wait for the transaction to be included in a block
    const receipt = await tx.wait();
    console.log('Ticket metadata updated: ', receipt);
}

setTicketMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });