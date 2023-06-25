"use client";

import { useState } from "react";
import { Chain, formatUnits } from "viem";
import {
  AuthType,
  ClaimRequest,
  ClaimType,
  SismoConnectButton,
  SismoConnectConfig,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { signMessage } from "@/utils/misc";
import { mumbaiFork } from "@/utils/wagmi";
import Header from "@/components/Header";
import Main, { StyledButton } from "@/components/Main";
import Navbar from "@/components/Navbar";
import useEthAccount from "@/utils/useEthAccount";
import getSismoSignature from "@/utils/getSismoSignature";
import { useAccount, useNetwork } from "wagmi";
import useClaimsEligibility from "@/utils/useClaimsEligibility";
import useContractClaim from "@/utils/useContractClaim";
import { transactions } from "../../../broadcast/Airdrop.s.sol/5151111/run-latest.json";

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

import logo from "../assets/logo.png";

/* ***********************  Sismo Connect Config *************************** */
export const sismoConnectConfig: SismoConnectConfig = {
  appId: "0xf4977993e52606cfd67b7a1cde717069",
  vault: {
    // For development purposes insert the identifier that you want to impersonate any account here
    // Never use this in production
    impersonate: [
      "0x072d7e87c13bCe2751B5766A0E2280BAD235974f",
      "0xc2564e41B7F5Cb66d2d99466450CfebcE9e8228f"
    ],
  },
};

/* ***********************  Sismo Connect *************************** */

export const AUTHS = [{ authType: AuthType.VAULT }];
export const CLAIMS: ClaimRequest[] = [
  {
    // Sismo Community Members
    groupId: "0xd630aa769278cacde879c5c0fe5d203c",
    isSelectableByUser: true,
    isOptional: true,
  },
  {
    // Nouns DAO NFT
    groupId: "0xa4ff29395199edcc63221e5b9b5c202d",
    isSelectableByUser: true,
    isOptional: true,

  },
  {
    // Proof-of-Humanity
    groupId: "0x349d8bd135bd903a633464f9b303c902",
    isSelectableByUser: true,
    isOptional: true,

  },
];

/* *******************  Defines the chain and contrat to use **************** */
export const CHAIN: Chain = mumbaiFork;
// or import another chain from "viem/chains"

export const CONTRACT_ADDRESS = transactions[0].contractAddress as `0x${string}`;
//export const CONTRACT_ADDRESS = "0xbb20d2b0721170bd9969a3e78488dcb61afb0871de78f03f7e593997096d1a3f"; // Deployed on Polygon

export default function Home() {
  // component states
  const [userInput, setUserInput] = useState<string>(localStorage.getItem("userInput") || "");
  const [response, setResponse] = useState<SismoConnectResponse | null>(null);
  const [responseBytes, setResponseBytes] = useState<string | null>(null);

  // wagmi hooks
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  // custom hooks for contract read and write
  const claimsEligibility = useClaimsEligibility(CONTRACT_ADDRESS);
  const ethAccount = useEthAccount(response ? getSismoSignature(response) : userInput);
  const contractClaim = useContractClaim(
    responseBytes,
    ethAccount?.address,
    chain,
    CONTRACT_ADDRESS
  );

  // user input field function
  function onUserInput(value: string) {
    localStorage.setItem("userInput", value);
    setUserInput(value);
  }

  return (
    <>
    <ChakraProvider theme={theme}>
      <Box as="section"  bgGradient='linear(to-r, #363390, #00204C, #093E6F)' color="white" py={{ base: '16', md: '24' }}>
        <Container>
        <Grid minH="100vh" p={3}>
        <Stack spacing={{ base: '8', md: '10' }} align="center">
            <Stack spacing={{ base: '4', md: '6' }} textAlign="center">
              <Stack spacing="3">
                <Header />

                <Main
                  ethAccount={ethAccount}
                  contractClaim={contractClaim}
                  claimsEligibilities={claimsEligibility}
                  isResponse={Boolean(response)}
                  userInput={userInput}
                  onUserInput={onUserInput}
                >
                  {/* *************** SISMO CONNECT BUTTON *********************  */}
                  {!Boolean(response) && (
                    <SismoConnectButton
                      config={sismoConnectConfig}
                      auths={AUTHS}
                      claims={CLAIMS}
                      signature={{ message: ethAccount?.address ? signMessage(ethAccount.address) : "" }}
                      onResponseBytes={(responseBytes: string) => setResponseBytes(responseBytes)}
                      onResponse={(response: SismoConnectResponse) => setResponse(response)}
                    />
                  )}

                  {/* ************************ CLAIM BUTTON *********************  */}
                  {Boolean(response) && isConnected && (
                    <StyledButton
                      disabled={
                        contractClaim?.isLoading || contractClaim?.isError || !claimsEligibility?.isEligible
                      }
                      onClick={contractClaim?.claimAirdrop}
                      isLoading={contractClaim?.isLoading}
                    >
                      {contractClaim.isLoading
                        ? "Claiming"
                        : !claimsEligibility?.isEligible
                        ? "Claim"
                        : `Claim ${formatUnits(claimsEligibility?.totalEligibleAmount, 18)} AIR`}
                    </StyledButton>
                  )}
                </Main>

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
