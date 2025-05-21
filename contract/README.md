# ChainMailRegistry Contract

A smart contract for storing and retrieving email addresses on the blockchain.

## Features

- Store email addresses associated with Ethereum addresses
- Retrieve email addresses by Ethereum address
- Upgradeable contract using UUPS proxy pattern
- Owner-controlled upgrades

## Deployment Instructions

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed
- Ethereum wallet with funds for deployment

### Deployment Steps

1. **Set Up Environment Variables**

   Create a `.env` file in the contract directory by copying the example:

   ```bash
   # Copy the example .env file
   cp .env.example .env
   
   # Edit the .env file with your values
   nano .env  # or use any text editor
   ```

   Fill in your values in the `.env` file:
   ```
   PRIVATE_KEY=your_wallet_private_key_here
   RPC_URL=your_rpc_url_here
   PROXY_ADDRESS=your_proxy_address_here_for_upgrades
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

2. **Deploy the ChainMailRegistry Contract**

   The ChainMailRegistry contract is upgradeable and needs to be deployed using the deployment script.

   ```bash
   # Make the script executable (if needed)
   chmod +x deploy.sh

   # Run the deployment script
   ./deploy.sh
   ```

   Alternatively, you can run the Foundry command directly:

   ```bash
   # Source the .env file and run the deployment script
   source .env && forge script script/ChainMailRegistry.s.sol:ChainMailRegistryScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

   This script will:
   - Deploy the implementation contract
   - Initialize the contract with the deployer as the owner
   
   After deployment, note the proxy contract address from the logs. This is the address you'll interact with.

3. **Upgrading the Contract**

   If you need to upgrade the contract in the future (e.g., to add new features or fix bugs):

   ```bash
   # Update the PROXY_ADDRESS in your .env file with your deployed proxy address
   
   # Make the script executable (if needed)
   chmod +x upgrade.sh

   # Run the upgrade script
   ./upgrade.sh
   ```

   Alternatively, you can run the Foundry command directly:

   ```bash
   # Source the .env file and run the upgrade script
   source .env && forge script script/ChainMailRegistryUpgrade.s.sol:ChainMailRegistryUpgradeScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
   ```

   This script will:
   - Deploy a new implementation contract
   - Upgrade the proxy to point to the new implementation
   - Preserve all existing data stored in the contract

4. **Verifying the Contract on Etherscan**

   To verify the contract source code on Etherscan (or compatible block explorers):

   ```bash
   # Make sure ETHERSCAN_API_KEY is set in your .env file
   
   # Make the script executable (if needed)
   chmod +x script-publish.sh

   # Run the verification script
   ./script-publish.sh
   ```

   This script will:
   - Automatically detect the implementation address from the proxy
   - Verify both the implementation and proxy contracts on Etherscan
   - Display links to the verified contracts

## Contract Architecture

The ChainMailRegistry contract uses the UUPS (Universal Upgradeable Proxy Standard) pattern from OpenZeppelin:

- **Proxy Contract**: The entry point that users interact with. It delegates calls to the implementation contract.
- **Implementation Contract**: Contains the actual logic of the contract.
- **Upgradeability**: The owner can upgrade the implementation while preserving all stored data.

## Security Considerations

- Only the contract owner can perform upgrades
- Private keys should never be committed to version control
- Always use environment variables for sensitive information
- The upgrade process is protected by access control
