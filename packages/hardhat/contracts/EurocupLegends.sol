// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IEurocupLegends} from "./interfaces/IEurocupLegends.sol";
import {IShirts} from "./interfaces/IShirts.sol";
import "./utils/Errors.sol";

/**
    @author Eurocup Legends
    @title EurocupLegends
    @notice This contract serves as the prize pool for the European Cup Tournament stake
            Admin can close minting at any time
            Admin can set the winners of the tournament
            Users can claim their prize after winners have been set
 */
contract EurocupLegends is IEurocupLegends, Ownable, ReentrancyGuard {
    uint256 public constant FEE_PERCENTAGE = 25;
    uint256 public constant SHARE_PRECISION = 100;
    uint256 public constant MAX_WINNERS = 3;

    // list of creators and each of their share percentage
    Creator[] private s_creators;

    // list of the winners - 1st place, Runner up and 3rd place
    address[3] private s_winners;

    bool private s_isMintOpen = true;

    // prize for each winner 
    mapping(address country => uint256 prize) private s_prizes;

    // determine if shirt has been used to claim prize
    mapping(address country => mapping(bytes32 tokenId => bool isClaimed)) private s_isClaimed;

    // total shirts that have been used to claim prize for each country
    mapping(address country => uint256 totalClaimed) private s_totalClaimed;

    constructor(Creator[] memory _creators, address _admin) Ownable(_admin) {
        for(uint256 i; i < _creators.length; i++) {
            s_creators.push(_creators[i]);
        }
    }

    modifier ifMintOpen() {
        if(!s_isMintOpen) revert MintClosed();
        _;
    }

    /**
        @notice Open or close mint
        @dev Can only be called by the Admin
        @param _isMintOpen Updated mint status
     */
    function setMintStatus(bool _isMintOpen) external onlyOwner {
        s_isMintOpen = _isMintOpen;
        emit MintStatus(_isMintOpen);
    }

    /**
        @notice Set the winners of the tournament and the prize share for each in order - 1st place, Runner up, and 3rd place
        @dev Can only be called by Admin
        @param _winners Address of winners
        @param _shares Percentage share of each winner in order
     */
    function setWinners(address[MAX_WINNERS] calldata _winners, uint256[MAX_WINNERS] calldata _shares) external onlyOwner {
        if(s_isMintOpen) {
            // Close mint before setting winners
            s_isMintOpen = false;
        }

        // Set the winners and the prize for each winner
        for(uint256 i; i < MAX_WINNERS; i++) {
            address winner = _winners[i];
            uint256 prize = (address(this).balance * _shares[i]) / SHARE_PRECISION;

            s_winners[i] = winner;
            s_prizes[winner] = prize;
        }

        emit WinnersSet(_winners);
    }

    /**
        @notice Sends prize to {_recipient} based on amount of shirts owned in the winning {_country}
                Anyone can claim prize for another
        @param _recipient Owner of the shirts to claim
        @param _country Address of the winning country
     */
    function claimPrize(address _recipient, address _country) external nonReentrant {
        if(s_winners.length != MAX_WINNERS) revert NoWinnersYet();

        // sanity check
        if(_country == address(0)) revert ZeroAddress();

        uint256 countryPrize = s_prizes[_country];
        if(countryPrize == 0) revert NoPrizeForThisCountry();

        bytes32[] memory userTokenIds = IShirts(_country).tokenIdsOf(_recipient);
        uint256 userTokenIdsLength = userTokenIds.length;

        if(userTokenIdsLength == 0) revert NoShirts();
        
        uint256 unclaimedShirts;

        // filter claimed shirts. Ensure prize is calculated with unclaimed shirts only
        for(uint256 i; i < userTokenIdsLength; i++) {
            if(!s_isClaimed[_country][userTokenIds[i]]) {
                s_isClaimed[_country][userTokenIds[i]] = true;
                unclaimedShirts++;
            }
        }

        // Ensure user has unclaimed shirts
        if(unclaimedShirts == 0) revert AlreadyClaimedPrize();

        uint256 totalClaimed = s_totalClaimed[_country];

        // Total shirts that haven't been used to claim prize for the winning {_country}
        uint256 totalUnclaimedShirts = IShirts(_country).totalSupply() - totalClaimed;

        uint256 prize = (unclaimedShirts * countryPrize) / totalUnclaimedShirts;

        s_prizes[_country] = countryPrize - prize;
        s_totalClaimed[_country] = totalClaimed + unclaimedShirts;

        // transfer prize to {_recipient}
        (bool success, ) = _recipient.call{value: prize}('');
        if(!success) revert TransferFailed();

        emit PrizeClaimed(_recipient, prize);
    }

    /**
        @notice Gets the prize of {_user} for the winning {_country}
        @param _user Owner of the Shirts
        @param _country Address of winning country
        @return _prize Prize of user for {_country}
     */
    function getPrize(address _user, address _country) external view returns (uint256 _prize) {
        uint256 countryPrize = s_prizes[_country];

        // Total shirts that haven't been used to claim prize for the winning {_country}
        uint256 totalUnclaimedShirts = IShirts(_country).totalSupply() - s_totalClaimed[_country];

        bytes32[] memory userTokenIds = IShirts(_country).tokenIdsOf(_user);
        uint256 userTokenIdsLength = userTokenIds.length;

        // Ensure the user has shirts
        if(userTokenIdsLength == 0) revert NoShirts();
        
        uint256 unclaimedShirts;

        // filter claimed shirts. Ensure prize is calculated with unclaimed shirts only
        for(uint256 i; i < userTokenIdsLength; i++) {
            if(!s_isClaimed[_country][userTokenIds[i]]) {
                unclaimedShirts++;
            }
        }

        return (unclaimedShirts * countryPrize) / totalUnclaimedShirts;
    }

    /**
        @notice Gets the mint status
        @return _isMintOpen Returns `true` if mint is open and `false` otherwise
     */
    function isMintOpen() external view returns (bool _isMintOpen) {
        return s_isMintOpen;
    }

    /**
        @notice Determines if shirt has been used to claim prize
        @param _country Address of winning country
        @param _tokenId ID of shirt for the winning country
        @return _isClaimed Return `true` if prize has been claimed and `false` otherwise
     */
    function isClaimed(address _country, bytes32 _tokenId) external view returns (bool _isClaimed) {
        return s_isClaimed[_country][_tokenId];
    }

    /**
        @notice Gets the addresses and shares of the creators of Eurocup Legends
        @return _creators Returns the creators of Eurocup Legends
     */
    function getCreators() external view returns (Creator[] memory _creators) {
        return s_creators;
    }

    /**
        @notice Gets the winners of the tournament in order - 1st place, Runner up and 3rd place
        @return _winners Returns the addresses of the winners of the tournament
     */
    function getWinners() external view returns (address[3] memory _winners) {
        return s_winners;
    }

    /**
        @notice Gets the prize of {_country}
        @param _country Address of winning country
        @return _prize Returns the prize of the country
     */
    function getCountryPrize(address _country) external view returns (uint256 _prize) {
        return s_prizes[_country];
    }

    /**
        @notice Splits 25% of deposits between creators while the rest goes into the prize pool
                It's disabled if mint is closed by Admin
        @param _amount Amount deposited
     */
    function _handleDeposit(uint256 _amount) private ifMintOpen {
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