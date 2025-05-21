# ChainMailRegistry Frontend

A decentralized application for storing and retrieving email addresses on the blockchain using the ChainMailRegistry smart contract.

## Features

- Connect to MetaMask wallet
- Store your email address on the blockchain
- Lookup email addresses associated with Ethereum addresses
- Clean, responsive UI

## Setup Instructions

### Prerequisites

- MetaMask browser extension installed
- ChainMailRegistry contract deployed to a blockchain network

### Deployment Steps

1. **Deploy the ChainMailRegistry Contract**

   For contract deployment instructions, please refer to the [Contract README](../contract/README.md).

2. **Update Contract Address in the Frontend**

   After deploying the contract, open `js/script.js` and update the `contractAddress` variable with your deployed contract address:

   ```javascript
   // Contract details
   const contractAddress = '0xYourContractAddressHere'; // Replace with your deployed contract address
   ```

3. **Serve the Frontend**

   You can use any static file server to serve the frontend. For example, using Python's built-in HTTP server:

   ```bash
   # Navigate to the frontend directory
   cd frontend

   # Start a simple HTTP server
   python -m http.server 8000
   ```

   Or using Node.js with a package like `serve`:

   ```bash
   # Install serve globally
   npm install -g serve

   # Serve the frontend
   serve -s .
   ```

4. **Access the Application**

   Open your browser and navigate to the URL where your frontend is being served (e.g., `http://localhost:8000`).

## Using the Application

1. **Connect Your Wallet**
   - Click the "Connect Wallet" button
   - Approve the connection request in MetaMask

2. **Store Your Email**
   - Enter your email address in the "Your Email Address" field
   - Click "Save Email"
   - Approve the transaction in MetaMask
   - Wait for the transaction to be confirmed

3. **Lookup an Email**
   - Enter an Ethereum address in the "Ethereum Address" field
   - Click "Lookup Email"
   - The associated email address will be displayed if one exists

## Development

### File Structure

- `index.html` - Main HTML file
- `css/styles.css` - Stylesheet
- `js/script.js` - JavaScript for wallet connection and contract interaction
- `images/` - Image assets

### Technologies Used

- HTML5, CSS3, JavaScript
- ethers.js for Ethereum interaction
- MetaMask for wallet connection
- Font Awesome for icons

## Notes

- This is a frontend application that interacts with the ChainMailRegistry smart contract
- The contract must be deployed separately before using this frontend
- Make sure to update the contract address in the script.js file
- The application requires MetaMask to function properly
- For security, always use environment variables for private keys instead of hardcoding them
