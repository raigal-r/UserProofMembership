import React from 'react';
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

import { SismoConnectButton, AuthType, SismoConnectResponse } from "@sismo-core/sismo-connect-react";
import { config } from "../config/sismo-connect-config";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box as="section"  bgGradient='linear(to-r, #363390, #00204C, #093E6F)' color="fg.accent.default" py={{ base: '16', md: '24' }}>
        <Container>
        <Grid minH="100vh" p={3}>
        <Stack spacing={{ base: '8', md: '10' }} align="center">
            <Stack spacing={{ base: '4', md: '6' }} textAlign="center">
              <Stack spacing="3">
                <Heading size={{ base: 'xl', md: 'xl' }} fontWeight="bold" color="white">
                User Proof Membership
                </Heading>
                {/* <Logo /> */}
                <img src="../assets/logo.png" alt="Image" />

                <SismoConnectButton
                    config={config}
                    // request proof of Github ownership
                    auths={[{ authType: AuthType.GITHUB }]}
                    onResponseBytes={(response: string) => {
                        // call your contract with the response as bytes
                    }}
                />

                <Text size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
                  We build software that empowers organizations to effectively integrate their data, decisions, and operations.
                </Text>
                <Text size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
                  Software that empowers organizations to effectively integrate their data, decisions, and operations.
                </Text>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
