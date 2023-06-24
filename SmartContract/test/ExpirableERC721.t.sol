pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "openzeppelin/token/ERC721/ERC721.sol";
import "../src/ExpirableERC721.sol";
import "../src/ERC6551Registry.sol";
import "../src/SimpleERC6551Account.sol";
import "./utils/Utilities.sol";


//forge test --fork-url https://polygon-mumbai.g.alchemy.com/v2/NbWddpua-G8UcVsBr6xS1b52skzKUQ7a -vvv



contract ExpirableERC721Test is Test {
    Utilities internal utils;
   
    address internal alice;
    address internal bob;
    address payable[] internal users;
    ExpirableERC721 nft;
    uint256 nftId;
    //proof of human group ID
    bytes16 public constant appId = 0x9820513d88bf47db265d70a430173414;
    bytes16 public constant groupId = 0x311ece950f9ec55757eb95f3182ae5e2;
    bool public constant useSismo=false;
    //hard coded sismo proof
    bytes response = '0x1140119bd08b2f549f536af03b8d7c7359457a1a2bf2b6b811a94ec2c702f56a19f390e4be1d53be214976c136f049bc73ee1633238f1cd4511623e759dc54e01324666124f2c25628ebe87eefdd33b1b1068897d44d6758dc967599c30e8b7d0f0d604b7052a18a0c22066f163fc8316f83311d4519cf9bf84c4a0a30b51181058044f442df8641daf4ca3e06c1f9334cf4f5c9f6b5c6ebb24af044aea67a2a28ec3ba132456f4904b7c68ab35b8124021ed60dca5b16ff088a99ab90054aad2c12f4273bd96f325fdee0160e98bcc150fe9196a6c05aea5dc0b4094f3d9be10f1d528f969332c35bd080bae0954740419f7b7880e4754e77f7d35fca70f057000000000000000000000000000000000000000000000000000000000000000011f7018cd8fe1e067b1c8b978e4345ccc2308d6e982d6564ec8a7ab6ef2584692ab71fb864979b71106135acfa84afc1d756cda74f8f258896f896b4864f025630423b4c502f1cd4179a425723bf1e15c843733af2ecdee9aef6a0451ef2db741cc8e70713a43c4b753f642b1d178243f2e19306caf048185c505284b700c0301b3ed3f72199acf0e96cbe75746061e98f794a7ad709bbb28b9b5938f5ced8a11a8951ff3d3a2378ac181abb3e6980d6c3594310aefc580754aff8e556a34ee9000000000000000000000000000000000000000000000000000000000000000100ba80222e6d252d9f9b503c96a98d85442d8c1cf9ba8f6ebc1e0a6c0fffffff0000000000000000000000000000000000000000000000000000000000000000071881c8df9ef1fc86db227303d1f32b845bcf8a862534d910e5cbb5f9f5134d28992f1952565e4e943048749c9a3f885beb5ea3c032edc108cb7f055bac202400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000';


    function setUp() public {
          vm.prank(alice);
        nft = new ExpirableERC721("ExpirableERC721","EXP",groupId,useSismo);
       
        
        utils = new Utilities();
        users = utils.createUsers(3);
       alice = users[0];
       bob = users[1];

         nftId= nft.mint(alice,"blank");
        // console.log("nftID: ", nftId );

    }
    function testLendAndReclaim() public {
        
        assertEq(alice,nft.ownerOf(nftId));
        // lend to bob
        vm.startPrank(alice);
        nft.lend(bob,nftId,block.timestamp+100);
    
        assertEq(bob,nft.ownerOf(nftId));
            
        vm.warp(block.timestamp+110);
        nft.reclaim(nftId);

        assertEq(alice,nft.ownerOf(nftId)); 

        vm.expectRevert();
        nft.reclaim(nftId);
           
    }

}

