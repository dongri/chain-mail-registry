// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract ChainMailRegistry is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    mapping(address => string) private _emails;

    event EmailUpdated(address indexed user, string email);

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
    }

    function setEmail(string calldata email) external {
        _emails[msg.sender] = email;
        emit EmailUpdated(msg.sender, email);
    }

    function getEmail(address user) external view returns (string memory) {
        return _emails[user];
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

}
