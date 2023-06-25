// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ExpirableERC721.sol";

contract ExpirableERC721DeployScript is Script {
    ExpirableERC721 erc721;

    function run_test(
        string memory _symbol,
        string memory _ticker,
        bytes16 _groupID,
        bool _useSismo
    ) external returns (ExpirableERC721) {
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
        erc721 = new ExpirableERC721(
            "ABC",
            "DEF",
            0xd630aa769278cacde879c5c0fe5d203c,
            true
        );
        vm.stopBroadcast();
        return erc721;
    }
}
