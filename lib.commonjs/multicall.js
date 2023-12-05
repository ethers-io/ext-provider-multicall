"use strict";
// @TODO: expose a nice API for the encode/decode directly
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeResult = exports.encodeCall = void 0;
const ethers_1 = require("ethers");
const _contract_js_1 = require("./_contract.js");
function encodeCall(calls) {
    return (0, ethers_1.concat)([_contract_js_1.bin, ethers_1.AbiCoder.defaultAbiCoder().encode([
            "tuple(address to, bytes data)[]"
        ], [calls])]);
}
exports.encodeCall = encodeCall;
function decodeResult(data) {
    throw new Error("not implemented");
}
exports.decodeResult = decodeResult;
//# sourceMappingURL=multicall.js.map