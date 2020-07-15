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
        } catch (e) {}
      }, 500);
    }

    return () => [];
  }, [address]);

  return (
    <Flex
      flexDirection="column"
      style={{
        padding: "1.0vw",
        border: "1px solid #333333",
        minWidth: "32.0vw",
        borderRadius: "4px",
      }}
    >
      <Flex
        backgroundColor={colors.pink.dark}
        justifyContent="space-between"
        style={{ color: "white", margin: "-1.0vw", padding: "1.0vw" }}
      >
        <Text>Binance USD Balance</Text>

        <A
          href="https://testnet.binance.org/faucet-smart"
          style={{ color: "white", textDecoration: "underline" }}
        >
          faucet ↗
        </A>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        style={{ fontSize: "0.95vw" }}
      >
        Address <Text>{address}</Text>
      </Flex>
      <Flex
        mt="1.0vw"
        justifyContent="space-between"
        style={{ fontSize: "0.95vw" }}
      >
        Amount <Text>{busd / 1e18 < 0 ? "loading..." : busd / 1e18} BUSD</Text>
      </Flex>
    </Flex>
  );
};
