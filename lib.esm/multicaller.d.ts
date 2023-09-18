import { Result } from "ethers";
import type { Provider } from "ethers";
export interface Call {
    target: string;
    data: string;
}
export interface CallResult {
    status: boolean;
    data: string;
}
export interface PreparedCall {
    resolve: () => Promise<Call>;
    decode: (status: boolean, data: string) => Result;
}
export declare class Multicaller {
    readonly provider: Provider;
    constructor(provider: Provider);
    _multicall(calls: Array<Call>): Promise<Array<CallResult>>;
    multicall(_calls: Array<PreparedCall>): Promise<Array<Result>>;
}
//# sourceMappingURL=multicaller.d.ts.map