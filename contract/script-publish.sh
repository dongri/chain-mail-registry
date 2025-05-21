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

# chain id
if [ -z "$CHAIN_ID" ]; then
    echo "Error: CHAIN_ID is not set in .env file"
    exit 1
fi

if [ -z "$IMPLEMENTATION_ADDRESS" ]; then
    echo "Error: IMPLEMENTATION_ADDRESS is not set in .env file"
    exit 1
fi

# Check if ETHERSCAN_API_KEY is set
if [ -z "$ETHERSCAN_API_KEY" ]; then
    echo "Error: ETHERSCAN_API_KEY is not set in .env file"
    exit 1
fi

echo "Using Chain ID: $CHAIN_ID"
echo "Using Implementation Address: $IMPLEMENTATION_ADDRESS"

forge verify-contract \
    --chain-id $CHAIN_ID \
    --watch \
    --optimizer-runs 200 \
    $IMPLEMENTATION_ADDRESS \
    src/ChainMailRegistry.sol:ChainMailRegistry

echo "Verification process initiated. Check Etherscan for results."
