# Ballot.sol and HelloWorld.sol with tests

The HelloWorld.sol is not deployed here and is used as an example to build the first test and
to explain some important concept in solidity.
It can be run on remix.
# HelloWorld.sol

# Description 
This simple smart contract is a demonstration of how to create and modify state in solidity.

# Explanation
1) all the functions are either public or internal. 
Rool of thumbs:
- Use external functions when you want to expose contract functions to be called externally and save gas costs.
- Use public functions when you need to access the function both internally and externally and when you want to generate a getter function for public state variables.
- Use internal when you want to restrict access to functions and variables only within the contract and its derived contracts.
- Use private when you want to restrict access to functions and variables only within the contract, without allowing access to derived contracts.
2) All the functions are either pure, view or regular which is the default:
- Use view functions when you want to retrieve information from the contract without modifying its state.
- Use pure functions when you want to perform calculations or transformations on input parameters without accessing or modifying the contract's state.
(In summary, view functions are used when reading the contract's state, while pure functions are used when the function does not read or modify the contract's state and is isolated from the contract's state variables.)
- Use payable functions when you want to receive and handle ETH within a function call.
     - They can receive ETH as part of the function call and modify the contract's state.
     - They can access the msg.value variable to determine the amount of ETH received.
- Use regular functions for general purpose logic that involves modifying the contract's state but does not fall under the specific categories of view, pure, or payable functions.
3) In Solidity, dynamic types like string require an extra level of indirection to access and modify the data. This is because the length of a string is not known in advance, and it can change during execution. Therefore, Solidity stores a pointer to the actual data in memory or calldata, rather than storing the data directly.

By explicitly specifying the storage location (memory or calldata), you provide clarity to the compiler about how the string argument should be handled. It helps the compiler determine the appropriate way to store and access the data within the function.
When you pass a string argument to a function, the storage location tells Solidity whether the argument should be treated as read-only (calldata) or modifiable (memory). This distinction is important because it affects how the function interacts with the string data and helps avoid unnecessary memory allocations or potential bugs.

In summary, the fact that string is a dynamic type that can vary in length makes a difference in how it needs to be stored and accessed in Solidity. By explicitly specifying the storage location, you ensure that the compiler understands how to handle the string argument correctly.

# Content
You can get the text "Hello Wolrd", set a new Text modifying the state of the smart contract. Verify if the text is the original text or enforce the original text

# Ballot.sol
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