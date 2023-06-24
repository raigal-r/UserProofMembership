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
    error AlreadyLent();
    error InvalidExpiry();
    error NotExpiredYet();
    error NotLoaned();
    error OwnerZero();

    Counters.Counter private _tokenIds;

    mapping(uint256 => bool) claimed;
    mapping(uint256 => uint256) expiry;
    mapping(uint256 => bool) currentLoan;
    mapping(uint256 => address) lender;
    bytes16 groupID;
    bool useSismo;

    bytes16 public constant APP_ID = 0x9820513d88bf47db265d70a430173414;
    bool public constant IS_IMPERSONATION_MODE = true;

    constructor(string memory _symbol, string memory _ticker, bytes16 _groupID, bool _useSismo)
        ERC721(_symbol, _ticker)
        SismoConnect(buildConfig(APP_ID, IS_IMPERSONATION_MODE))
    {
        groupID = _groupID;
        useSismo = _useSismo;
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

        if (useSismo) {
            SismoConnectVerifiedResult memory result = verify({
                responseBytes: response,
                auth: buildAuth({authType: AuthType.VAULT}),
                claim: buildClaim({groupId: groupID, value: 1, claimType: ClaimType.GTE}),
                signature: buildSignature({message: abi.encode(msg.sender)})
            });
            uint256 vaultId = result.getUserId(AuthType.VAULT);

            if (claimed[vaultId] == true) {
                revert AlreadyClaimed();
            }

            claimed[vaultId] = true;
        }

        _mint(recipient, newId);

        _tokenIds.increment();

        return newId;
    }

    function lend(address recipient, uint256 tokenId, uint256 _expiry) public {
        if (currentLoan[tokenId] == true) {
            revert AlreadyLent();
        }

        if (_expiry <= block.timestamp) {
            revert InvalidExpiry();
        }

        transferFrom(msg.sender, recipient, tokenId);
        expiry[tokenId] = _expiry;
        lender[tokenId] = msg.sender;
        currentLoan[tokenId] = true;
    }

    function reclaim(uint256 tokenId) public {
        if (expiry[tokenId] > block.timestamp) {
            revert NotExpiredYet();
        }

        if (currentLoan[tokenId] == false) {
            revert NotLoaned();
        }

        if (lender[tokenId] == address(0)) {
            revert OwnerZero();
        }

        _transfer(ownerOf(tokenId), lender[tokenId], tokenId);
        expiry[tokenId] = 0;
        lender[tokenId] = address(0);
        currentLoan[tokenId] = false;
    }

    function getOwnedTokenIds(address wallet) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(wallet);
        uint256[] memory ids = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            ids[i] = IERC721Enumerable(this).tokenOfOwnerByIndex(wallet, i);
        }
        return ids;
    }
}
