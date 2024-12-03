var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import { MulticallProvider } from "./provider-multicall.js";
/*
import { bin, abi } from "./_contract.js";
(async function() {
    const provider = new ethers.InfuraProvider();

    const contract = new ethers.Contract("dai.tokens.ethers.eth", [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
    ], provider);

    const calls = await Promise.all([
        contract.name.populateTransaction(),
        contract.symbol.populateTransaction(),
    ]);
    console.log("CALLS", calls);

    const iface = new ethers.Interface(abi);
    console.log(iface.deploy);
    const args = calls.map((c) => {
        //(address, bool, bytes)
        return [ c.to, false, c.data ];
    });
    console.log("ARGS", args);
    const data = ethers.concat([
        bin,
        iface.encodeDeploy([ args ])
    ]);
    console.log("DATA", data);

    let result = await provider.call({ data });
//    result = ethers.concat([
//        "0x0000000000000000000000000000000000000000000000000000000000000020",
//        result
//    ]);

    console.log("RESULT", result);
    console.log(iface.getFunction("aggregate3Value"));
    console.log(iface.decodeFunctionResult("aggregate3Value", result));
})();
*/
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const subprovider = new ethers.InfuraProvider();
        //const subprovider = new ethers.ChainstackProvider();
        //const subprovider = new ethers.QuickNodeProvider();
        /*
        subprovider.on("debug", (req) => {
            console.log("SUB");
            console.dir(req, { depth: null });
        });
        */
        const provider = new MulticallProvider(subprovider);
        const contract = new ethers.Contract("dai.tokens.ethers.eth", [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function balanceOf(address) view returns (uint256)",
            "function balanceOf(address) view returns (uint256)",
        ], provider);
        /*
            provider.on("debug", (req) => {
                console.log("MULTI");
                console.dir(req, { depth: null });
            });
        */
        const blockNumber = yield provider.getBlockNumber();
        const ricmooEth = "0x5555763613a12d8f3e73be831dff8598089d3dca";
        const [name, sym, balance, balance_1] = yield Promise.all([
            contract.name({ blockTag: "latest" }),
            contract.symbol({ blockTag: "latest" }),
            contract.balanceOf(ricmooEth, { blockTag: "latest" }),
            contract.balanceOf(ricmooEth, { blockTag: blockNumber - 1 }),
        ]);
        console.log({ name, sym, balance, balance_1 });
    });
})();
//# sourceMappingURL=test.js.map