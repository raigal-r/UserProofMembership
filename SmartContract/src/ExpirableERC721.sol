// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "openzeppelin/token/ERC721/ERC721.sol";
import "openzeppelin/token/ERC721/extensions/ERC721Enumerable.sol";
import "openzeppelin-contracts/contracts/utils/Counters.sol";
import "sismo-connect-onchain-verifier/src/libs/SismoLib.sol";

contract ExpirableERC721 is ERC721, ERC721Enumerable, SismoConnect {
    using Counters for Counters.Counter;
    using SismoConnectHelper for SismoConnectVerifiedResult;

    error AlreadyClaimed();

    Counters.Counter private _tokenIds;

    mapping(uint256 => bool) claimed;
    mapping(uint256 => uint256) expiry;
    mapping(uint256 => address) lender;
    bytes16 groupID;

    bytes16 public constant APP_ID = 0x9820513d88bf47db265d70a430173414;
    bool public constant IS_IMPERSONATION_MODE = true;

    constructor(string memory _symbol, string memory _ticker, bytes16 _groupID)
        ERC721(_symbol, _ticker)
        SismoConnect(buildConfig(APP_ID, IS_IMPERSONATION_MODE))
    {
        groupID = _groupID;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function mint(address recipient, bytes memory response) public returns (uint256) {
        uint256 newId = _tokenIds.current();

        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
            auth: buildAuth({authType: AuthType.VAULT}),
            claim: buildClaim({groupId: groupID, value: 1, claimType: ClaimType.GTE}),
            signature: buildSignature({message: abi.encode(msg.sender)})
        });

        uint256 vaultId = result.getUserId(AuthType.VAULT);

        _mint(recipient, newId);

        _tokenIds.increment();
        claimed[vaultId] = true;

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
