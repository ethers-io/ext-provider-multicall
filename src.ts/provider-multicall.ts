import {
    AbiCoder, AbstractProvider, toQuantity,
    assertArgument, concat, makeError
} from "ethers";

import type {
    PerformActionRequest,
//    PerformActionTransaction,
    BlockTag
} from "ethers";

import { bin } from "./_contract.js";

export type DebugEventMulticallProvider = {
    action: "sendMulticall",
    calls: Array<{ to: string, data: string }>;
    data: string;
} | {
    action: "receiveMulticallResult",
    calls: Array<{ to: string, data: string }>;
    data: string;
    status: boolean;
    result: string;
};

export type CallResult = { status: boolean, data: string };

interface CallHandle {
    request: { to: string, data: string, blockTag?: BlockTag };
    resolve: (result: any) => void;
    reject: (error: any) => void;
}

export class MulticallProvider extends AbstractProvider {
    readonly subprovider: AbstractProvider;

    #callQueue: Array<CallHandle>;
    #drainInterval: number;
    #drainTimer: null | ReturnType<typeof setTimeout>;

    constructor(provider: AbstractProvider) {
        super();
        this.subprovider = provider;

        this.#callQueue = [ ];
        this.#drainInterval = 10;
        this.#drainTimer = null;
    }

    get drainInterval(): number { return this.#drainInterval; }
    set drainInterval(value: number) {
        if (value < 0) { value = -1; }
        if (value === this.#drainInterval) { return; }

        this.#drainInterval = value;

        if (this.#drainInterval >= 0) {
            // Clear any existing timer
            if (this.#drainTimer) {
                clearTimeout(this.#drainTimer);
                this.#drainTimer = null;
            }

            // Start a new one with the updated interval
            if (this.#callQueue.length) {
                this.#drainTimer = setTimeout(() => {
                    this.drainCallQueue()
                }, this.#drainInterval);
            }

        } else if (this.#drainTimer) {
            // Disable any existing timer; switching to manual mode
            clearTimeout(this.#drainTimer);
            this.#drainTimer = null;
        }
    };

    queueCall(to: string, data: string, blockTag?: BlockTag): Promise<CallResult> {
        if (this.#drainTimer == null && this.#drainInterval >= 0) {
            this.#drainTimer = setTimeout(() => {
                this.drainCallQueue();
            }, this.#drainInterval);
        }

        return new Promise((resolve, reject) => {
            this.#callQueue.push({ request: { to, data, blockTag }, resolve, reject });
        });
    }

    async drainCallQueue(): Promise<void> {
        this.#drainTimer = null;

        const _callQueue = this.#callQueue;
        this.#callQueue = [ ];

        const blockTags = _callQueue.reduce((accum, { request }) => {
            const blockTag = request.blockTag;
            if (blockTag != null && accum.indexOf(blockTag) === -1) {
                accum.push(blockTag);
            }
            return accum;
        }, <Array<BlockTag>>[ ]);

        const runners: Array<Promise<void>> = [ ];

        for (const blockTag of blockTags) {
            const callQueue = _callQueue.filter(({ request }) => request.blockTag === blockTag);

            const data = concat([ bin, AbiCoder.defaultAbiCoder().encode([
                "tuple(address, bytes)[]"
            ], [
                callQueue.map(({ request }) => {
                    return [ request.to, request.data ];
                })
            ])]);

            this.emit("debug", {
                action: "sendMulticall", data,
                call: callQueue.map(({ request }) => {
                    return { to: request.to, data: request.data };
                })
            });

            runners.push((async () => {

                const _data = await this.subprovider.call({ data, blockTag });

                const [ _blockNumber, results ] = AbiCoder.defaultAbiCoder().decode([ "uint", "tuple(bool, bytes)[]"], _data);
                const blockNumber = toQuantity(_blockNumber);

                if (blockTag !== "latest" && blockTag !== "pending" && blockNumber !== blockTag) {
                    callQueue.forEach(({ reject }) => {
                        reject(makeError("backend does not support archive access", "UNSUPPORTED_OPERATION", {
                            operation: "call(blockTag)",
                            info: { expectedBlockTag: blockTag, blockNumber }
                        }));
                    });
                }

                this.emit("debug", {
                    action: "receiveMulticallResult", data,
                    call: callQueue.map(({ request }, i) => {
                        return {
                            to: request.to, data: request.data,
                            status: results[i][0], result: results[i][1]
                        };
                    })
                });

                const output: Array<CallResult> = [ ];
                for (let i = 0; i < callQueue.length; i++) {
                    const result = results[i];
                    const { resolve } = callQueue[i];
                    resolve({ status: result[0], data: result[1] });
                    output.push({ status: result[0], data: result[1] });
                }
            })());
        }

        await Promise.all(runners);
    }

    _detectNetwork() {
        return this.subprovider._detectNetwork();
    }

    async _perform<T = any>(req: PerformActionRequest): Promise<T> {
        if (req.method === "call") {
            const tx = req.transaction;
            const to = (tx.to || null), data = (tx.data || "0x");
            assertArgument(typeof(to) === "string", "deployment transactions unsupported", "tx.to", tx.to);

            const result = await this.queueCall(to, data, req.blockTag);
            if (result.status) { return <T>result.data; }

            // Throw a CallException
            throw AbiCoder.getBuiltinCallException("call", { to, data }, result.data);
        }

        return await this.subprovider._perform(req);
    }

}

