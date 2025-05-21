document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const connectWalletBtn = document.getElementById('connectWallet');
    const walletInfo = document.getElementById('walletInfo');
    const walletAddress = document.getElementById('walletAddress');
    const setEmailBtn = document.getElementById('setEmailBtn');
    const getEmailBtn = document.getElementById('getEmailBtn');
    const emailInput = document.getElementById('emailInput');
    const addressInput = document.getElementById('addressInput');
    const setEmailStatus = document.getElementById('setEmailStatus');
    const getEmailStatus = document.getElementById('getEmailStatus');
    const emailDisplay = document.getElementById('emailDisplay');
    const foundEmail = document.getElementById('foundEmail');
    const transactionModal = document.getElementById('transactionModal');
    const transactionStatus = document.getElementById('transactionStatus');
    const closeBtn = document.querySelector('.close-btn');

    // Contract details
    const contractAddress = '0x67eaa10dBe988EcFF3093A5d2e67E08AC2500ee1'; // You'll need to deploy the contract and add the address here
    const contractABI = [
        {
            "inputs": [],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "name": "setEmail",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getEmail",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newImplementation",
                    "type": "address"
                }
            ],
            "name": "upgradeTo",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newImplementation",
                    "type": "address"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "upgradeToAndCall",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                }
            ],
            "name": "EmailUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        }
    ];

    // State variables
    let provider;
    let signer;
    let contract;
    let userAddress;

    // DOM Elements for Contract Info
    const contractAddressDisplay = document.getElementById('contractAddressDisplay');
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    const networkDisplay = document.getElementById('networkDisplay');

    // Initialize the app
    async function init() {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
            
            // Setup event listeners
            connectWalletBtn.addEventListener('click', connectWallet);
            setEmailBtn.addEventListener('click', setEmail);
            getEmailBtn.addEventListener('click', getEmail);
            closeBtn.addEventListener('click', () => {
                transactionModal.classList.add('hidden');
            });
            
            // Setup copy button for contract address
            copyAddressBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(contractAddress)
                    .then(() => {
                        copyAddressBtn.innerHTML = '<i class="fas fa-check"></i>';
                        setTimeout(() => {
                            copyAddressBtn.innerHTML = '<i class="fas fa-copy"></i>';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                    });
            });
            
            // Display contract address
            contractAddressDisplay.textContent = contractAddress;
            
            // Check if already connected
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setupEthers(accounts[0]);
                }
            } catch (error) {
                console.error('Error checking connection:', error);
            }
        } else {
            console.log('MetaMask is not installed!');
            alert('Please install MetaMask to use this dApp!');
            connectWalletBtn.disabled = true;
            networkDisplay.textContent = 'MetaMask not installed';
        }
    }

    // Connect to MetaMask wallet
    async function connectWallet() {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setupEthers(accounts[0]);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            showStatus(setEmailStatus, 'Error connecting to wallet. Please try again.', 'error');
        }
    }

    // Setup ethers.js with the connected account
    async function setupEthers(account) {
        userAddress = account;
        console.log('Setting up ethers with account:', account);
        
        // Update UI
        walletAddress.textContent = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
        connectWalletBtn.classList.add('hidden');
        walletInfo.classList.remove('hidden');
        
        try {
            // Setup ethers provider
            provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log('Provider initialized:', provider);
            
            // Network is fixed to Ethereum Mainnet in the HTML
            
            signer = provider.getSigner();
            console.log('Signer initialized:', signer);
            
            // Initialize contract if address is provided
            if (contractAddress) {
                console.log('Initializing contract at address:', contractAddress);
                
                // Create contract instance
                contract = new ethers.Contract(contractAddress, contractABI, signer);
                
                // Ensure the address is set
                contract.address = contractAddress;
                
                console.log('Contract initialized:', contract);
                
                // Clear any previous error messages
                setEmailStatus.textContent = '';
                setEmailStatus.className = 'status-message';
                
                // Enable buttons
                setEmailBtn.disabled = false;
                getEmailBtn.disabled = false;
                
                // Show success message
                showStatus(setEmailStatus, 'Connected to contract successfully.', 'success');
                
            } else {
                console.warn('Contract address not provided. Please deploy the contract and update the address.');
                showStatus(setEmailStatus, 'Contract not deployed. Please deploy the contract first.', 'warning');
                setEmailBtn.disabled = true;
                getEmailBtn.disabled = true;
            }
        } catch (error) {
            console.error('Error setting up ethers:', error);
            showStatus(setEmailStatus, 'Error setting up connection. Please try again.', 'error');
        }
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                // User disconnected
                resetConnection();
            } else {
                // User switched accounts
                setupEthers(accounts[0]);
            }
        });
        
        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Network changed to chainId:', chainId);
            // Reload the page on network change
            window.location.reload();
        });
    }

    // Reset connection state
    function resetConnection() {
        userAddress = null;
        connectWalletBtn.classList.remove('hidden');
        walletInfo.classList.add('hidden');
        setEmailBtn.disabled = false;
        getEmailBtn.disabled = false;
    }

    // Set email in the contract
    async function setEmail() {
        console.log('setEmail function called');
        
        if (!contract) {
            console.error('Contract not initialized');
            showStatus(setEmailStatus, 'Contract not initialized. Please connect wallet first.', 'error');
            return;
        }
        
        console.log('Contract is initialized:', contract.address);
        
        const email = emailInput.value.trim();
        if (!email) {
            showStatus(setEmailStatus, 'Please enter an email address.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showStatus(setEmailStatus, 'Please enter a valid email address.', 'error');
            return;
        }
        
        console.log('Attempting to set email:', email);
        
        try {
            showTransactionModal('Waiting for transaction confirmation...');
            
            // Check if we're connected to the correct network
            const network = await provider.getNetwork();
            console.log('Connected to network:', network);
            
            // Get the current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('Current chain ID:', chainId);
            
            // Get the current account
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            console.log('Current account:', accounts[0]);
            
            console.log('Calling contract.setEmail with:', email);
            const tx = await contract.setEmail(email);
            console.log('Transaction submitted:', tx);
            
            showTransactionModal('Transaction submitted! Waiting for confirmation...');
            
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            
            transactionModal.classList.add('hidden');
            showStatus(setEmailStatus, 'Email successfully saved to the blockchain!', 'success');
            emailInput.value = '';
        } catch (error) {
            console.error('Error setting email:', error);
            transactionModal.classList.add('hidden');
            
            if (error.code === 4001) {
                showStatus(setEmailStatus, 'Transaction rejected by user.', 'error');
            } else if (error.message && error.message.includes('network')) {
                showStatus(setEmailStatus, 'Network error. Please check your connection.', 'error');
            } else {
                showStatus(setEmailStatus, `Error saving email: ${error.message || 'Unknown error'}`, 'error');
            }
        }
    }

    // Get email from the contract
    async function getEmail() {
        console.log('getEmail function called');
        
        if (!contract) {
            console.error('Contract not initialized');
            showStatus(getEmailStatus, 'Contract not initialized. Please connect wallet first.', 'error');
            return;
        }
        
        console.log('Contract is initialized:', contract.address);
        
        const address = addressInput.value.trim();
        if (!address) {
            showStatus(getEmailStatus, 'Please enter an Ethereum address.', 'error');
            return;
        }
        
        if (!isValidAddress(address)) {
            showStatus(getEmailStatus, 'Please enter a valid Ethereum address.', 'error');
            return;
        }
        
        console.log('Attempting to get email for address:', address);
        
        try {
            showStatus(getEmailStatus, 'Fetching email...', 'warning');
            
            // Check if we're connected to the correct network
            const network = await provider.getNetwork();
            console.log('Connected to network:', network);
            
            console.log('Calling contract.getEmail with:', address);
            const email = await contract.getEmail(address);
            console.log('Email retrieved:', email);
            
            if (email) {
                getEmailStatus.textContent = '';
                getEmailStatus.className = 'status-message';
                emailDisplay.classList.remove('hidden');
                foundEmail.textContent = email;
            } else {
                emailDisplay.classList.add('hidden');
                showStatus(getEmailStatus, 'No email found for this address.', 'warning');
            }
        } catch (error) {
            console.error('Error getting email:', error);
            emailDisplay.classList.add('hidden');
            
            if (error.message && error.message.includes('network')) {
                showStatus(getEmailStatus, 'Network error. Please check your connection.', 'error');
            } else {
                showStatus(getEmailStatus, `Error fetching email: ${error.message || 'Unknown error'}`, 'error');
            }
        }
    }

    // Show transaction modal
    function showTransactionModal(message) {
        transactionStatus.textContent = message;
        transactionModal.classList.remove('hidden');
    }

    // Show status message
    function showStatus(element, message, type) {
        element.textContent = message;
        element.className = 'status-message';
        if (type) {
            element.classList.add(type);
        }
    }

    // Validate email format
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate Ethereum address
    function isValidAddress(address) {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    }
    
    // Network is fixed to Ethereum Mainnet in the HTML

    // Initialize the app
    init();
});
