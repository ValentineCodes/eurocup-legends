// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ILSP7DigitalAsset} from "@lukso/lsp7-contracts/contracts/ILSP7DigitalAsset.sol";
interface ITickets is ILSP7DigitalAsset {
    event TicketsMinted(_recipient, uint8 _amount);

    function mint(
        address _recipient
    ) external payable;
}