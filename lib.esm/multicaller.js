var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AbiCoder, concat, Result } from "ethers";
import { bin } from "./_contract.js";
export class Multicaller {
    constructor(provider) {
        this.provider = provider;
    }
    _multicall(calls) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = concat([bin, AbiCoder.defaultAbiCoder().encode([
                    "tuple(address target, bytes data)[]"
                ], [calls])]);
            const resultData = yield this.provider.call({ data });
            const [blockNumber, results] = AbiCoder.defaultAbiCoder().decode([
                "uint blockNumber", "tuple(bool status, bytes data)[] results"
            ], resultData);
            if (blockNumber) { } // @TODO: check block number
            return results.map((result) => ({ status: result[0], data: result[1] }));
        });
    }
    multicall(_calls) {
        return __awaiter(this, void 0, void 0, function* () {
            const calls = yield Promise.all(_calls.map((call) => call.resolve()));
            const results = yield this._multicall(calls);
            return Result.fromItems(results.map(({ status, data }, index) => {
                try {
                    return _calls[index].decode(status, data);
                }
                catch (error) {
                    return error;
                }
            }));
        });
    }
}
//# sourceMappingURL=multicaller.js.map