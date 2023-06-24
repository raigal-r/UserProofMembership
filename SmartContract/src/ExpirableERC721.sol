// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "openzeppelin/token/ERC721/ERC721.sol";
import "openzeppelin/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";

contract ExpirableERC721 is ERC721, ERC721Enumerable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    mapping(bytes => bool) claimed;
    mapping(uint256 => uint256) expiry;
    mapping(uint256 => address) lender;

    constructor(string memory _symbol, string memory _ticker) ERC721(_symbol, _ticker) {}

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function mint(address recipient, bytes memory proof) public returns (uint256) {
        uint256 newId = _tokenIds.current();

        // TODO: proof verification

        _mint(recipient, newId);

        _tokenIds.increment();
        claimed[proof] = true;

        return newId;
    }

    function lend(address recipient, uint256 tokenId, uint256 _expiry) public {
        require(expiry[tokenId] > 0, "cannot lend already loaned token");
        require(_expiry > block.timestamp, "expiry time in the past");

        transferFrom(msg.sender, recipient, tokenId);
        expiry[tokenId] = _expiry;
        lender[tokenId] = msg.sender;
    }

    function reclaim(uint256 tokenId) public {
        require(expiry[tokenId] <= block.timestamp, "expiry time not up yet");

        _transfer(ownerOf(tokenId), lender[tokenId], tokenId);
        expiry[tokenId] = 0;
        lender[tokenId] = address(0);
    }
}
