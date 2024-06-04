// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LSP7DigitalAsset} from '@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol';
import {_LSP4_TOKEN_TYPE_NFT} from '@lukso/lsp4-contracts/contracts/LSP4Constants.sol';
import {Errors} from '../utils/Errors.sol';

contract Tickets is LSP7DigitalAsset {
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
    ) LSP7DigitalAsset(_name, _symbol, _owner, _LSP4_TOKEN_TYPE_NFT, true) {
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

        _mint(_recipient, _amount, false, '');

        (bool success,) = i_prizePool.call{value: msg.value}('');
        if(!success) revert TransferFailed();

        emit TicketsMinted(_recipient, _amount);
    }

    function getPrizePool() external returns (address) {
        return i_prizePool;
    }

    function getPrice() external returns (uint256) {
        return i_price;
    }
}