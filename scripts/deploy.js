const hre = require('hardhat');

async function main() {
  const minterAddress = "0x0d747DCF00c94EB47fa2EAf34a7bf71576461eCB";

  // Deploy QuantumNFT contract
  const Quantum = await hre.ethers.getContractFactory('Quantum'); // Assuming 'Quantum' is the name of your contract
  const quantum = await Quantum.deploy();
  await quantum.deployed();
  console.log("Quantum deployed to:", quantum.address);

  // Deploy NFTMarketplace contract
  const QuantumNFTMarketplace = await hre.ethers.getContractFactory('NFTMarketplace');
  const quantumNFTMarketplace = await QuantumNFTMarketplace.deploy(quantum.address);
  await quantumNFTMarketplace.deployed();
  console.log('QuantumNFTMarketplace deployed to:', quantumNFTMarketplace.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
