import { AbstractProvider } from "ethers";
import type { PerformActionRequest } from "ethers";
export type DebugEventMulticallProvider = {
    action: "sendMulticall";
    calls: Array<{
        to: string;
        data: string;
    }>;
    data: string;
} | {
    action: "receiveMulticallResult";
    calls: Array<{
        to: string;
        data: string;
    }>;
    data: string;
    status: boolean;
    result: string;
};
export type CallResult = {
    status: boolean;
    data: string;
};
export declare class MulticallProvider extends AbstractProvider {
    #private;
    readonly subprovider: AbstractProvider;
    constructor(provider: AbstractProvider);
    get drainInterval(): number;
    set drainInterval(value: number);
    queueCall(to: string, data: string): Promise<CallResult>;
    drainCallQueue(): Promise<Array<CallResult>>;
    _detectNetwork(): Promise<import("ethers").Network>;
    _perform<T = any>(req: PerformActionRequest): Promise<T>;
}
//# sourceMappingURL=provider-multicall.d.ts.map