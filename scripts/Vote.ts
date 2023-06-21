import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot, Ballot__factory } from "../typechain-types";
import { extendConfig } from "hardhat/config";
import * as dotenv from 'dotenv';
dotenv.config()

const PROPOSALS = [""];

const myAddress = '0xFc4A978B4D7d3A931419d3d5cc0F7Efb408c8457'

const ABI = [{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],
"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"chairperson","outputs"
:[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"delegate","outputs":[],
"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"voter",
"type":"address"}],"name":"giveRightToVote","outputs":[],"stateMutability":"nonpayable","type":"function"},
{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":
[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount",
"type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256",
"name":"proposal","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":
"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"voters","outputs":
[{"internalType":"uint256","name":"weight","type":"uint256"},{"internalType":"bool","name":"voted","type":
"bool"},{"internalType":"address","name":"delegate","type":"address"},{"internalType":"uint256","name":
"vote","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName",
"outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view",
"type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":
"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }
  //proposals.map(ethers.utils.formatBytes32String)

async function main() {
    console.log("Connecting to blockchain");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Using signer with address ${myAddress}`);
    console.log(`Alchemy key is of length ${process.env.ALCHEMY_API_KEY?.length}`)

    const provider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const lastBlock = await provider.getBlock("latest");
    console.log(`The last block is ${lastBlock.number}`)

    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Wallet balance is ${Number(balance) / 1e18} ETH`); 


    console.log("Attaching to Ballot contract");
    let ballotContract: Ballot;
    const BallotContract = new ethers.Contract("0x1B4F2137cBC46F36dE0d426145307CA47A07943F", ABI, signer);
    const winnerName = await BallotContract.winnerName();
    console.log(`Winner at the moment is ${ethers.utils.parseBytes32String(winnerName)}`);   


    console.log("Proposals: ");
    for (let i = 0; i < 3; i++) {
        const proposal = await BallotContract.proposals(i);
        console.log(`Proposal ${i} is ${ethers.utils.parseBytes32String(proposal.name)}`);
        
    }
    

    const voteTx = await BallotContract.vote(2);
    const voteTxReceipt = await voteTx.wait();
    console.log(`Tx hash is ${voteTxReceipt.transactionHash} in block ${voteTxReceipt.blockNumber}`);
    console.log(`Gas used: ${voteTxReceipt.gasUsed.toString()}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});