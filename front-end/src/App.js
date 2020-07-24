import React, { useState, useEffect } from "react";
import { Flex, Text, Image } from "rebass";
import Web3 from "web3";
import BigNumber from "bignumber.js";

import theme from "./ui/theme";
import colors from "./ui/colors";
import { ThemeProvider } from "styled-components";

import { getAddress, sendApprove10M, getAllowance } from "./utils/proof";

import loading from "./images/loading.gif";
import footer from "./images/footer.png"

import "./App.css";
import BUSDFrame from "./components/BUSDFrame";
import Liquidate from "./components/Liquidate";
import Debt from "./components/Debt";

const isValidPk = (pk) => pk && pk.match(/^0x[0-9A-Fa-f]{64}$/g) !== null;

const privateKeyForm = (pk, setPK) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
    >
      <Text mr="1vw" fontSize="0.833vw" color="white" fontWeight="bold">
        Login with your private key
      </Text>
      <input
        type="text"
        value={pk}
        placeholder="Enter private key"
        style={{ height: "3.333vw", width: "32.500vw", fontSize: "0.833vw", color: "white", backgroundColor: "transparent", border: "none", borderBottom: "1px solid white", marginBottom: "1.667vw" }}
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
      flexDirection="column"
      alignItems="center"
      style={{ width: "55vw" }}
    >
      <Text color="white" display="flex" justifyContent="center" fontSize="0.833vw" marginBottom="0.5vw">Don't have an account?</Text>

      <button
        style={{
          width: "11.944vw", height: "2.778vw", backgroundColor: "#5269FF", color: "white", border: "none", borderRadius: "4px", fontSize: "0.833vw",
        }}
        onClick={(e) => {
          let account = web3.eth.accounts.create();
          setPK(account.privateKey);
        }}
      >
        Create Account
        </button>
    </Flex>
  );
};

const getTokens = (address, bnb, busd) => {
  return (
    <>
      <Flex
        flexDirection="column"
        justifyContent="space-between"
        style={{ width: "100%" ,paddingLeft:"3.333vw", paddingBottom:"3.33vw" }}
      >
        <Text mr="1vw" fontSize="0.833vw" fontWeight="bold" color="white" style={{marginBottom:"1.458vw"}}>
          Your address
        </Text>
        <Text color="white" fontSize="0.833vw" >{address}</Text>
      </Flex>

      <Flex
        flexDirection="column"
        justifyContent="space-between"
        style={{ width: "100%" ,paddingLeft:"3.333vw", paddingBottom:"2.33vw" }}
      >
        <Text mr="1vw" fontSize="0.833vw" fontWeight="bold" color="white" style={{marginBottom:"1.458vw"}}>
          Get testnet BNB & BUSD
        </Text>
        <a
          target="_blank"
          href="https://testnet.binance.org/faucet-smart"
          style={{ display: "block", width: "30vw", color:"#889AFF", textDecoration:"none", fontSize:"0.833vw" }}
        >
          testnet.binance.org/faucet-smart
        </a>
      </Flex>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "100%" ,paddingLeft:"3.333vw", paddingBottom:"2vw" }}
      >
        <Text fontSize="0.833vw" color="white" fontWeight="bold">
          Your BNB balance
        </Text>
        <Text textAlign="right" color="white" style={{ marginRight: "3.33vw" }}>
          {bnb / 1e18}
        </Text>
      </Flex>
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        style={{ width: "100%" ,paddingLeft:"3.333vw", paddingBottom:"0.8vw" }}
      >
        <Text fontSize="0.833vw" color="white" fontWeight="bold">
          Your BUSD balance
        </Text>
        <Text textAlign="right" color="white" style={{ marginRight: "3.33vw" }}>
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: address ? "38.264vw" : "23.153vw", width: "39.167vw", backgroundColor: "#212A65", borderRadius: "10px", marginTop: "-5vw" }}>
      <p style={{ paddingTop: "32px", paddingBottom: "32px", color: "white", fontWeight: "bold", fontSize: "0.972vw" }}>LOG IN</p>
      {privateKeyForm(pk, setPK)}
      <br />
      {address ? getTokens(address, bnb, busd) : createAccount(web3, setPK)}
      <br />
      <br />
      {bnb > 0 && busd > 0 ? (
        <button
          onClick={login}
        style={{
          width: "8.264vw", height: "2.778vw", backgroundColor: "#5269FF", color: "white", border: "none", borderRadius: "4px", fontSize: "0.833vw",
        }}>
          <Text fontSize="16px">Login</Text>
        </button>
      ) : (
          <Text color="white" fontSize="0.833vw">Please request BNB and BUSD from faucet to proceed</Text>
        )}
    </div>
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
        } catch (e) { }
      }, 500);
    }

    return () => [];
  }, [address]);

  return <div style={{ display: "flex", justifyContent: "center", backgroundColor: "#040D45" }}>{!isLogin ? (
    <Flex
      height="100vh"
      width="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {!isLoading ? (
        loginPage(web3, pk, setPK, setIsLoading, address, setIsLogin, bnb, busd)
      ) : (
          <Image src={loading} width="100px" />
        )}
    </Flex>
  ) : (
        <Flex
                height="100vh"
        display="flex"
        minWidth="68vw"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Flex
            mt="5.0vw"
            flexDirection="row"
            width="100%"
          justifyContent="space-between"
          marginTop="-5vw"
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
    )
  }
    )
    <Image src={footer} style={{ position: "fixed", bottom: "5%", left: "50%", marginLeft: "-8vw", width: "17.917vw" }} />
  </div>
};
