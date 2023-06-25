// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "openzeppelin/token/ERC721/ERC721.sol";
import "../src/SimpleERC6551Account.sol";
import "../src/ERC6551Registry.sol";
import "./utils/Utilities.sol";


contract SimpleERC6551AccountTest is Test {
    
    Utilities internal utils;
    SimpleERC6551Account public simpleAccount;
    ERC6551Registry public registry;
    address internal alice;
    address internal bob;
    address payable[] internal users;
    ERC721 nft;
    

    //TODO: import ExpirableERC721 and create instance of that to set up test
    //      Will need to fork mainnet if using existing registry, or create new registry and run it all locally.
    function setUp() public {
    
        users = utils.createUsers(3);
        alice = users[0];
        bob = users[1];

        vm.prank(alice);
         nft = new ERC721("ExpirableERC721","EXP");
        //simpleAccount = new SimpleERC6551Account();
    }

    //  function testExecute() public {
    // //simpleAccount.executeCall()
    //     assertEq(uint8(1), 1);
    // }

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
