//import { ethers } from "hardhat";
// step to use our own address
// 1) remove hardhat and import { ethers } from etehrs;
import { ethers } from "ethers";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
//dotenv.config();
require('dotenv').config();
// 2) build a signers ourself from ethers API docs
// 3) use the deault API key but is highly throttle
// 4) to use our .env: yarn add --dev dotenv
// import * as dotenv from 'dotenv';
// dotenv.config();


const GIO_ADDRESS = "0xFc4A978B4D7d3A931419d3d5cc0F7Efb408c8457";



const addresses =
{
  "Giulio" : "0x8ab781088D9D97Aa7b48118964a3157c13a0cBEc",
  "Desmo": "0x8e241633b239865f971bb21604aBaAADdC34eb50",
  "Claudio": "0x034CF18e2Ff18a5bEe003d46444D3F2743Ca7Ca8",
  "Chris":  "0x75dE164aa2f83625def6257cC99d40C8C4f659d9",
};

const VOTERS = ['D9D97Aa7b48118964a3157c13a0cBEc', 
'0x034CF18e2Ff18a5bEe003d46444D3F2743Ca7Ca8', 
'0x8e241633b239865f971bb21604aBaAADdC34eb50', 
'0x8ab781088D9D97Aa7b48118964a3157c13a0cBEc'];


async function main() {
  console.log("Connecting to blockchain");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Chairman with address ${GIO_ADDRESS}`);
  console.log(`Alchemy key is of length ${process.env.ALCHEMY_API_KEY?.length}`)
  const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
  const lastBlock = await provider.getBlock("latest");
  console.log(`The last block is ${lastBlock.number}`)

  console.log(`Using wallet address ${wallet.address}`);

  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(`Balance of ${signer.address} is ${Number(balance) / 1e18} WEI`);
  const proposals = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  //const ballotFactory = await ethers.getContractFactory("Ballot");
  // exactly same as above except now I pass a signer
  const ballotFactory = new Ballot__factory(signer); 
  const ballotContract = await ballotFactory.deploy(
  proposals.map(ethers.utils.formatBytes32String));
  const chairperson = await ballotContract.chairperson();
  

  const deployTx = (await ballotContract).deployTransaction.wait();
  console.log({deployTx}); 
  console.log(`The contract was deployed at address: ${ballotContract.address},
  //at block; ${(await deployTx).blockNumber}`)
  for (let index = 0; index < VOTERS.length; index++) {
    const voter = VOTERS[index];
    console.log(`Giving right to vote to ${voter}`);
    const tx = await ballotContract.giveRightToVote(voter);
    const receipt = await tx.wait();
    console.log(`Tx hash is ${receipt.transactionHash} in block ${receipt.blockNumber}`);
  }



};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});