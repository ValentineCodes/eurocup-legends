// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LSP8IdentifiableDigitalAsset as LSP8} from '@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol';
import {_LSP4_TOKEN_TYPE_NFT} from '@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol';
import {_LSP8_TOKENID_FORMAT_NUMBER, _LSP8_TOKEN_METADATA_BASE_URI} from '@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol';
import {IShirts} from '../interfaces/IShirts.sol';
import '../utils/Errors.sol';

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
    ) LSP8(
        _name,
        _symbol,
        _owner,
        _LSP4_TOKEN_TYPE_NFT,
        _LSP8_TOKENID_FORMAT_NUMBER
    ) {
        i_prizePool = _prizePool;
        i_price = _price;
    }

    function mint(
        address _recipient,
        uint256 _amount
    ) external payable {
        if(_existingTokens + _amount > MAX_SUPPLY) revert MintLimitExceeded();
        if(balanceOf(_recipient) + _amount > MAX_MINT) revert MintLimitExceeded();
        if(msg.value != i_price * _amount) revert InvalidMintPrice();

        for(uint256 i; i < _amount; i++) {
            uint256 tokenId = _existingTokens + 1;
            _mint(_recipient, bytes32(tokenId), false, '');
        }

        (bool success,) = i_prizePool.call{value: msg.value}('');
        if(!success) revert TransferFailed();

        emit ShirtsMinted(_recipient, _amount);
    }

    function getPrizePool() external view returns (address prizePool) {
        return i_prizePool;
    }

    function getPrice() external view returns (uint256 price) {
        return i_price;
    }
}