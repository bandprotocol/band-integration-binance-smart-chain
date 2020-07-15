pragma solidity 0.5.17;
pragma experimental ABIEncoderV2;

import {Obi} from "./Obi.sol";

library ParamsDecoder {
    using Obi for Obi.Data;

    struct Params {
        string symbol;
        uint64 multiplier;
    }

    function decodeParams(bytes memory _data)
        internal
        pure
        returns (Params memory result)
    {
        Obi.Data memory data = Obi.from(_data);
        result.symbol = string(data.decodeBytes());
        result.multiplier = data.decodeU64();
    }
}

library ResultDecoder {
    using Obi for Obi.Data;

    struct Result {
        uint64 px;
    }

    function decodeResult(bytes memory _data)
        internal
        pure
        returns (Result memory result)
    {
        Obi.Data memory data = Obi.from(_data);
        result.px = data.decodeU64();
    }
}
