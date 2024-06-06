/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "OwnableUnset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUnset__factory>;
    getContractFactory(
      name: "ERC725Y",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC725Y__factory>;
    getContractFactory(
      name: "ERC725YCore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC725YCore__factory>;
    getContractFactory(
      name: "IERC725Y",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC725Y__factory>;
    getContractFactory(
      name: "ILSP1UniversalReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILSP1UniversalReceiver__factory>;
    getContractFactory(
      name: "LSP17Extendable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LSP17Extendable__factory>;
    getContractFactory(
      name: "LSP4DigitalAssetMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadata__factory>;
    getContractFactory(
      name: "LSP4DigitalAssetMetadataCore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadataCore__factory>;
    getContractFactory(
      name: "ILSP7DigitalAsset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILSP7DigitalAsset__factory>;
    getContractFactory(
      name: "LSP7DigitalAsset",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LSP7DigitalAsset__factory>;
    getContractFactory(
      name: "LSP7DigitalAssetCore",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LSP7DigitalAssetCore__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "EurocupLegends",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.EurocupLegends__factory>;
    getContractFactory(
      name: "IEurocupLegends",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEurocupLegends__factory>;
    getContractFactory(
      name: "ITickets",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ITickets__factory>;
    getContractFactory(
      name: "BPunX",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BPunX__factory>;
    getContractFactory(
      name: "UPMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UPMock__factory>;
    getContractFactory(
      name: "Tickets",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Tickets__factory>;

    getContractAt(
      name: "OwnableUnset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUnset>;
    getContractAt(
      name: "ERC725Y",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC725Y>;
    getContractAt(
      name: "ERC725YCore",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC725YCore>;
    getContractAt(
      name: "IERC725Y",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC725Y>;
    getContractAt(
      name: "ILSP1UniversalReceiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ILSP1UniversalReceiver>;
    getContractAt(
      name: "LSP17Extendable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LSP17Extendable>;
    getContractAt(
      name: "LSP4DigitalAssetMetadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LSP4DigitalAssetMetadata>;
    getContractAt(
      name: "LSP4DigitalAssetMetadataCore",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LSP4DigitalAssetMetadataCore>;
    getContractAt(
      name: "ILSP7DigitalAsset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ILSP7DigitalAsset>;
    getContractAt(
      name: "LSP7DigitalAsset",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LSP7DigitalAsset>;
    getContractAt(
      name: "LSP7DigitalAssetCore",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LSP7DigitalAssetCore>;
    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "EurocupLegends",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.EurocupLegends>;
    getContractAt(
      name: "IEurocupLegends",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IEurocupLegends>;
    getContractAt(
      name: "ITickets",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ITickets>;
    getContractAt(
      name: "BPunX",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BPunX>;
    getContractAt(
      name: "UPMock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UPMock>;
    getContractAt(
      name: "Tickets",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Tickets>;

    deployContract(
      name: "OwnableUnset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableUnset>;
    deployContract(
      name: "ERC725Y",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC725Y>;
    deployContract(
      name: "ERC725YCore",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC725YCore>;
    deployContract(
      name: "IERC725Y",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC725Y>;
    deployContract(
      name: "ILSP1UniversalReceiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILSP1UniversalReceiver>;
    deployContract(
      name: "LSP17Extendable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP17Extendable>;
    deployContract(
      name: "LSP4DigitalAssetMetadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadata>;
    deployContract(
      name: "LSP4DigitalAssetMetadataCore",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadataCore>;
    deployContract(
      name: "ILSP7DigitalAsset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILSP7DigitalAsset>;
    deployContract(
      name: "LSP7DigitalAsset",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP7DigitalAsset>;
    deployContract(
      name: "LSP7DigitalAssetCore",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP7DigitalAssetCore>;
    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "EurocupLegends",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EurocupLegends>;
    deployContract(
      name: "IEurocupLegends",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEurocupLegends>;
    deployContract(
      name: "ITickets",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ITickets>;
    deployContract(
      name: "BPunX",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BPunX>;
    deployContract(
      name: "UPMock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UPMock>;
    deployContract(
      name: "Tickets",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Tickets>;

    deployContract(
      name: "OwnableUnset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OwnableUnset>;
    deployContract(
      name: "ERC725Y",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC725Y>;
    deployContract(
      name: "ERC725YCore",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC725YCore>;
    deployContract(
      name: "IERC725Y",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC725Y>;
    deployContract(
      name: "ILSP1UniversalReceiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILSP1UniversalReceiver>;
    deployContract(
      name: "LSP17Extendable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP17Extendable>;
    deployContract(
      name: "LSP4DigitalAssetMetadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadata>;
    deployContract(
      name: "LSP4DigitalAssetMetadataCore",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP4DigitalAssetMetadataCore>;
    deployContract(
      name: "ILSP7DigitalAsset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILSP7DigitalAsset>;
    deployContract(
      name: "LSP7DigitalAsset",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP7DigitalAsset>;
    deployContract(
      name: "LSP7DigitalAssetCore",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LSP7DigitalAssetCore>;
    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "EurocupLegends",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.EurocupLegends>;
    deployContract(
      name: "IEurocupLegends",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEurocupLegends>;
    deployContract(
      name: "ITickets",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ITickets>;
    deployContract(
      name: "BPunX",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BPunX>;
    deployContract(
      name: "UPMock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UPMock>;
    deployContract(
      name: "Tickets",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Tickets>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}