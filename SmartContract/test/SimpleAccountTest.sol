// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SimpleERC6551Account.sol";

contract SimpleAccountTest is Test {
    SimpleERC6551Account public simpleAccount;
    address internal alice;
    address internal bob;
    address payable[] internal users;
    //TODO: import ExpirableERC721 and create instance of that to set up test

    function setUp() public {
       
        simpleAccount = new SimpleERC6551Account();
        alice = users[0];
        bob = users[1];
    }

/*
function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result)
*/

    // function testExecute() public {
       // simpleAccount.executeCall()
    //     assertEq());
    // }


}
