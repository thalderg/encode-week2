import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
//dotenv.config();
require('dotenv').config();

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

const ADDRESSES = {
    'Giulio': "0x8ab781088D9D97Aa7b48118964a3157c13a0cBEc",
    'Desmo': "0x8e241633b239865f971bb21604aBaAADdC34eb50",
    'Claudio': "0x034CF18e2Ff18a5bEe003d46444D3F2743Ca7Ca8",
    'Chris':  "0x75dE164aa2f83625def6257cC99d40C8C4f659d9",
  };
  
  async function main() {
    //const etherSigners = await ethers.getSigners();
    //const signer = etherSigners[0];
    //const wallet = ethers.Wallet.createRandom();
    const myAddress = '0xFc4A978B4D7d3A931419d3d5cc0F7Efb408c8457'


    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Using wallet address ${wallet.address}`);
    const provider = new ethers.providers.AlchemyProvider(
      "goerli",
      process.env.ALCHEMY_API_KEY
    );

    const lastBlock = await provider.getBlock("latest");
    console.log(`The last block is ${lastBlock.number}`);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Balance of ${signer.address} is ${balance} WEI`);

    console.log("Attaching to Ballot contract");
    const ballotContract = new ethers.Contract("0xcb904C49c150FCdD675AE38326850FB9B15421e3", ABI, signer);
    const winnerName = await ballotContract.winnerName();
    console.log(`Winner at the moment is ${ethers.utils.parseBytes32String(winnerName)}`);   


    console.log("Proposals: ");
    for (let i = 0; i < 4; i++) {
        const proposal = await ballotContract.proposals(i);
        console.log(`Proposal ${i} is ${ethers.utils.parseBytes32String(proposal.name)}`);
    }
  
    const voters = await ballotContract.voters("0x8ab781088D9D97Aa7b48118964a3157c13a0cBEc");
    console.log(voters)
    //const giveRightToVoteTx1 = await ballotContract.giveRightToVote(ADDRESSES.Giulio);
    //const giveRightToVoteTx1Receipt = await giveRightToVoteTx1.wait();
    //console.log(`The transaction hash is ${giveRightToVoteTx1Receipt.transactionHash} 
    //included at the block ${giveRightToVoteTx1Receipt.blockNumber}`);
    //const giveRightToVoteTx2 = await ballotContract.giveRightToVote(ADDRESSES.Desmo);
    //const giveRightToVoteTx2Receipt = await giveRightToVoteTx2.wait();
    //console.log(`The transaction hash is ${giveRightToVoteTx2Receipt.transactionHash} 
    //included at the block ${giveRightToVoteTx2Receipt.blockNumber}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
