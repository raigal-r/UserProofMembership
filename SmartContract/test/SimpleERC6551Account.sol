// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "openzeppelin/token/ERC721/ERC721.sol";
import "../src/SimpleERC6551Account.sol";


contract SimpleAccountTest is Test {
    SimpleERC6551Account public simpleAccount;
    address internal alice;
    address internal bob;
    address payable[] internal users;
    ERC721 nft;

    //TODO: import ExpirableERC721 and create instance of that to set up test
    //      Will need to fork mainnet if using existing registry, or create new registry and run it all locally.
    function setUp() public {
        nft = new ERC721("ExpirableERC721","EXP");
        simpleAccount = new SimpleERC6551Account();
        alice = users[0];
        bob = users[1];
    }

    // function createAccount() public {
    // simpleAccount.executeCall()
    //     assertEq());
    // }

    // function testExecute() public {
    // simpleAccount.executeCall()
    //     assertEq());
    // }




    /*
    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result)
    */
}
