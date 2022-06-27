import { Button, Container, Input, Text } from "@nextui-org/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useAccount } from "wagmi";

import contractAbi from "../../artifacts/contracts/Domains.sol/Domains.json";

interface FormData {
  domain: string;
  username: string;
  email: string;
  website: string;
  twitter: string;
  github: string;
}

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

const Home: NextPage = () => {
  const account = useAccount();
  console.log(account);

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit(async values => {
    await mintDomain(values.domain, {
      username: values.username || "",
      email: values.email || "",
      website: values.website || "",
      twitter: values.twitter || "",
      github: values.github || "",
    });
  });

  const mintDomain = async (
    domain: string,
    recordData: Omit<FormData, "domain">
  ) => {
    // Don't run if the domain is empty
    if (!domain) {
      return;
    }
    // Alert the user if the domain is too short
    if (domain.length < 3) {
      alert("Domain must be at least 3 characters long");
      return;
    }
    // Calculate price based on length of domain (change this to match your contract)
    // 3 chars = 0.5 MATIC, 4 chars = 0.3 MATIC, 5 or more = 0.1 MATIC
    const price =
      domain.length === 3 ? "0.5" : domain.length === 4 ? "0.3" : "0.1";
    console.log("Minting domain", domain, "with price", price);
    try {
      const { ethereum } = window;
      if (ethereum) {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let tx = await contract.register(domain, {
          value: ethers.utils.parseEther(price),
        });
        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          console.log(
            "Domain minted! https://mumbai.polygonscan.com/tx/" + tx.hash
          );

          // Set the record for the domain
          tx = await contract.setRecord(domain, recordData);
          await tx.wait();

          console.log(
            "Record set! https://mumbai.polygonscan.com/tx/" + tx.hash
          );
        } else {
          alert("Transaction failed! Please try again");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Text h1>Welcome to PNS (Pog Naming Service)</Text>
      <ConnectButton />
      {account && (
        <form onSubmit={onSubmit}>
          <Container
            css={{
              display: "flex",
              justifyContent: "left",
              marginTop: "2rem",
            }}
          >
            <Input
              type="text"
              placeholder="Domain name"
              {...register("domain")}
            />
            <Text
              css={{
                marginLeft: "0.5rem",
                marginTop: "0.5rem",
              }}
            >
              .pog
            </Text>
          </Container>
          <Container
            css={{
              display: "flex",
              justifyContent: "left",
              alignItems: "start",
              marginTop: "2rem",
              flexDirection: "column",
            }}
          >
            <Text
              css={{
                alignSelf: "start",
                margin: "0rem",
              }}
            >
              Optional Records
            </Text>
            <Input
              type="text"
              placeholder="Username"
              css={{ marginTop: "1rem", marginBottom: "1rem" }}
              {...register("username")}
            />
            <Input
              type="email"
              placeholder="Email"
              css={{ marginTop: "1rem", marginBottom: "1rem" }}
              {...register("email")}
            />
            <Input
              type="text"
              placeholder="Website"
              css={{ marginTop: "1rem", marginBottom: "1rem" }}
              {...register("website")}
            />
            <Input
              type="text"
              placeholder="Twitter Username"
              css={{ marginTop: "1rem", marginBottom: "1rem" }}
              {...register("twitter")}
            />
            <Input
              type="text"
              placeholder="GitHub Username"
              css={{ marginTop: "1rem", marginBottom: "1rem" }}
              {...register("github")}
            />

            <Button css={{ marginTop: "2rem" }} type="submit">
              Mint Domain
            </Button>
          </Container>
        </form>
      )}
    </Container>
  );
};

export default Home;
