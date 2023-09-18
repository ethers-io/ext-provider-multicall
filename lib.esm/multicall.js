// @TODO: expose a nice API for the encode/decode directly
import { AbiCoder, concat } from "ethers";
import { bin } from "./_contract.js";
export function encodeCall(calls) {
    return concat([bin, AbiCoder.defaultAbiCoder().encode([
            "tuple(address to, bytes data)[]"
        ], [calls])]);
}
//# sourceMappingURL=multicall.js.map