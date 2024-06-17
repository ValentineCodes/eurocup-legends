// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface ISportsLegends {
    struct Creator {
        address creator;
        uint256 share;
    }

    event WinnersSet(address[3] winners);
    event PrizeClaimed(address owner, uint256 prize);
    event MintStatus(bool isMintOpen);

    /**
        @notice Open or close mint
        @dev Can only be called by the Admin
        @param _isMintOpen Updated mint status
     */
    function setMintStatus(bool _isMintOpen) external;

    /**
        @notice Set the winners of the tournament and the prize share for each in order - 1st place, Runner up, and 3rd place
        @dev Can only be called by Admin
        @param _winners Address of winners
        @param _shares Percentage share of each winner in order
     */
    function setWinners(
        address[3] calldata _winners,
        uint256[3] calldata _shares
    ) external;

    /**
        @notice Sends prize to {_recipient} based on amount of shirts owned in the winning country
                Anyone can claim prize for another
        @param _recipient Owner of the shirts to claim
        @param _country Address of the winning country
     */
    function claimPrize(address _recipient, address _country) external;

    /**
        @notice Returns the prize of {_user} for the winning {_country}
        @param _user Owner of the Shirts
        @param _country Address of winning country
        @return _prize Prize of user for {_country}
     */
    function getPrize(
        address _user,
        address _country
    ) external view returns (uint256 _prize);

    /**
        @notice Gets the mint status
        @return _isMintOpen Returns `true` if mint is open and `false` otherwise
     */
    function isMintOpen() external view returns (bool _isMintOpen);

    /**
        @notice Determines if shirt has been used to claim prize
        @param _country Address of winning country
        @param _tokenId ID of shirt for the winning country
        @return _isClaimed Return `true` if prize has been claimed and `false` otherwise
     */
    function isClaimed(
        address _country,
        bytes32 _tokenId
    ) external view returns (bool _isClaimed);

    /**
        @notice Gets the addresses and shares of the creators of Sports Legends
        @return _creators Returns the creators of Sports Legends
     */
    function getCreators() external view returns (Creator[] memory _creators);

    /**
        @notice Gets the winners of the tournament in order - 1st place, Runner up and 3rd place
        @return _winners Returns the addresses of the winners of the tournament
     */
    function getWinners() external view returns (address[3] memory _winners);

    /**
        @notice Gets the prize of {_country}
        @param _country Address of winning country
        @return _prize Returns the prize of the country
     */
    function getCountryPrize(
        address _country
    ) external view returns (uint256 _prize);
}
