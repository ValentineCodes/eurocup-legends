// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ILSP8IdentifiableDigitalAsset as ILSP8} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/ILSP8IdentifiableDigitalAsset.sol";
interface IShirts is ILSP8 {
    event ShirtsMinted(address _recipient, uint256 _amount);

    /**
        @notice Mints {_amount} shirts to {_recipient} for the right price
                Users can mint 5 max and 100 in total
                Anyone can mint a shirt for another
        @dev Price is transferred to the prize pool
            25% is split between creators
        @param _recipient Address of the recipient
        @param _amount Amount of shirts to mint
     */
    function mint(
        address _recipient,
        uint256 _amount
    ) external payable;
    
    /// @notice Returns the address of the prize pool
    function getPrizePool() external view returns (address _prizePool);

    /// @notice Returns the price of each shirt
    function getPrice() external view returns (uint256 _price);
}