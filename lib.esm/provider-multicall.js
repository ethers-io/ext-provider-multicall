var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MulticallProvider_callQueue, _MulticallProvider_drainInterval, _MulticallProvider_drainTimer;
import { AbiCoder, AbstractProvider, toQuantity, assertArgument, concat, makeError } from "ethers";
import { bin } from "./_contract.js";
export class MulticallProvider extends AbstractProvider {
    constructor(provider) {
        super();
        _MulticallProvider_callQueue.set(this, void 0);
        _MulticallProvider_drainInterval.set(this, void 0);
        _MulticallProvider_drainTimer.set(this, void 0);
        this.subprovider = provider;
        __classPrivateFieldSet(this, _MulticallProvider_callQueue, [], "f");
        __classPrivateFieldSet(this, _MulticallProvider_drainInterval, 10, "f");
        __classPrivateFieldSet(this, _MulticallProvider_drainTimer, null, "f");
    }
    get drainInterval() { return __classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f"); }
    set drainInterval(value) {
        if (value < 0) {
            value = -1;
        }
        if (value === __classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _MulticallProvider_drainInterval, value, "f");
        if (__classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f") >= 0) {
            // Clear any existing timer
            if (__classPrivateFieldGet(this, _MulticallProvider_drainTimer, "f")) {
                clearTimeout(__classPrivateFieldGet(this, _MulticallProvider_drainTimer, "f"));
                __classPrivateFieldSet(this, _MulticallProvider_drainTimer, null, "f");
            }
            // Start a new one with the updated interval
            if (__classPrivateFieldGet(this, _MulticallProvider_callQueue, "f").length) {
                __classPrivateFieldSet(this, _MulticallProvider_drainTimer, setTimeout(() => {
                    this.drainCallQueue();
                }, __classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f")), "f");
            }
        }
        else if (__classPrivateFieldGet(this, _MulticallProvider_drainTimer, "f")) {
            // Disable any existing timer; switching to manual mode
            clearTimeout(__classPrivateFieldGet(this, _MulticallProvider_drainTimer, "f"));
            __classPrivateFieldSet(this, _MulticallProvider_drainTimer, null, "f");
        }
    }
    ;
    queueCall(to, data, blockTag) {
        if (__classPrivateFieldGet(this, _MulticallProvider_drainTimer, "f") == null && __classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f") >= 0) {
            __classPrivateFieldSet(this, _MulticallProvider_drainTimer, setTimeout(() => {
                this.drainCallQueue();
            }, __classPrivateFieldGet(this, _MulticallProvider_drainInterval, "f")), "f");
        }
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet(this, _MulticallProvider_callQueue, "f").push({ request: { to, data, blockTag }, resolve, reject });
        });
    }
    drainCallQueue() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _MulticallProvider_drainTimer, null, "f");
            const _callQueue = __classPrivateFieldGet(this, _MulticallProvider_callQueue, "f");
            __classPrivateFieldSet(this, _MulticallProvider_callQueue, [], "f");
            const blockTags = _callQueue.reduce((accum, { request }) => {
                const blockTag = request.blockTag;
                if (blockTag != null && accum.indexOf(blockTag) === -1) {
                    accum.push(blockTag);
                }
                return accum;
            }, []);
            const runners = [];
            for (const blockTag of blockTags) {
                const callQueue = _callQueue.filter(({ request }) => request.blockTag === blockTag);
                const data = concat([bin, AbiCoder.defaultAbiCoder().encode([
                        "tuple(address, bytes)[]"
                    ], [
                        callQueue.map(({ request }) => {
                            return [request.to, request.data];
                        })
                    ])]);
                this.emit("debug", {
                    action: "sendMulticall", data,
                    call: callQueue.map(({ request }) => {
                        return { to: request.to, data: request.data };
                    })
                });
                runners.push((() => __awaiter(this, void 0, void 0, function* () {
                    const _data = yield this.subprovider.call({ data, blockTag });
                    const [_blockNumber, results] = AbiCoder.defaultAbiCoder().decode(["uint", "tuple(bool, bytes)[]"], _data);
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
                    const output = [];
                    for (let i = 0; i < callQueue.length; i++) {
                        const result = results[i];
                        const { resolve } = callQueue[i];
                        resolve({ status: result[0], data: result[1] });
                        output.push({ status: result[0], data: result[1] });
                    }
                }))());
            }
            yield Promise.all(runners);
        });
    }
    _detectNetwork() {
        return this.subprovider._detectNetwork();
    }
    _perform(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.method === "call") {
                const tx = req.transaction;
                const to = (tx.to || null), data = (tx.data || "0x");
                assertArgument(typeof (to) === "string", "deployment transactions unsupported", "tx.to", tx.to);
                const result = yield this.queueCall(to, data, req.blockTag);
                if (result.status) {
                    return result.data;
                }
                // Throw a CallException
                throw AbiCoder.getBuiltinCallException("call", { to, data }, result.data);
            }
            return yield this.subprovider._perform(req);
        });
    }
}
_MulticallProvider_callQueue = new WeakMap(), _MulticallProvider_drainInterval = new WeakMap(), _MulticallProvider_drainTimer = new WeakMap();
//# sourceMappingURL=provider-multicall.js.map