// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IEurocupLegends} from "./interfaces/IEurocupLegends.sol";
import {Errors} from "./utils/Errors.sol";

contract EurocupLegends is IEurocupLegends, Errors {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant WINNER_PERCENTAGE = 60;
    uint256 public constant RUNNERUP_PERCENTAGE = 30;
    uint256 public constant 3RD_PLACE_PERCENTAGE = 10;
    uint256 public constant FEE_PRECISION = 100;

    Creator[] private s_creators;
    address[3] private s_winners;

    mapping(address user => mapping(address ticker => bool isClaimed)) private s_isClaimed;

    constructor(Creator[] memory _creators) {
        for(uint256 i; i < _creators.length; i++) {
            s_creators.push(_creators[i]);
        }
    }

    function getPrize() public returns (uint256) {
        return address(this).balance;
    }

    function _handleDeposit(uint256 _amount) private {
        // 25% of deposits
        uint256 fees = (_amount * FEE_PERCENTAGE) / FEE_PRECISION;

        uint256 creatorsLength = s_creators.length;

        // transfer fee to creators
        for(uint256 i; i < creatorsLength; i++) {
            Creator memory creator = s_creators[i];

            uint256 feeCut = (fees * creator.share) / FEE_PRECISION;

            (bool success,) = creator.address.call{value: feeCut}("");
            if(!success) revert FeeTransferFailed(creator.address, feeCut);
        }
    }

    receive() external payable {
        _handleDeposit(msg.value);
    }

    fallback() external payable {
        _handleDeposit(msg.value);
    }
}