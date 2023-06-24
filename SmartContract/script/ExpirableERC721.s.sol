// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ExpirableERC721.sol";

contract ExpirableERC721DeployScript is Script {
    ExpirableERC721 erc721;

    function run(string memory _symbol, string memory _ticker, bytes16 _groupID) external returns (ExpirableERC721) {
        if (block.chainid == 5) {
            uint256 deployerKey = vm.envUint("PRIVATE_KEY");
            vm.startBroadcast(deployerKey);
            erc721 = new ExpirableERC721(_symbol, _ticker, _groupID);
            vm.stopBroadcast();
            return erc721;
        }
        erc721 = new ExpirableERC721(_symbol, _ticker, _groupID);
        return erc721;
    }
}
