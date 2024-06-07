// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IEurocupLegends} from "./interfaces/IEurocupLegends.sol";
import {IShirts} from "./interfaces/IShirts.sol";
import "./utils/Errors.sol";

contract EurocupLegends is IEurocupLegends, Ownable, ReentrancyGuard {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant SHARE_PRECISION = 100;
    uint256 public constant MAX_WINNERS = 3;

    Creator[] private s_creators;
    address[3] private s_winners;

    bool private s_isMintOpen = true;

    mapping(address country => uint256 prize) private s_prizes;
    mapping(address country => mapping(bytes32 tokenId => bool isClaimed)) private s_isClaimed;

    uint256 private s_totalClaimed;

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
        if(s_isMintOpen) {
            s_isMintOpen = false;
        }
        for(uint256 i; i < MAX_WINNERS; i++) {
            address winner = _winners[i];
            uint256 prize = (address(this).balance * _shares[i]) / SHARE_PRECISION;

            s_winners[i] = winner;
            s_prizes[winner] = prize;
        }

        emit WinnersSet(_winners);
    }

    function claimPrize(address _recipient, address _country) external nonReentrant {
        if(s_winners.length != MAX_WINNERS) revert NoWinnersYet();
        if(_country == address(0)) revert ZeroAddress();

        uint256 countryPrize = s_prizes[_country];
        if(countryPrize == 0) revert NoPrizeForThisCountry();

        bytes32[] memory userTokenIds = IShirts(_country).tokenIdsOf(_recipient);
        uint256 userTokenIdsLength = userTokenIds.length;

        if(userTokenIdsLength == 0) revert NoShirts();
        
        uint256 unclaimedShirts;

        // filter claimed tokens
        for(uint256 i; i < userTokenIdsLength; i++) {
            if(!s_isClaimed[_country][userTokenIds[i]]) {
                s_isClaimed[_country][userTokenIds[i]] = true;
                unclaimedShirts++;
            }
        }

        if(unclaimedShirts == 0) revert AlreadyClaimedPrize();

        uint256 totalUnclaimedShirts = IShirts(_country).totalSupply() - s_totalClaimed;

        uint256 prize = (unclaimedShirts * countryPrize) / totalUnclaimedShirts;

        s_prizes[_country] = countryPrize - prize;
        s_totalClaimed = s_totalClaimed + unclaimedShirts;

        (bool success, ) = _recipient.call{value: prize}('');
        if(!success) revert TransferFailed();

        emit PrizeClaimed(_recipient, prize);
    }

    function getPrize(address _user, address _country) external view returns (uint256) {
        uint256 countryPrize = s_prizes[_country];
        uint256 totalUnclaimedShirts = IShirts(_country).totalSupply() - s_totalClaimed;

        bytes32[] memory userTokenIds = IShirts(_country).tokenIdsOf(_user);
        uint256 userTokenIdsLength = userTokenIds.length;

        if(userTokenIdsLength == 0) revert NoShirts();
        
        uint256 unclaimedShirts;

        // filter claimed tokens
        for(uint256 i; i < userTokenIdsLength; i++) {
            if(!s_isClaimed[_country][userTokenIds[i]]) {
                unclaimedShirts++;
            }
        }

        return (unclaimedShirts * countryPrize) / totalUnclaimedShirts;
    }

    function isClaimed(address _country, bytes32 _tokenId) external view returns (bool) {
        return s_isClaimed[_country][_tokenId];
    }

    function getCreators() external view returns (Creator[] memory) {
        return s_creators;
    }

    function getWinners() external view returns (address[3] memory) {
        return s_winners;
    }

    function getCountryPrize(address _country) public view returns (uint256) {
        return s_prizes[_country];
    }

    function _handleDeposit(uint256 _amount) private isMintOpen {
        // 25% of deposits
        uint256 fees = (_amount * FEE_PERCENTAGE) / SHARE_PRECISION;

        uint256 creatorsLength = s_creators.length;

        // transfer fee to creators
        for(uint256 i; i < creatorsLength; i++) {
            Creator memory creator = s_creators[i];

            uint256 creatorShare = (fees * creator.share) / SHARE_PRECISION;

            (bool success,) = creator.creator.call{value: creatorShare}("");
            if(!success) revert FeeTransferFailed(creator.creator, creatorShare);
        }
    }

    receive() external payable {
        _handleDeposit(msg.value);
    }

    fallback() external payable {
        _handleDeposit(msg.value);
    }
}