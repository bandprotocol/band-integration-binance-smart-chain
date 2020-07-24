import React from "react";
import { Flex, Text } from "rebass";
import colors from "../ui/colors";

import Web3 from "web3";

import { sendLiquidate } from "../utils/proof";

export default ({ pKey }) => {
  return (
    <Flex
      flexDirection="column"
      style={{
        padding: "1.0vw",
        paddingTop: "2vw",
        borderRadius: "16px",
        backgroundColor: "#212A65",
        width: "32.500vw",
        height: "10.069vw",
        justifyContent:"center"
      }}
    >
      <Text fontSize="0.972vw" fontWeight="bold" color="white" style={{ display: "flex", justifyContent: "center" }}>Dangerous Zone</Text>
      <Flex mt="2.0vw" justifyContent="center">
        <button
          style={{ width: "17.292vw", height: "2.222vw", display: "flex", justifyContent: "center", alignItems:"center",backgroundColor: "transparent", border: "0.5px solid white", borderRadius:"10px",color: "white" }}
          onClick={async () => {
            const who = window.prompt("Who(address) to be liquidated");
            if (!who || !who.match(/^[0-9A-Fa-f]{40}$/g)) {
              alert("wrong format, address must be 40hex without 0x prefix");
              return;
            }
            await sendLiquidate(pKey, who);
          }}
        >
          liquidate undercollateralized loan
        </button>
      </Flex>
    </Flex>
  );
};
