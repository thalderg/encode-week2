//import { ethers } from "hardhat";
// step to use our own address
// 1) remove hardhat and import { ethers } from etehrs;
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
//dotenv.config();
require('dotenv').config();
// 2) build a signers ourself from ethers API docs
// 3) use the deault API key but is highly throttle
// 4) to use our .env: yarn add --dev dotenv
// import * as dotenv from 'dotenv';
// dotenv.config();


const myAddress = "0xFc4A978B4D7d3A931419d3d5cc0F7Efb408c8457";

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
    const BallotContract = new ethers.Contract("0xcb904C49c150FCdD675AE38326850FB9B15421e3", ABI, signer);

    const winnerName = await BallotContract.winnerName();
    console.log(`Winner at the moment is ${ethers.utils.parseBytes32String(winnerName)}`);   


    console.log("Proposals: ");
    for (let i = 0; i < 3; i++) {
        const proposal = await BallotContract.proposals(i);
        console.log(`Proposal ${i} ${ethers.utils.parseBytes32String(proposal.name)} 
        has ${proposal.voteCount} votes`);
    }

    //let delegation = '0x034CF18e2Ff18a5bEe003d46444D3F2743Ca7Ca8'
    //console.log(`I will delegate my vote to ${delegation}`);
    //const voteTx = await BallotContract.vote(2);
    //const voteTx = await BallotContract.vote(2)
    const delegateTx = await BallotContract.delegate("0x75dE164aa2f83625def6257cC99d40C8C4f659d9");
    const delegateTxReceipt = await delegateTx.wait();
    console.log(`Tx hash is ${delegateTxReceipt.transactionHash} in block ${delegateTxReceipt.blockNumber}`);
    console.log(`Gas used: ${delegateTxReceipt.gasUsed.toString()}`);
}


    main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });