// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ILSP7DigitalAsset} from "@lukso/lsp7-contracts/contracts/ILSP7DigitalAsset.sol";
interface ITickets is ILSP7DigitalAsset {
    function mint(
        address _to,
        uint256 _amount,
        bool _force,
        bytes memory _data
    ) external;

    function burn(
        address _from,
        uint256 _amount,
        bytes memory _data
    ) external;
}