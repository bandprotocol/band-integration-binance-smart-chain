import { post } from "axios";
import {
  balanceOf,
  cdps,
  approve10M,
  allowance,
  lock,
  unlock,
  borrow,
  returnDebt,
  transfer,
  liquidate,
} from "./calldata";
import Web3 from "web3";

const BandChain = require("@bandprotocol/bandchain.js");

const bandchain = new BandChain("http://guanyu-devnet.bandchain.org/rest");

// DEBUG
window.bc = bandchain;

const rpcURL = "https://data-seed-prebsc-1-s1.binance.org:8545"; // 'http://localhost:8010/'

// The requester of devnet
// Note that the requester must have funds in the account to be able to send request tx
const mnemonic =
  "final little loud vicious door hope differ lucky alpha morning clog oval milk repair off course indicate stumble remove nest position journey throw crane";
const oracleScriptID = "12";
const symbol = "M";
const multiplier = 1000000;

const requestAndGetProof = async () => {
  // window.addLogs("start getting proof from bandchain");
  try {
    const oracleScript = await bandchain.getOracleScript(oracleScriptID);
    const requestID = await bandchain.submitRequestTx(
      oracleScript,
      { symbol, multiplier },
      { minCount: 1, askCount: 2 },
      mnemonic,
    );
    const proof = await bandchain.getRequestProof(requestID);
    if (!proof) {
      throw "proof is null";
    }
    // window.addLogs("proof size is " + proof.length / 2 + "bytes");
    return proof.evmProofBytes;
  } catch (e) {
    // Something went wrong
    // window.addLogs("Data request failed \n" + JSON.stringify(e));
  }
  return null;
};

const getAddress = (web3) => {
  return web3.eth.defaultAccount.slice(2);
};

const ethCall = async (to, data) => {
  const {
    data: { result },
  } = await post(rpcURL, {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [{ to, data }, "latest"],
    id: 1,
  });

  return result;
};

const getBUSDBalance = async (kitInst) => {
  try {
    const goldtoken = await kitInst.contracts.getGoldToken();
    const balance = await goldtoken.balanceOf(getAddress(kitInst));
    return balance.toNumber() / 1e18;
  } catch (e) {
    console.log(e);
    return -1;
  }
};

const sendApprove10M = async (pk) => {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  let signedTransaction = await web3.eth.accounts.signTransaction(
    {
      from: "0x" + account.address.slice(2),
      to: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
      data: approve10M(),
      gas: "8000000",
    },
    pk,
  );

  let response = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction,
  );

  return response.transactionHash;
};

const getAllowance = async (address) => {
  try {
    const x = Number(
      await ethCall(
        "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
        allowance(address.slice(2)),
      ),
    );
    return x;
  } catch (e) {
    return -1;
  }
};

const getSPXBalance = async (address) => {
  try {
    const spx = Number(
      await ethCall(
        "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        balanceOf(address.slice(2)),
      ),
    );
    return spx;
  } catch (e) {
    return -1;
  }
};

const getCDP = async (address) => {
  let cdp = (
    await ethCall(
      "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
      cdps(address.slice(2)),
    )
  ).toString();
  if (cdp.length === 130) {
    cdp = cdp.slice(2);
    return [Number("0x" + cdp.slice(0, 64)), Number("0x" + cdp.slice(64))];
  }
  return [0, 0];
};

const sendLock = async (pk, amount) => {
  // window.addLogs("start sending lock tx");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  try {
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: "0x" + account.address.slice(2),
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: lock(amount),
        gas: "8000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND LOCK TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND LOCK ERROR", e);
    // window.addLogs("fail to lock :" + JSON.stringify(e.message));
  }
};

const sendUnlock = async (pk, amount) => {
  // window.addLogs("start sending unlock tx");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  try {
    const proof = await requestAndGetProof();
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: "0x" + account.address.slice(2),
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: unlock(amount, proof),
        gas: "3000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND UNLOCK TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND UNLOCK ERROR", e);
    // window.addLogs("fail to unlock :" + JSON.stringify(e.message));
  }
};

const sendBorrow = async (pk, amount) => {
  // window.addLogs("start sending borrow tx");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  try {
    const proof = await requestAndGetProof();
    console.log(proof);
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: "0x" + account.address.slice(2),
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: borrow(amount, proof),
        gas: "8000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND BORROW TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND BORROW ERROR", e);
    // window.addLogs("fail to borrow :" + JSON.stringify(e.message));
  }
};

const sendReturnDebt = async (pk, amount) => {
  // window.addLogs("start sending returnDebt tx");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  try {
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: "0x" + account.address.slice(2),
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: returnDebt(amount),
        gas: "8000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND RETURN DEBT TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND RETURN DEBT ERROR", e);
    // window.addLogs("fail to return debt :" + JSON.stringify(e.message));
  }
};

const sendTransfer = async (pk, toAddress, amount) => {
  // window.addLogs("start sending transfer tx");
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  try {
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: "0x" + account.address.slice(2),
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: transfer(toAddress, amount),
        gas: "8000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND TRANSFER TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND TRANSFER ERROR", e);

    // window.addLogs("fail to transfer :" + JSON.stringify(e.message));
  }
};

const sendLiquidate = async (pk, who) => {
  const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
  const account = web3.eth.accounts.privateKeyToAccount(pk);
  // window.addLogs("start sending liquidate tx");
  try {
    const proof = await requestAndGetProof();
    let signedTransaction = await web3.eth.accounts.signTransaction(
      {
        from: account.address,
        to: "0xf95c90b89C1CE86FdeaeE506bE25f39e1D7553Fb",
        data: liquidate(who, proof),
        gas: "8000000",
      },
      pk,
    );

    let response = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );

    console.log("SEND LIQUIDATE TXHASH", response.transactionHash);

    return response.transactionHash;
    // window.addLogs("tx hash is " + receipt["transactionHash"].trim());
  } catch (e) {
    console.log("SEND LIQUIDATE ERROR", e);

    // window.addLogs("fail to liquidate :" + JSON.stringify(e.message));
  }
};

export {
  sendApprove10M,
  requestAndGetProof,
  getAllowance,
  getBUSDBalance,
  getSPXBalance,
  getAddress,
  getCDP,
  sendLock,
  sendUnlock,
  sendBorrow,
  sendReturnDebt,
  sendTransfer,
  sendLiquidate,
};
