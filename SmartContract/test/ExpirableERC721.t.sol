// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./base/BaseTest.t.sol";
import "forge-std/Test.sol";
import "../src/ExpirableERC721.sol";
import "./utils/Utilities.sol";
import "../script/ExpirableERC721.s.sol";

contract ExpirableERC721Test is BaseTest {
    Utilities internal utils;
    address internal alice;
    address internal bob;
    address payable[] internal users;

    ExpirableERC721 public erc721;
    ExpirableERC721DeployScript public deployer;
    address public deployerAddress;

    //proof of human group ID
    bytes16 public constant groupID = 0x9820513d88bf47db265d70a430173414;
    //hard coded sismo proof
    bytes response = "";

    function setUp() public {
        deployer = new ExpirableERC721DeployScript();
        erc721 = deployer.run("A", "B", groupID);

        // utils = new Utilities();
        // users = utils.createUsers(3);
        // alice = users[0];
        // bob = users[1];

        //mint

        // uint nftId= nft.mint(alice,response);
        // console.log("nftID: ", nftId );
    }

    function testLendAndReclaim() public {
        vm.prank(alice);
        //lend to bob, check that he has permissions
        assertEq(uint8(1), 1);
    }
}
