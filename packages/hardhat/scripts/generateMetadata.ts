import * as dotenv from 'dotenv';

import lsp8Schema from "@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json";
import lsp4Schema from "@erc725/erc725.js/schemas/LSP4DigitalAsset.json";
import { ERC725 } from '@erc725/erc725.js';

import json from "../shirts.json";

const myErc725 = new ERC725([...lsp8Schema, ...lsp4Schema]);

// Load the environment variables
dotenv.config();

async function generateMetadata() {
  // Encode metadata
  const encodedMetadata = myErc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: json,
        url: 'ipfs://QmXQKmiDqdNZ4gqK5yJioF4WzjFX8PaQz9DWKyMvoDQsR4', // ipfs link to json file
      },
    }
  ]);

  console.log(encodedMetadata.values[0])
}

generateMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });