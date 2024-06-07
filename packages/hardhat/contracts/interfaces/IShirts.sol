// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ILSP8IdentifiableDigitalAsset as ILSP8} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/ILSP8IdentifiableDigitalAsset.sol";
interface IShirts is ILSP8 {
    event ShirtsMinted(address _recipient, uint256 _amount);

    function mint(
        address _recipient,
        uint256 _amount
    ) external payable;
    
    function getPrizePool() external view returns (address prizePool);

    function getPrice() external view returns (uint256 price);
}