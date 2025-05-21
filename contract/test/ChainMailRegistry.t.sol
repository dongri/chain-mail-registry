// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Test, console} from "forge-std/Test.sol";
import {ChainMailRegistry} from "../src/ChainMailRegistry.sol";

contract ChainMailRegistryTest is Test {
    ChainMailRegistry public chainMailRegistry;

    function setUp() public {
        chainMailRegistry = new ChainMailRegistry();
        chainMailRegistry.initialize();
    }

    function test_SetEmail() public {
        string memory testEmail = "test@example.com";
        chainMailRegistry.setEmail(testEmail);
        assertEq(chainMailRegistry.getEmail(address(this)), testEmail);
    }

    function testFuzz_SetEmail(string memory email) public {
        chainMailRegistry.setEmail(email);
        assertEq(chainMailRegistry.getEmail(address(this)), email);
    }
}
