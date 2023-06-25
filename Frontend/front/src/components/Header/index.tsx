import styled from "styled-components";
import Image from "next/image";
import logo from "../../assets/logo.png";

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from '@chakra-ui/react';

const Container = styled.header`
  display: flex;
  gap: 24px;
  padding-bottom: 40px;
  margin-bottom: 40px;
  border-bottom: 1px solid #3a4161;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 600px;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 24px;
  line-height: 30px;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #828ab4;
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const LinkItem = styled(Link)`
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: #c08aff;
`;

export default function Header() {
  return (
    <Container>
      <Image src={logo} alt="Sismo Connect" width={250} height={98} />
      <Content>
        <Heading color="white">User Proof Membership</Heading>
        <Text size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
        We build software that empowers organizations to effectively integrate their data, decisions, and operations.
        </Text>
        <Text size={{ base: 'md', md: 'lg' }} fontWeight="semibold" color="white">
        Software that empowers organizations to effectively integrate their data, decisions, and operations.
        </Text>
      </Content>
    </Container>
  );
}
