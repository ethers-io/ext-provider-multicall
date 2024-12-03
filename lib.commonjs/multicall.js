"use strict";
// @TODO: expose a nice API for the encode/decode directly
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeCall = encodeCall;
exports.decodeResult = decodeResult;
const ethers_1 = require("ethers");
const _contract_js_1 = require("./_contract.js");
function encodeCall(calls) {
    return (0, ethers_1.concat)([_contract_js_1.bin, ethers_1.AbiCoder.defaultAbiCoder().encode([
            "tuple(address to, bytes data)[]"
        ], [calls])]);
}
function decodeResult(data) {
    throw new Error("not implemented");
}
//# sourceMappingURL=multicall.js.map