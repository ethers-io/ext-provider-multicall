// @TODO: expose a nice API for the encode/decode directly

import { AbiCoder, concat } from "ethers";

import { bin } from "./_contract.js";

import type { Result } from "ethers";

export function encodeCall(calls: Array<{ to: string, data: string }>): string {
    return concat([ bin, AbiCoder.defaultAbiCoder().encode([
            "tuple(address to, bytes data)[]"
        ], [ calls ])]);
}

export function decodeResult(data: string): Result {
    throw new Error("not implemented");
}
