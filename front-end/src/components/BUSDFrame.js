import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Flex, Text } from "rebass";
import colors from "../ui/colors";
import { A } from "./A";
import { getAddress, getBUSDBalance } from "../utils/proof";
import BigNumber from "bignumber.js";

export default ({ pKey }) => {
  const [busd, setBUSD] = useState(-1);
  const [address, setAddress] = useState("");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pKey);

  useEffect(() => {
    setAddress(account.address);
  }, []);

  useEffect(() => {
    if (address) {
      setInterval(async () => {
        try {
          const busdBalance = await web3.eth.call({
            to: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
            data: "0x70a08231000000000000000000000000" + address.slice(2),
          });
          setBUSD(BigNumber(busdBalance));
        } catch (e) { }
      }, 500);
    }

    return () => [];
  }, [address]);

  return (
    <Flex
      flexDirection="column"
      style={{
        padding: "1.0vw",
        paddingTop: "2vw",
        borderRadius: "16px",
        backgroundColor: "#212A65",
        width: "32.500vw",
        height: "17.500vw",
      }}
    >
      <Text fontSize="0.972vw" fontWeight="bold" color="white" style={{ display: "flex", justifyContent: "center" }}>Binance USD Balance</Text>
      <Flex
        mt="2.0vw"
        flexDirection="column"
        style={{ fontSize: "0.95vw", marginBottom: "2.672vw" }}
      >
        <Text fontWeight="bold" fontSize="0.833vw" color="white" style={{ marginBottom: "1.33vw" }}>Your Address</Text>
        <Text color="white" fontSize="0.833vw">{address}</Text>
      </Flex>
      <Flex
        height="3.333vw"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontSize: "0.95vw", borderBottom:"1px solid black" }}
      >
        <Flex>
          <Text fontSize="0.833vw" fontWeight="bold" color="white" style={{marginRight:"1vw"}}>Amount</Text>
          <a
            target="_blank"
            href="https://testnet.binance.org/faucet-smart"
            style={{ color: "#889AFF", textDecoration: "none", fontSize: "0.833vw" }}
          >
            faucet
        </a>
        </Flex>
        <Text color="white">{(busd / 1e18 < 0 ? "loading..." : busd / 1e18)} BUSD</Text>
      </Flex>
    </Flex>
  );
};
