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
    console.log(`${address} is having BAL:  ${balance}.`);
  }
}
async function main() {
  //create depploy instance of contract and deploy
  const [owner, tipper, tipper2] = await ethers.getSigners();
  const BuyMeCoffee = await ethers.getContractFactory("BuyMeCoffee");
  const buyMeCoffee = await BuyMeCoffee.deploy();
  console.log(`deployed contract address is ${buyMeCoffee.address}.`);

  //check balance before coffee purchase
  const accounts = [owner.address, tipper.address, tipper2.address];
  await printBalances(accounts);

  //buy owner a coffee
  const tip = { value: ethers.utils.parseEther("1") };
  console.log("===Buying Coffee===");
  await buyMeCoffee
    .connect(tipper)
    .buyCoffee("ashraf", "we love ashraf!!", tip);
  await buyMeCoffee
    .connect(tipper2)
    .buyCoffee("sahil", "awesome teacher!!", tip);

  //print balance after tip
  await printBalances(accounts);

  //check contract balance
  console.log("=== Contract Balance ===");
  console.log(`Balance :  `, await getBalance(buyMeCoffee.address));

  //withdraw tip
  console.log("=== Withdrawing Tip ===");
  await buyMeCoffee.connect(owner).withdraw();
  await printBalances(accounts);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
