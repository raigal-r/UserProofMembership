// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/ExpirableERC721.sol";

contract ExpirableERC721DeployScript is Script {
    ExpirableERC721 erc721;

    bytes16 public constant GROUP_ID = 0xa4ff29395199edcc63221e5b9b5c202d;

    function run_test(string memory _symbol, string memory _ticker, bytes16 _groupID, bool _useSismo)
        external
        returns (ExpirableERC721)
    {
        if (block.chainid == 5) {
            uint256 deployerKey = vm.envUint("PRIVATE_KEY");
            vm.startBroadcast(deployerKey);
            erc721 = new ExpirableERC721(_symbol, _ticker, _groupID, _useSismo);
            vm.stopBroadcast();
            return erc721;
        }
        erc721 = new ExpirableERC721(_symbol, _ticker, _groupID, _useSismo);
        return erc721;
    }

    function run() external returns (ExpirableERC721) {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerKey);
        erc721 = new ExpirableERC721("ABC", "DEF", GROUP_ID, true);
        vm.stopBroadcast();
        return erc721;
    }
}
