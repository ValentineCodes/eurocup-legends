// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract EurocupLegends {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant WINNER_PERCENTAGE = 60;
    uint256 public constant RUNNERUP_PERCENTAGE = 30;
    uint256 public constant 3RD_PLACE_PERCENTAGE = 10;
    uint256 public constant FEE_PRECISION = 100;

    uint256 s_fees;

    function getPrize() public returns (uint256) {
        return address(this).balance - s_fees;
    }

    function getFees() public returns (uint256) {
        return s_fees;
    }

    function _handleDeposit(uint256 _amount) private {
        // set fee
        s_fees = (_amount * FEE_PERCENTAGE) / FEE_PRECISION;
    }

    receive() external payable {
        _handleDeposit(msg.value);
    }

    fallback() external payable {
        _handleDeposit(msg.value);
    }
}