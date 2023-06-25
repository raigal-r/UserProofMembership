"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useDisconnect,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from "wagmi";
import {
  mainnet,
  goerli,
  sepolia,
  optimism,
  optimismGoerli,
  arbitrum,
  arbitrumGoerli,
  scrollTestnet,
  gnosis,
  polygon,
  polygonMumbai,
} from "viem/chains";
import { waitForTransaction } from "@wagmi/core";
import { decodeEventLog, formatEther } from "viem";
import { abi as AirdropABI } from "../../../abi/Airdrop.json";
import { abi as ExpirableERC721ABI } from "../../../abi/ExpirableERC721.json";
import { errorsABI, formatError, fundMyAccountOnLocalFork, signMessage } from "@/utils/misc";
import { mumbaiFork } from "@/utils/wagmi";
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectConfig, // the Sismo Connect config with your appId
  AuthType, // the authType enum, we will choose 'VAULT' in this tutorial
  ClaimType, // the claimType enum, we will choose 'GTE' in this tutorial, to check that the user has a value greater than a given threshold
} from "@sismo-core/sismo-connect-react";
import { transactions } from "../../../broadcast/ExpirableERC721.s.sol/SismoCommunity-mumbai/run-latest.json";

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Container,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from '@chakra-ui/react';

import Image from "next/image";
import logo from "../../assets/logo.png";


/* ***********************  Sismo Connect Config *************************** */

// you can create a new Sismo Connect app at https://factory.sismo.io
// The SismoConnectConfig is a configuration needed to connect to Sismo Connect and requests data from your users.

const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xf16f189921c7684c3d6f5b471d5e1178",
  vault: {
    // For development purposes
    // insert any account that you want to impersonate  here
    // Never use this in production
    impersonate: [
      "0x6d8e3ef015c628Aa91a7fAC6a348bea80BcC0940", 
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f",
      "0xBD730613339499c114d12Eb41dcE3321376b90e5"
    ],
  },
};

/* ********************  Defines the chain to use *************************** */
const CHAIN = mumbaiFork;

export default function Home() {
  /* ***********************  Application states *************************** */
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [amountClaimed, setAmountClaimed] = useState<string>("");
  const [responseBytes, setResponseBytes] = useState<string>("");

  /* ***************  Wagmi hooks for wallet connection ******************** */
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount({
    onConnect: async ({ address }) => address && (await fundMyAccountOnLocalFork(address)),
  });
  const { switchNetworkAsync, switchNetwork } = useSwitchNetwork();

  /* *************  Wagmi hooks for contract interaction ******************* */
  const contractCallInputs =
    responseBytes && chain
      ? {
          address: transactions[0].contractAddress as `0x${string}}`,
          abi: [...ExpirableERC721ABI, ...errorsABI],
          functionName: "mint",
          args: [address, responseBytes],
          chain,
        }
      : {};

  const { config, error: wagmiSimulateError } = usePrepareContractWrite(contractCallInputs);
  const { writeAsync } = useContractWrite(config);

  /* *************  Handle simulateContract call & chain errors ************ */
  useEffect(() => {
    if (chain?.id !== CHAIN.id) return setError(`Please switch to ${CHAIN.name} network`);
    setError("");
  }, [chain]);

  useEffect(() => {
    if (!wagmiSimulateError) return;
    if (!isConnected) return;
    return setError(formatError(wagmiSimulateError));
  }, [wagmiSimulateError, isConnected]);

  /* ************  Handle the airdrop claim button click ******************* */
  async function claimAirdrop() {
    if (!address) return;
    setError("");
    setLoading(true);
    try {
      // Switch to the selected network if not already on it
      if (chain?.id !== CHAIN.id) await switchNetworkAsync?.(CHAIN.id);
      const tx = await writeAsync?.();
      const txReceipt = tx && (await waitForTransaction({ hash: tx.hash }));
      if (txReceipt?.status === "success") {
        // const mintEvent = decodeEventLog({
        //   abi: ExpirableERC721ABI,
        //   data: txReceipt.logs[0]?.data,
        //   topics: txReceipt.logs[0]?.topics,
        // });
        // const args = mintEvent?.args as {
        //   value: string;
        // };
        // const ethAmount = formatEther(BigInt(args.value));
        // setAmountClaimed(ethAmount);
        console.log("success");
      }
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setLoading(false);
    }
  }

  /* *************************  Reset state **************************** */
  function resetApp() {
    disconnect();
    setAmountClaimed("");
    setResponseBytes("");
    setError("");
    const url = new URL(window.location.href);
    url.searchParams.delete("sismoConnectResponseCompressed");
    window.history.replaceState({}, "", url.toString());
  }

  return (
    <>

    <ChakraProvider theme={theme}>

    <Box as="section"  bgGradient='linear(to-r, #363390, #00204C, #093E6F)' color="white" py={{ base: '16', md: '24' }}>
        <Container>
        <Grid minH="100vh" p={3}>
        <Stack align="center">
            <Stack spacing={{ base: '4', md: '6' }}  align="center" textAlign="center">
              <Stack spacing="3">

                <main className={styles.main}>

                <Image src={logo} alt="Sismo Connect" />

                <Heading color="white" py={5}>User Proof Membership</Heading>
                <Text py={2} size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
                We build software that empowers organizations to effectively integrate their data, decisions, and operations.
                </Text>
                <Text py={2} size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
                Software that empowers organizations to effectively integrate their data, decisions, and operations.
                </Text>

                {!isConnected && (
                  <>
                    {/* <p>This is a simple ERC20 gated airdrop example using Sismo Connect.</p> */}
                    {connectors.map((connector) => (
                      <button
                        disabled={!connector.ready || isLoading}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                      >
                        {isLoading && pendingConnector?.id === connector.id
                          ? "Connecting..."
                          : "Connect wallet"}
                      </button>
                    ))}
                  </>
                )}

                {isConnected && !responseBytes && (
                  <>
                    {/* <p>Using Sismo Connect we will protect our airdrop from:</p>
                    <br />
                    <ul>
                      <li>Double-spending: each user has a unique Vault id derived from your app id.</li>
                      <li>Front-running: the airdrop destination address is sent as signature request</li>
                    </ul> */}
                    <br />
                    <p>
                      <b>Chain: {chain?.name}</b>
                      <br />
                      <b>Your airdrop destination address is: {address}</b>
                    </p>

                    <SismoConnectButton
                      // the client config created
                      config={sismoConnectConfig}
                      // the auth request we want to make
                      // here we want the proof of a Sismo Vault ownership from our users
                      auths={[{ authType: AuthType.VAULT }]}
                      claim={{groupId: "0xd630aa769278cacde879c5c0fe5d203c", isSelectableByUser: true, claimType: ClaimType.GTE, value: 1}}
                      // we ask the user to sign a message
                      // it will be used onchain to prevent frontrunning
                      signature={{ message: signMessage(address) }}
                      // onResponseBytes calls a 'setResponse' function with the responseBytes returned by the Sismo Vault
                      onResponseBytes={(responseBytes: string) => {
                        setResponseBytes(responseBytes);
                      }}
                      // Some text to display on the button
                      text={"Claim with Sismo"}
                    />
                  </>
                )}

                {isConnected && responseBytes && !amountClaimed && (
                  <>
                    <p>Chain: {chain?.name}</p>
                    <p>Your airdrop destination address is: {address}</p>
                    <button disabled={loading || Boolean(error)} onClick={() => claimAirdrop()}>
                      {!loading ? "Claim" : "Claiming..."}
                    </button>
                  </>
                )}

                {isConnected && responseBytes && amountClaimed && (
                  <>
                    <p>Congratulations!</p>
                    <p>
                      You have claimed {amountClaimed} tokens on {address}.
                    </p>
                  </>
                )}
                {isConnected && !amountClaimed && error && (
                  <>
                    <p className={styles.error}>{error}</p>
                    {error.slice(0, 16) === "Please switch to" && (
                      <button onClick={() => switchNetwork?.(CHAIN.id)}>Switch chain</button>
                    )}
                  </>
                )}
                
              </main>

              {isConnected && (
                <button className={styles.disconnect} onClick={() => resetApp()}>
                  Reset
                </button>
              )}


              </Stack>
            </Stack>
          </Stack>
        </Grid>
        </Container>
      </Box>

    </ChakraProvider>

    </>
  );
}
