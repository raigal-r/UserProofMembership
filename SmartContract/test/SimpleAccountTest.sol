// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/SimpleAccount.sol";

contract SimpleAccountTest is Test {
    SimpleAccount public simpleAccount;

    function setUp() public {
       
        simpleAccount = new SimpleAccount();
    }

    // function testIncrement() public {
    //     counter.increment();
    //     assertEq(counter.number(), 1);
    // }

    // function testSetNumber(uint256 x) public {
    //     counter.setNumber(x);
    //     assertEq(counter.number(), x);
    // }
}
