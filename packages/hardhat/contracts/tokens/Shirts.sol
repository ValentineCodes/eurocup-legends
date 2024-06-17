// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LSP8IdentifiableDigitalAsset as LSP8} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP4_TOKEN_TYPE_NFT} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_LSP8_TOKENID_FORMAT_NUMBER} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {IShirts} from "../interfaces/IShirts.sol";
import "../utils/Errors.sol";

/**
    @author Sports Legends
    @title Shirts NFT
    @notice An NFT contract for the countries in the European Cup Tournament
            Users can mint a shirt for the right price
 */
contract Shirts is IShirts, LSP8 {
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public constant MAX_MINT = 5;
    address private immutable i_prizePool;
    uint256 private immutable i_price;

    constructor(
        string memory _name,
        string memory _symbol,
        address _owner,
        address _prizePool,
        uint256 _price
    )
        LSP8(
            _name,
            _symbol,
            _owner,
            _LSP4_TOKEN_TYPE_NFT,
            _LSP8_TOKENID_FORMAT_NUMBER
        )
    {
        i_prizePool = _prizePool;
        i_price = _price;
    }

    /**
        @notice Mints {_amount} shirts to {_recipient} for the right price
                Users can mint 5 max and 100 in total
                Anyone can mint a shirt for another
        @dev Price is transferred to the prize pool
            25% is split between creators
        @param _recipient Address of the recipient
        @param _amount Amount of shirts to mint
     */
    function mint(address _recipient, uint256 _amount) external payable {
        // Cannot mint more than {MAX_SUPPLY}
        if (_existingTokens + _amount > MAX_SUPPLY) revert MintLimitExceeded();

        // Cannot own more than {MAX_MINT}
        if (balanceOf(_recipient) + _amount > MAX_MINT)
            revert MintLimitExceeded();

        // Ensure caller sends the right amount
        if (msg.value != i_price * _amount) revert InvalidMintPrice();

        // Mint tokens to {_recipient}
        for (uint256 i; i < _amount; i++) {
            bytes32 tokenId = bytes32(_existingTokens + 1);
            _mint(_recipient, tokenId, false, "");
        }

        // Transfer cost to prize pool
        (bool success, ) = i_prizePool.call{value: msg.value}("");
        if (!success) revert TransferFailed();

        emit ShirtsMinted(_recipient, _amount);
    }

    /// @notice Returns the address of the prize pool
    function getPrizePool() external view returns (address _prizePool) {
        return i_prizePool;
    }

    /// @notice Returns the price of each shirt
    function getPrice() external view returns (uint256 _price) {
        return i_price;
    }
}
