// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IECL {
    struct Creator {
        address creator;
        uint256 share;
    }

    event WinnersSet(address[3] winners);
    event PrizeClaimed(address owner, uint256 prize);
    event MintStatus(bool isMintOpen);
}