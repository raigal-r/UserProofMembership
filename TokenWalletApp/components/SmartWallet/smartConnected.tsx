import {
  ThirdwebNftMedia,
  ThirdwebSDKProvider,
  useAddress,
  useBalance,
  useContract,
  useOwnedNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import React from "react";
import { activeChain, tokenAddress, EDITIONDROP_ADDRES } from "../../const/constants";
import { Signer } from "ethers";
import style from "../../styles/Token.module.css";
import toast from "react-hot-toast";
import toastStyle from "../../util/toastConfig";
interface ConnectedProps {
  signer: Signer | undefined;
}

// ThirdwebSDKProvider is a wrapper component that provides the smart wallet signer and active chain to the Thirdweb SDK.
const SmartWalletConnected: React.FC<ConnectedProps> = ({ signer }) => {
  return (
    <ThirdwebSDKProvider signer={signer} activeChain={activeChain}>
      <ClaimTokens />
    </ThirdwebSDKProvider>
  );
};

// This is the main component that shows the user's token bound smart wallet.
const ClaimTokens = () => {
  const address = useAddress();
  const { data: tokenBalance, isLoading: loadingBalance } =
    useBalance(tokenAddress);
  const {
    contract
  }= useContract(EDITIONDROP_ADDRES);

  const {
    data:ownedNFTs,
    isLoading: ownedNFTisLoading,
  } = useOwnedNFTs(contract, address);

  return (
    <div className={style.walletContainer}>
      <h2>This is Your Token Bound Smart Wallet!</h2>
      {address ? (
        loadingBalance ? (
          <h2>Loading Balance...</h2>
        ) : (
          <div className={style.pricingContainer}>
            <h2>Balance: {tokenBalance?.displayValue}</h2>
            {<Web3Button
              contractAddress={tokenAddress}
              action={async (contract) => await contract.erc20.claim(10)}
              onSuccess={() => {
                toast(`NFT Claimed!`, {
                  icon: "✅",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
              onError={(e) => {
                console.log(e);
                toast(`NFT Claim Failed! Reason: ${(e as any).reason}`, {
                  icon: "❌",
                  style: toastStyle,
                  position: "bottom-center",
                });
              }}
            >
              Claim 10 Tokens
            </Web3Button>}
            {
            <Web3Button 
            contractAddress = {EDITIONDROP_ADDRES}
            action = {(contract) => contract.erc721.claim(1)}> Claim NFT
            
            </Web3Button>}
            {ownedNFTisLoading ?(
              <p>Loading...</p>
            ): (
              <div>
                {ownedNFTs && ownedNFTs.length > 0 ? (
                  ownedNFTs.map((nft) => (
                    <div>
                      <ThirdwebNftMedia
                        metadata={nft.metadata}
                        />
                        <p>{nft.metadata.name}</p>
                        <p>QYT:{nft.quantityOwned}</p>
                      </div>
                  ))
                ) : (
                  <p>You have no NFTs</p>
                )}
              </div>
            )}
           
          </div>
        )
      ) : null}
    </div>
  );
};

export default SmartWalletConnected;
