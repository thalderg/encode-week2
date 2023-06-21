# Ballot.sol and HelloWorld.sol with tests

The HelloWorld.sol is n ot deployed here and is used as an example to build the first test.
The one deployed in the script is the Ballot.sol contract without ERC20.
It can be run as below with yarn and is taking command line arguments as proposals

```shell
yarn run ts-node --files scripts\DeployBallot2.0.ts "Water" "Whisky" "Rhum" "Beer" "Coke"
yarn hardhat run scripts/giveRightToVote.ts
yarn hardhat run .\scripts\DeployERC20Votes2.0.ts
```

Below an example of npx with hardhat, is not related to this project
```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```