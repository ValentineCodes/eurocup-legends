// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.4;

// interfaces
import {
    ILSP1UniversalReceiver
} from "@lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/ILSP1UniversalReceiver.sol";

// modules
import {
    ERC165
} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

// constants
import {_INTERFACEID_LSP1} from "@lukso/lsp-smart-contracts/contracts/LSP1UniversalReceiver/LSP1Constants.sol";
import {_INTERFACEID_LSP0} from "@lukso/lsp-smart-contracts/contracts/LSP0ERC725Account/LSP0Constants.sol";

import {IShirts} from "../interfaces/IShirts.sol";

interface BPunX {
    function mint(uint256 _amount) external payable;
}
contract UPMock is ERC165, ILSP1UniversalReceiver {
    
    /// override the supportsInterface function from ERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == _INTERFACEID_LSP1 ||
            interfaceId == _INTERFACEID_LSP0 ||
            super.supportsInterface(interfaceId);
    }
    function universalReceiver(
        bytes32 typeId,
        bytes memory data
    ) external payable override returns (bytes memory returnValue) {
        emit UniversalReceiver(msg.sender, msg.value, typeId, data, "");

        return "thanks for calling";
    }
    /**
     * @notice Verifies that the signer is the owner of the signing contract.
     */
    function isValidSignature(
        bytes32 /* messageHash */,
        bytes calldata /* signature */
    ) external pure returns (bytes4) {
        // always return true (just for testing)
        return 0x1626ba7e;
    }
    function transfer(
        address shirts,
        address from,
        address to,
        bytes32 tokenId,
        bool force,
        bytes memory data
    ) external {
        IShirts(shirts).transfer(from, to, tokenId, force, data);
    }
    function fund() external payable {}
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    receive() external payable {}
    fallback() external payable {}
}