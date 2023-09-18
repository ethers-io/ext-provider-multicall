import { AbiCoder, concat, Result } from "ethers";

import { bin } from "./_contract.js";

import type { Provider } from "ethers";


export interface Call {
    target: string;
    data: string;
}

export interface CallResult {
    status: boolean;
    data: string;
}


// DeferredCall?
export interface PreparedCall {
    resolve: () => Promise<Call>;
    decode: (status: boolean, data: string) => Result;
}


export class Multicaller {
    readonly provider: Provider;

    constructor(provider: Provider) {
        this.provider = provider;
    }

    async _multicall(calls: Array<Call>): Promise<Array<CallResult>> {
        const data = concat([ bin, AbiCoder.defaultAbiCoder().encode([
            "tuple(address target, bytes data)[]"
        ], [ calls ])]);

        const resultData = await this.provider.call({ data });

        const [ blockNumber, results ] = AbiCoder.defaultAbiCoder().decode([
            "uint blockNumber", "tuple(bool status, bytes data)[] results"
        ], resultData);

        if (blockNumber) { } // @TODO: check block number

        return results.map((result: any) => ({ status: result[0], data: result[1] }));
    }

    async multicall(_calls: Array<PreparedCall>): Promise<Array<Result>> {
        const calls = await Promise.all(_calls.map((call) => call.resolve()));

        const results = await this._multicall(calls);

        return Result.fromItems(results.map(({ status, data }, index) => {
            try {
                return _calls[index].decode(status, data);
            } catch (error) {
                return error;
            }
        }));
    }
}
