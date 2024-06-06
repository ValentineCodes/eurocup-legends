// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEurocupLegends} from "./interfaces/IEurocupLegends.sol";
import {Errors} from "./utils/Errors.sol";

contract EurocupLegends is IEurocupLegends, Ownable, Errors {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant SHARE_PRECISION = 100;

    Creator[] private s_creators;
    address[3] private s_winners;

    mapping(address winner => uint256 prize) private s_prizes;
    mapping(address user => mapping(address ticket => bool isClaimed)) private s_isClaimed;

    constructor(Creator[] memory _creators, address _owner) Ownable(_owner) {
        for(uint256 i; i < _creators.length; i++) {
            s_creators.push(_creators[i]);
        }
    }

    function setWinners(address[3] calldata _winners, uint256[] calldata _share) external onlyOwner {
        uint256 memory winnersLength = s_winners.length;
        uint256 totalPrize = address(this).balance;

        if(winnersLength != 3) revert NoWinnersYet();

        for(uint256 i; i < winnersLength; i++) {
            address winner = _winners[i];
            uint256 prize = (totalPrize * _share[i]) / SHARE_PRECISION;

            s_winners.push(winner);
            s_prizes[winner] = prize;
        }

        emit WinnersSet(_winners);
    }

    function getPrize(address winner) public returns (uint256) {
        return s_prizes[winner];
    }

    function _handleDeposit(uint256 _amount) private {
        // 25% of deposits
        uint256 fees = (_amount * FEE_PERCENTAGE) / SHARE_PRECISION;

        uint256 creatorsLength = s_creators.length;

        // transfer fee to creators
        for(uint256 i; i < creatorsLength; i++) {
            Creator memory creator = s_creators[i];

            uint256 feeCut = (fees * creator.share) / SHARE_PRECISION;

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