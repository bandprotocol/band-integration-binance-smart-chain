pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import {IBridge} from "./IBridge.sol";

contract MockBridge is IBridge {
    // default is 5000 (50 * 100 (price * multiplier))
    bytes public encodedPrice = hex"0000000000001388";

    function setPriceToBe50() public {
        // price * multiplier
        // 50 * 100
        encodedPrice = hex"0000000000001388";
    }

    function setPriceToBe100() public {
        // price * multiplier
        // 100 * 100
        encodedPrice = hex"0000000000002710";
    }

    function relayAndVerify(bytes calldata _data)
        external
        returns (RequestPacket memory, ResponsePacket memory)
    {
        RequestPacket memory req;
        ResponsePacket memory res;

        // oraclescript for stock price
        req.oracleScriptId = 12;

        // strcut {symbol: "^GSPC", multiplier: 100}
        req.params = hex"000000055e475350430000000000000064";

        res.result = encodedPrice;
        res.resolveTime = uint64(now);

        return (req, res);
    }
}
