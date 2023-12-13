const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Quantum Contract", function () {
  let Quantum;
  let quantum;
  let owner;
  let minter;
  let redeemer;

  beforeEach(async function () {
    [owner, minter, redeemer] = await ethers.getSigners();

    Quantum = await ethers.getContractFactory("Quantum");
    quantum = await Quantum.connect(owner).deploy(minter.address);
  });

  it("should deploy with the correct initial state", async function () {
    const minterRole = await quantum.MINTER_ROLE();
    expect(await quantum.hasRole(minterRole, minter.address)).to.equal(true);
  });

  it("should mint and redeem NFT voucher correctly", async function () {
    const tokenId = 1;
    const minPrice = ethers.utils.parseEther("0.1");
    const uri = "https://example.com/metadata";
    const signature = await signVoucher({ tokenId, minPrice, uri }, minter);

    // Mint NFT voucher
    await expect(
      quantum.connect(minter).redeem(redeemer.address, {
        tokenId,
        minPrice,
        uri,
        signature,
      })
    ).to.emit(quantum, "Transfer");

    // Check ownership and URI
    expect(await quantum.ownerOf(tokenId)).to.equal(redeemer.address);
    expect(await quantum.tokenURI(tokenId)).to.equal(uri);

    // Check pending withdrawal balance
    const availableToWithdraw = await quantum.availableToWithdraw();
    expect(availableToWithdraw).to.equal(minPrice);
  });

  it("should allow minter to withdraw funds", async function () {
    const amount = ethers.utils.parseEther("0.1");
    await quantum.connect(minter).withdraw();
    const minterBalance = await ethers.provider.getBalance(minter.address);
    expect(minterBalance).to.equal(amount);
  });

  // Helper function to sign a voucher
  async function signVoucher({ tokenId, minPrice, uri }, signer) {
    const domainSeparator = await quantum.DOMAIN_SEPARATOR();
    const types = {
      NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "uri", type: "string" },
      ],
    };
    const value = { tokenId, minPrice, uri };
    const signature = await signer._signTypedData(domainSeparator, types, value);
    return signature;
  }
});
