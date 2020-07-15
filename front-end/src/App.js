import React, { useState, useEffect } from "react";
import { Flex, Text, Image } from "rebass";
import Web3 from "web3";
import BigNumber from "bignumber.js";

import theme from "./ui/theme";
import colors from "./ui/colors";
import { ThemeProvider } from "styled-components";

import { getAddress, sendApprove10M, getAllowance } from "./utils/proof";

import loading from "./images/loading.gif";

import "./App.css";
import BUSDFrame from "./components/BUSDFrame";
import Liquidate from "./components/Liquidate";
import Debt from "./components/Debt";

const isValidPk = (pk) => pk && pk.match(/^0x[0-9A-Fa-f]{64}$/g) !== null;

const privateKeyForm = (pk, setPK) => {
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      style={{ width: "55vw" }}
    >
      <Text mr="1vw" fontSize="1.0vw">
        Login with your private key
      </Text>
      <input
        type="text"
        value={pk}
        style={{ width: "30vw" }}
        onChange={(e) => {
          setPK(e.target.value);
        }}
      />
    </Flex>
  );
};

const createAccount = (web3, setPK) => {
  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      style={{ width: "55vw" }}
    >
      <Text mr="1vw" fontSize="1.0vw">
        Don't have an account?
      </Text>
      <Flex style={{ width: "30vw" }}>
        <button
          onClick={(e) => {
            let account = web3.eth.accounts.create();
            setPK(account.privateKey);
          }}
        >
          Create one
        </button>
      </Flex>
    </Flex>
  );
};

const getTokens = (address, bnb, busd) => {
  return (
    <>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "55vw" }}
      >
        <Text mr="1vw" fontSize="1.0vw">
          Your address
        </Text>
        <Flex style={{ width: "30vw" }}>{address}</Flex>
      </Flex>
      <br />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "55vw" }}
      >
        <Text mr="1vw" fontSize="1.0vw">
          Get testnet BNB & BUSD
        </Text>
        <a
          target="_blank"
          href="https://testnet.binance.org/faucet-smart"
          style={{ display: "block", width: "30vw" }}
        >
          testnet.binance.org/faucet-smart
        </a>
      </Flex>
      <br />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "55vw" }}
      >
        <Text mr="1vw" fontSize="1.0vw">
          Your BNB balance
        </Text>
        <Text textAlign="left" style={{ width: "30vw" }}>
          {bnb / 1e18}
        </Text>
      </Flex>
      <br />
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "55vw" }}
      >
        <Text mr="1vw" fontSize="1.0vw">
          Your BUSD balance
        </Text>
        <Text textAlign="left" style={{ width: "30vw" }}>
          {busd / 1e18}
        </Text>
      </Flex>
    </>
  );
};

const loginPage = (
  web3,
  pk,
  setPK,
  setIsLoading,
  address,
  setIsLogin,
  bnb,
  busd,
) => {
  const login = async () => {
    setIsLoading(true);
    web3.eth.accounts.wallet.add(pk);
    web3.eth.defaultAccount = address;
    let alllowance = await getAllowance(address);
    if (alllowance > 1000000) {
      console.log(alllowance);
    } else {
      await sendApprove10M(pk);
    }
    setIsLoading(false);
    setIsLogin(true);
  };
  return (
    <>
      {privateKeyForm(pk, setPK)}
      <br />
      {address ? getTokens(address, bnb, busd) : createAccount(web3, setPK)}
      <br />
      {bnb > 0 && busd > 0 ? (
        <button
          onClick={login}
          style={{ padding: "1.0vw", borderRadius: "4px" }}
        >
          <Text fontSize="16px">Login</Text>
        </button>
      ) : (
        <button disabled>
          <Text fontSize="16px">
            Please request BNB from the faucet to proceed
          </Text>
        </button>
      )}
    </>
  );
};

export default () => {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [pk, setPK] = useState("");
  const [address, setAddress] = useState("");
  const [bnb, setBNB] = useState(0);
  const [busd, setBUSD] = useState(0);
  const [bnbInterval, setcBNBInterval] = useState(null);

  useEffect(() => {
    if (isValidPk(pk)) {
      const account = web3.eth.accounts.privateKeyToAccount(pk);
      setAddress(account.address);
    }
  }, [pk]);

  useEffect(() => {
    if (address) {
      setInterval(async () => {
        try {
          const bnbBalance = await web3.eth.getBalance(address);
          const busdBalance = await web3.eth.call({
            to: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
            data: "0x70a08231000000000000000000000000" + address.slice(2),
          });
          setBNB(BigNumber(bnbBalance));
          setBUSD(BigNumber(busdBalance));
        } catch (e) {}
      }, 500);
    }

    return () => [];
  }, [address]);

  return !isLogin ? (
    <Flex
      mt="40.0vh"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      width="70vw"
    >
      {!isLoading ? (
        loginPage(web3, pk, setPK, setIsLoading, address, setIsLogin, bnb, busd)
      ) : (
        <Image src={loading} width="100px" />
      )}
    </Flex>
  ) : (
    <ThemeProvider theme={theme}>
      <Flex
        mt="2.5vw"
        mx="auto"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        width="70vw"
      >
        <Flex flexDirection="row" width="100%">
          <Flex flex={1}>
            <Text
              fontSize="2.5vw"
              fontWeight={900}
              lineHeight="1.53vw"
              color={colors.purple.dark}
            >
              Stock CDP App
            </Text>
          </Flex>
          <Flex flex={1} />
        </Flex>
        <Flex
          mt="5.0vw"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
        >
          <Flex flexDirection="column">
            <BUSDFrame pKey={pk} />
            <Flex mt="5.0vw" />
            <Liquidate pKey={pk} />
            <Flex mt="5.0vw" />
          </Flex>
          <Flex>
            <Debt pKey={pk} />
          </Flex>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
};
