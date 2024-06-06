// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IEurocupLegends} from "./interfaces/IEurocupLegends.sol";
import {ITickets} from "./interfaces/ITickets.sol";
import "./utils/Errors.sol";

contract EurocupLegends is IEurocupLegends, Ownable {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant SHARE_PRECISION = 100;
    uint256 public constant MAX_WINNERS = 3;

    Creator[] private s_creators;
    address[3] private s_winners;

    bool private s_isMintOpen = true;

    mapping(address ticket => uint256 prize) private s_prizes;
    mapping(address user => mapping(address ticket => bool isClaimed)) private s_isClaimed;

    constructor(Creator[] memory _creators, address _owner) Ownable(_owner) {
        for(uint256 i; i < _creators.length; i++) {
            s_creators.push(_creators[i]);
        }
    }

    modifier isMintOpen() {
        if(!s_isMintOpen) revert MintClosed();
        _;
    }

    function setMintStatus(bool _isMintOpen) external onlyOwner {
        s_isMintOpen = _isMintOpen;
        emit MintStatus(_isMintOpen);
    }

    function setWinners(address[MAX_WINNERS] calldata _winners, uint256[MAX_WINNERS] calldata _shares) external onlyOwner {
        for(uint256 i; i < MAX_WINNERS; i++) {
            address winner = _winners[i];
            uint256 prize = (address(this).balance * _shares[i]) / SHARE_PRECISION;

            s_winners[i] = winner;
            s_prizes[winner] = prize;
        }

        emit WinnersSet(_winners);
    }

    function claimPrize(address _ticket) external {
        if(s_winners.length != MAX_WINNERS) revert NoWinnersYet();
        if(_ticket == address(0)) revert ZeroAddress();
        if(s_prizes[_ticket] == 0) revert NoPrizeForThisTicket();
        if(s_isClaimed[msg.sender][_ticket]) revert AlreadyClaimedPrize();

        uint256 prize = getPrize(msg.sender, _ticket);

        s_prizes[_ticket] = s_prizes[_ticket] - prize;
        s_isClaimed[msg.sender][_ticket] = true;

        (bool success, ) = msg.sender.call{value: prize}('');
        if(!success) revert TransferFailed();

        emit PrizeClaimed(msg.sender, prize);
    }

    function isClaimed(address _user, address _ticket) external view returns (bool) {
        return s_isClaimed[_user][_ticket];
    }

    function getCreators() external view returns (Creator[] memory) {
        return s_creators;
    }

    function getWinners() external view returns (address[3] memory) {
        return s_winners;
    }

    function getPrize(address _user, address _ticket) public view returns (uint256) {
        uint256 ticketPrize = s_prizes[_ticket];
        uint256 userTickets = ITickets(_ticket).balanceOf(_user);
        uint256 totalTickets = ITickets(_ticket).totalSupply();

        if(userTickets == 0) revert NoTickets();

        return (userTickets * ticketPrize) / totalTickets;
    }

    function getTicketPrize(address _ticket) public view returns (uint256) {
        return s_prizes[_ticket];
    }

    function _handleDeposit(uint256 _amount) private isMintOpen {
        // 25% of deposits
        uint256 fees = (_amount * FEE_PERCENTAGE) / SHARE_PRECISION;

        uint256 creatorsLength = s_creators.length;

        // transfer fee to creators
        for(uint256 i; i < creatorsLength; i++) {
            Creator memory creator = s_creators[i];

            uint256 feeCut = (fees * creator.share) / SHARE_PRECISION;

            (bool success,) = creator.creator.call{value: feeCut}("");
            if(!success) revert FeeTransferFailed(creator.creator, feeCut);
        }
    }

    receive() external payable {
        _handleDeposit(msg.value);
    }

    fallback() external payable {
        _handleDeposit(msg.value);
    }
}