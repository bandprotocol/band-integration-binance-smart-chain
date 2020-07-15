import React, { useEffect, useState } from "react";
import { Flex, Text, Image } from "rebass";
import colors from "../ui/colors";
import loading from "../images/loading.gif";

import Web3 from "web3";

import {
  getSPXBalance,
  getCDP,
  sendLock,
  sendUnlock,
  sendBorrow,
  sendReturnDebt,
  sendTransfer,
} from "../utils/proof";

import { fetchPrice } from "../utils/fetchPrice";

export default ({ pKey }) => {
  const [spx, setSPX] = useState(-1);
  const [cdp, setCPD] = useState([-1, -1]);
  const [spxPrice, setSPXPrice] = useState(null);

  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pKey);
  window.web31 = web3;
  useEffect(() => {
    async function fetchData() {
      const [x1, x2, x3] = await Promise.all([
        getSPXBalance(account.address),
        getCDP(account.address),
        fetchPrice(),
      ]);
      setSPX(x1);
      setCPD(x2);
      setSPXPrice(x3);
    }
    fetchData();
    const itid = setInterval(fetchData, 3000);
    return () => clearInterval(itid);
  }, []);

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
        <Text>Synthetic Stock Balance</Text>
        <Flex />
      </Flex>
      <Flex
        mt="3.0vw"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontSize: "1.0vw", minHeight: "30px" }}
      >
        <Text>Current Macy stock price </Text>
        {spxPrice ? (
          <Text>{spxPrice + " USD"}</Text>
        ) : (
          <Image src={loading} width="50px" />
        )}
      </Flex>
      <Flex
        mt="1.0vw"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontSize: "1.0vw", minHeight: "30px" }}
      >
        <Text>Your Macy token balance </Text>
        {spx < 0 ? (
          <Image src={loading} width="50px" />
        ) : (
          <Text>{spx / 1e18 + " Macy"}</Text>
        )}
      </Flex>
      <Flex mt="2.0vw" justifyContent="center" style={{ fontSize: "2.0vw" }}>
        <button
          onClick={async () => {
            const amount = window.prompt(
              "Amount of Macy tokens to be borrowed",
            );
            await sendBorrow(pKey, amount * 1e18);
          }}
        >
          borrow
        </button>
        <Flex mx="1.5vw" />
        <button
          onClick={async () => {
            const amount = window.prompt(
              "Amount of Macy tokens (debt) you want to return",
            );
            await sendReturnDebt(pKey, amount * 1e18);
          }}
        >
          return debt
        </button>
        <Flex mx="1.5vw" />
        <button
          onClick={async () => {
            const toAddress = window.prompt("Transfer to address");
            if (!toAddress || !toAddress.match(/^0x[0-9A-Fa-f]{40}$/g)) {
              alert("wrong format, address must be 40hex with 0x prefix");
              return;
            }
            const amount = window.prompt(
              "Amount of Macy tokens (debt) you want to return",
            );
            await sendTransfer(pKey, toAddress.slice(2), amount * 1e18);
          }}
        >
          send
        </button>
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontSize: "1.0vw", minHeight: "30px" }}
      >
        <Text>Collateral </Text>
        {cdp[0] < 0 ? (
          <Image src={loading} width="50px" />
        ) : (
          <Text>{cdp[0] / 1e18} BUSD</Text>
        )}
      </Flex>
      <Flex
        mt="2.0vw"
        justifyContent="space-between"
        alignItems="center"
        style={{ fontSize: "1.0vw", minHeight: "30px" }}
      >
        <Text>Debt </Text>
        {cdp[1] < 0 ? (
          <Image src={loading} width="50px" />
        ) : (
          <Text>{cdp[1] / 1e18} Macy</Text>
        )}
      </Flex>
      <Flex mt="2.0vw" justifyContent="center" style={{ fontSize: "2.0vw" }}>
        <button
          onClick={async () => {
            const amount = window.prompt("Amount of BUSD to be locked");
            await sendLock(pKey, amount * 1e18);
          }}
        >
          lock
        </button>
        <Flex mx="3.0vw" />
        <button
          onClick={async () => {
            const amount = window.prompt("Amount of BUSD to be unlocked");
            await sendUnlock(pKey, amount * 1e18);
          }}
        >
          unlock
        </button>
      </Flex>
    </Flex>
  );
};
