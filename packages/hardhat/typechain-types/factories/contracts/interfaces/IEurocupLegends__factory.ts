/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IEurocupLegends,
  IEurocupLegendsInterface,
} from "../../../contracts/interfaces/IEurocupLegends";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "isMintOpen",
        type: "bool",
      },
    ],
    name: "MintStatus",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "prize",
        type: "uint256",
      },
    ],
    name: "PrizeClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[3]",
        name: "winners",
        type: "address[3]",
      },
    ],
    name: "WinnersSet",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_recipient",
        type: "address",
      },
      {
        internalType: "address",
        name: "_country",
        type: "address",
      },
    ],
    name: "claimPrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_country",
        type: "address",
      },
    ],
    name: "getCountryPrize",
    outputs: [
      {
        internalType: "uint256",
        name: "_prize",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCreators",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "share",
            type: "uint256",
          },
        ],
        internalType: "struct IEurocupLegends.Creator[]",
        name: "_creators",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "address",
        name: "_country",
        type: "address",
      },
    ],
    name: "getPrize",
    outputs: [
      {
        internalType: "uint256",
        name: "_prize",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWinners",
    outputs: [
      {
        internalType: "address[3]",
        name: "_winners",
        type: "address[3]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_country",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_tokenId",
        type: "bytes32",
      },
    ],
    name: "isClaimed",
    outputs: [
      {
        internalType: "bool",
        name: "_isClaimed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isMintOpen",
    outputs: [
      {
        internalType: "bool",
        name: "_isMintOpen",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_isMintOpen",
        type: "bool",
      },
    ],
    name: "setMintStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[3]",
        name: "_winners",
        type: "address[3]",
      },
      {
        internalType: "uint256[3]",
        name: "_shares",
        type: "uint256[3]",
      },
    ],
    name: "setWinners",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IEurocupLegends__factory {
  static readonly abi = _abi;
  static createInterface(): IEurocupLegendsInterface {
    return new Interface(_abi) as IEurocupLegendsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IEurocupLegends {
    return new Contract(address, _abi, runner) as unknown as IEurocupLegends;
  }
}
