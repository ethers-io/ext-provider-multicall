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

(async function() {
    const subprovider = new ethers.InfuraProvider();
    subprovider.on("debug", (req) => {
        console.log("SUB");
        console.dir(req, { depth: null });
    });

    const provider = new MulticallProvider(subprovider);
    const contract = new ethers.Contract("dai.tokens.ethers.eth", [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
    ], provider);

    provider.on("debug", (req) => {
        console.log("MULTI");
        console.dir(req, { depth: null });
    });

    const [ name, sym ] = await Promise.all([
        contract.name(),
        contract.symbol()
    ]);

    console.log(name, sym);
})();
