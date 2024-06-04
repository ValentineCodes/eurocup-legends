// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {LSP7DigitalAsset} from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";
import {_LSP4_TOKEN_TYPE_NFT} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

contract Tickets is LSP7DigitalAsset {
    constructor(
        string memory _name,
        string memory _symbol,
        address _owner
    ) LSP7DigitalAsset(_name, _symbol, _owner, _LSP4_TOKEN_TYPE_NFT, true) {}

    function mint(
        address _to,
        uint256 _amount,
        bool _force,
        bytes memory _data
    ) external override onlyOwner {
        _mint(_to, _amount, _force, _data);
    }

    function burn(
        address _from,
        uint256 _amount,
        bytes memory _data
    ) external override onlyOwner {
        _burn(_from, _amount, _data);
    }
}