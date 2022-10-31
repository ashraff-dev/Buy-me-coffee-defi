// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { waffle, ethers } = require("hardhat");

//return ether balance of given contract
async function getBalance(address) {
  const balnceBigInt = await waffle.provider.getBalance(address);
  return ethers.utils.formatEther(balnceBigInt);

}

//log the list of balance of given list of address
async function printBalances(addresses) {
  for (const address of addresses) {
    const balance = await getBalance(address);
    console.log(`${address} is having ${balance}.`);
  }
}
async function main() {
  //create depploy instance of contract and deploy
  const [owner, tipper, tipper2] = await ethers.getSigners();
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();
  console.log(`deployed contract address is ${buyMeCoffee.address}`);

  //print account
  const accounts = [owner.address , tipper.address, tipper2.address];
  await printBalances(accounts);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
