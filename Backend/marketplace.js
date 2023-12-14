const Web3 = require('web3');
const web3 = new Web3('https://goerli.infura.io/v3/7d5ffa9ba30f40af82720d352ddb3b4a');
const contractAbi = [{ "inputs": [{ "internalType": "address", "name": "_QuantumNFT", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "seller", "type": "address" }], "name": "NFTListed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "price", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "seller", "type": "address" }, { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }], "name": "NFTSold", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "NFTUnlisted", "type": "event" }, { "inputs": [], "name": "QuantumNFT", "outputs": [{ "internalType": "contract Quantum", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "buyNFT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "isNFTListed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "name": "listNFTForSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "listings", "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "bool", "name": "isActive", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "priceOfNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "sellerOfNFT", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "unlistNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const contractAddress = '0x2aa80687Ef2d34d50b0FC8402A234aC41Ff8bdBf';
const nftMarketplace = new web3.eth.Contract(contractAbi, contractAddress);

// post method
const listNFTForSale = async (tokenId, price) => {
    try {
        const result = await nftMarketplace.methods.listNFTForSale(tokenId, price).send({ from: 'your_wallet_address' });
        console.log('NFT Listed:', result);
    } catch (error) {
        console.error('Error listing NFT:', error.message);
    }
};

//post method
const unlistNFT = async (tokenId) => {
    try {
        const result = await nftMarketplace.methods.unlistNFT(tokenId).send({ from: 'your_wallet_address' });
        console.log('NFT Unlisted:', result);
    } catch (error) {
        console.error('Error unlisting NFT:', error.message);
    }
};

//post method
const buyNFT = async (tokenId, value) => {
    try {
        const result = await nftMarketplace.methods.buyNFT(tokenId).send({ from: 'your_wallet_address', value });
        console.log('NFT Bought:', result);
    } catch (error) {
        console.error('Error buying NFT:', error.message);
    }
};

// get method
const isNFTListed = async (tokenId) => {
    try {
        const result = await nftMarketplace.methods.isNFTListed(tokenId).call();
        console.log('Is NFT Listed:', result);
    } catch (error) {
        console.error('Error checking if NFT is listed:', error.message);
    }
};

//get method
const priceOfNFT = async (tokenId) => {
    try {
        const result = await nftMarketplace.methods.priceOfNFT(tokenId).call();
        console.log('Price of NFT:', result);
    } catch (error) {
        console.error('Error getting price of NFT:', error.message);
    }
};

//get method
const sellerOfNFT = async (tokenId) => {
    try {
        const result = await nftMarketplace.methods.sellerOfNFT(tokenId).call();
        console.log('Seller of NFT:', result);
    } catch (error) {
        console.error('Error getting seller of NFT:', error.message);
    }
};

module.exports = {
    listNFTForSale,
    unlistNFT,
    buyNFT,
    isNFTListed,
    priceOfNFT,
    sellerOfNFT,
};
