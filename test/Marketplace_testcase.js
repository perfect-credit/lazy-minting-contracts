const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarketplace', () => {
    let admin, seller, buyer, QuantumNFT, marketplace;

    beforeEach(async () => {
        [admin, seller, buyer] = await ethers.getSigners();

        // Deploy QuantumNFT contract
        const QuantumNFTContract = await ethers.getContractFactory('Quantum');
        QuantumNFT = await QuantumNFTContract.deploy();
        await QuantumNFT.deployed();

        // Deploy NFTMarketplace contract
        const MarketplaceContract = await ethers.getContractFactory('NFTMarketplace');
        marketplace = await MarketplaceContract.deploy(QuantumNFT.address);
        await marketplace.deployed();

        // Mint an NFT for the seller
        await QuantumNFT.mint(seller.address, 1);
    });

    it('should list an NFT for sale', async () => {
        const price = ethers.utils.parseEther('1.0');
        await QuantumNFT.connect(seller).approve(marketplace.address, 1);
        await marketplace.connect(seller).listNFTForSale(1, price);

        const listing = await marketplace.listings(1);
        expect(listing.tokenId).to.equal(1);
        expect(listing.price).to.equal(price);
        expect(listing.seller).to.equal(seller.address);
        expect(listing.isActive).to.equal(true);
    });

    it('should not allow listing an already listed NFT', async () => {
        const price = ethers.utils.parseEther('1.0');
        await QuantumNFT.connect(seller).approve(marketplace.address, 1);
        await marketplace.connect(seller).listNFTForSale(1, price);

        // Try listing the same NFT again
        await expect(marketplace.connect(seller).listNFTForSale(1, price)).to.be.revertedWith('NFT already listed');
    });

    it('should unlist an NFT', async () => {
        const price = ethers.utils.parseEther('1.0');
        await QuantumNFT.connect(seller).approve(marketplace.address, 1);
        await marketplace.connect(seller).listNFTForSale(1, price);

        await marketplace.connect(seller).unlistNFT(1);
        const listing = await marketplace.listings(1);
        expect(listing.isActive).to.equal(false);
    });

    it('should not allow unlisting an NFT that is not listed', async () => {
        // Try unlisting an NFT that is not listed
        await expect(marketplace.connect(seller).unlistNFT(1)).to.be.revertedWith('NFT not listed');
    });

    it('should allow buying an NFT', async () => {
        const price = ethers.utils.parseEther('1.0');
        await QuantumNFT.connect(seller).approve(marketplace.address, 1);
        await marketplace.connect(seller).listNFTForSale(1, price);

        const initialBalanceSeller = await ethers.provider.getBalance(seller.address);
        const initialBalanceBuyer = await ethers.provider.getBalance(buyer.address);

        await marketplace.connect(buyer).buyNFT(1, { value: price });

        const listing = await marketplace.listings(1);
        const finalBalanceSeller = await ethers.provider.getBalance(seller.address);
        const finalBalanceBuyer = await ethers.provider.getBalance(buyer.address);

        expect(listing.isActive).to.equal(false);
        expect(finalBalanceSeller).to.equal(initialBalanceSeller.add(price));
        expect(finalBalanceBuyer).to.be.lessThan(initialBalanceBuyer.sub(price));
    });

    it('should not allow buying an NFT with insufficient funds', async () => {
        const price = ethers.utils.parseEther('1.0');
        await QuantumNFT.connect(seller).approve(marketplace.address, 1);
        await marketplace.connect(seller).listNFTForSale(1, price);

        // Try buying with insufficient funds
        await expect(marketplace.connect(buyer).buyNFT(1, { value: ethers.utils.parseEther('0.5') }))
            .to.be.revertedWith('Insufficient funds');
    });

    it('should not allow buying an NFT that is not listed', async () => {
        // Try buying an NFT that is not listed
        await expect(marketplace.connect(buyer).buyNFT(1, { value: ethers.utils.parseEther('1.0') }))
            .to.be.revertedWith('NFT not listed');
    });
});
