require("@nomicfoundation/hardhat-toolbox");
const INFURA_API_KEY = "7d5ffa9ba30f40af82720d352ddb3b4a";
const PRIVATE_KEY = "6caba9dd2c3c85a49ad7e5f27fcf6514b3418827875be775c165ee24141404d3";

module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }
};

