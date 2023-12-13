
//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "./LazyNFT.sol";
contract NFTMarketplace {
    address public admin;
    Quantum public QuantumNFT;

    struct Listing {
        uint256 tokenId;
        uint256 price;
        address seller;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(uint256 indexed tokenId, uint256 price, address indexed seller);
    event NFTUnlisted(uint256 indexed tokenId);
    event NFTSold(uint256 indexed tokenId, uint256 price, address indexed seller, address indexed buyer);
    modifier onlyNFTOwner(uint256 tokenId) {
        require(QuantumNFT.ownerOf(tokenId) == msg.sender, "Not the owner of the NFT");
        _;
    }

    constructor(address _QuantumNFT) {
        admin = msg.sender;
        QuantumNFT = Quantum(_QuantumNFT);
    }

    function listNFTForSale(uint256 tokenId, uint256 price) external onlyNFTOwner(tokenId) {
        require(!listings[tokenId].isActive, "NFT already listed");
        QuantumNFT.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing({
            tokenId: tokenId,
            price: price,
            seller: msg.sender,
            isActive: true
        });
        emit NFTListed(tokenId, price, msg.sender);
    }

    function unlistNFT(uint256 tokenId) external onlyNFTOwner(tokenId) {
        require(listings[tokenId].isActive, "NFT not listed");
        QuantumNFT.transferFrom(address(this), msg.sender, tokenId);
        listings[tokenId].isActive = false;
        emit NFTUnlisted(tokenId);
    }

    function buyNFT(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "NFT not listed");
        require(msg.value >= listing.price, "Insufficient funds");
        address seller = listing.seller;
        QuantumNFT.transferFrom(address(this), msg.sender, tokenId);
        // Transfer funds to the seller
        payable(seller).transfer(msg.value);
        // Unlist the NFT after it's sold
        listing.isActive = false;
        emit NFTSold(tokenId, listing.price, seller, msg.sender);
    }

    function isNFTListed(uint256 tokenId) public view returns(bool){
        return listings[tokenId].isActive ;
    }

    function priceOfNFT(uint256 tokenId) public view returns(uint256){
        require(isNFTListed(tokenId),"NFT should be listed for sale");
        return listings[tokenId].price ;
    }

    function sellerOfNFT(uint256 tokenId) public view returns(address){
        require(isNFTListed(tokenId),"NFT should be listed for sale");
        return listings[tokenId].seller ;
    }
}