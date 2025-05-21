// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.22;

import {Script, console} from "forge-std/Script.sol";
import {ChainMailRegistry} from "../src/ChainMailRegistry.sol";

contract ChainMailRegistryUpgradeScript is Script {
    // Address of the proxy contract to upgrade
    address public proxyAddress;
    
    function setUp() public {
        // Load environment variables
        string memory rpcUrl = vm.envString("RPC_URL");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        proxyAddress = vm.envAddress("PROXY_ADDRESS");
        
        console.log("Using RPC URL:", rpcUrl);
        console.log("Using deployer address:", vm.addr(privateKey));
        console.log("Upgrading proxy at:", proxyAddress);
    }

    function run() public {
        // Get private key from .env file
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(privateKey);

        // Deploy new implementation (without initializing it)
        // The implementation contract should not be initialized directly
        // as it will be used as a logic contract by the proxy
        ChainMailRegistry newImplementation = new ChainMailRegistry();
        console.log("New implementation deployed at:", address(newImplementation));
        
        // Get the proxy contract
        ChainMailRegistry proxy = ChainMailRegistry(payable(proxyAddress));
        
        // Verify the caller is the owner
        address owner = proxy.owner();
        address caller = vm.addr(privateKey);
        console.log("Contract owner:", owner);
        console.log("Caller address:", caller);
        
        if (owner != caller) {
            console.log("WARNING: Caller is not the owner of the contract!");
            console.log("Only the owner can upgrade the contract.");
            vm.stopBroadcast();
            return;
        }
        
        // For UUPS proxies, the upgrade must be initiated through the proxy
        // but the upgrade logic is in the implementation
        try proxy.upgradeToAndCall(address(newImplementation), "") {
            console.log("Upgrade successful");
        } catch Error(string memory reason) {
            console.log("Error:");
            console.log(reason);
            vm.stopBroadcast();
            return;
        } catch {
            console.log("Error: Unknown error occurred during upgrade");
            vm.stopBroadcast();
            return;
        }
        
        console.log("Successfully upgraded proxy at %s to implementation at %s", proxyAddress, address(newImplementation));

        vm.stopBroadcast();
    }
}
