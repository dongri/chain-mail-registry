#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one by copying .env.example"
    echo "cp .env.example .env"
    exit 1
fi

# Source the .env file to load environment variables
source .env

# Check if required environment variables are set
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY is not set in .env file"
    exit 1
fi

if [ -z "$RPC_URL" ]; then
    echo "Error: RPC_URL is not set in .env file"
    exit 1
fi

if [ -z "$PROXY_ADDRESS" ]; then
    echo "Error: PROXY_ADDRESS is not set in .env file"
    echo "Please update your .env file with the deployed proxy contract address"
    exit 1
fi

# Compile the contracts
echo "Compiling contracts..."
forge build

# Upgrade the contract
echo "Upgrading ChainMailRegistry contract..."
echo "Proxy address: $PROXY_ADDRESS"
forge script script/ChainMailRegistryUpgrade.s.sol:ChainMailRegistryUpgradeScript --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast

echo "Upgrade complete."
