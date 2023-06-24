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
    address internal carol;
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
        erc721 = deployer.run("A", "B", groupID, false);

        utils = new Utilities();
        users = utils.createUsers(3);
        alice = users[0];
        bob = users[1];
        carol = users[2];
    }

    function testMint() public {
        vm.prank(alice);
        erc721.mint(alice, "");

        assertEq(erc721.balanceOf(alice), 1);
    }

    function testLendAndReclaim() public {
        vm.startPrank(alice);
        uint256 nftId = erc721.mint(alice, "");
        assertEq(alice, erc721.ownerOf(nftId));
        // lend to bob
        erc721.lend(bob, nftId, block.timestamp + 100);

        assertEq(bob, erc721.ownerOf(nftId));

        vm.warp(block.timestamp + 110);
        vm.stopPrank();

        vm.startPrank(carol);
        erc721.reclaim(nftId);

        assertEq(alice, erc721.ownerOf(nftId));

        vm.expectRevert();
        erc721.reclaim(nftId);
    }
}
