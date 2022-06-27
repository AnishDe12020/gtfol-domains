import { Container, Text } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Container>
      <Text h1>Welcome to PNS (Pog Naming Service)</Text>
      <ConnectButton />
    </Container>
  );
};

export default Home;
