// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

error MintLimitExceeded();

error InvalidMintPrice();

error NoPrizeForThisTicket();

error AlreadyClaimedPrize();

error NoTickets();

error ZeroAddress();

error ZeroAmount();

error TransferFailed();

error FeeTransferFailed(address _creators, uint256 _amount);

error NoWinnersYet();

error MintClosed();