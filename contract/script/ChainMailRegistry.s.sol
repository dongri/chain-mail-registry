// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {ChainMailRegistry} from "../src/ChainMailRegistry.sol";
// Use a relative path to import ERC1967Proxy
import {ERC1967Proxy} from "../lib/openzeppelin-contracts-upgradeable/lib/openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ChainMailRegistryScript is Script {
    ChainMailRegistry public implementation;
    ChainMailRegistry public proxy;

    function setUp() public {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        console.log("Using RPC URL:", rpcUrl);
        console.log("Using deployer address:", vm.addr(privateKey));
    }

    function run() public {
        // Get private key from .env file
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(privateKey);

        // Deploy the implementation contract (without initializing it)
        implementation = new ChainMailRegistry();
        console.log("Implementation contract deployed at:", address(implementation));
        
        // Prepare the initialization data for the proxy
        bytes memory initData = abi.encodeWithSelector(ChainMailRegistry.initialize.selector);
        
        // Deploy the proxy contract pointing to the implementation
        ERC1967Proxy proxyContract = new ERC1967Proxy(
            address(implementation),
            initData
        );
        
        // Cast the proxy to the ChainMailRegistry interface for easier interaction
        proxy = ChainMailRegistry(address(proxyContract));
        
        console.log("Proxy contract deployed at:", address(proxy));
        console.log("Owner set to:", proxy.owner());
        
        // Important: Users should interact with the proxy address, not the implementation
        console.log("IMPORTANT: Update your .env file with PROXY_ADDRESS=", address(proxy));

        vm.stopBroadcast();
    }
}
