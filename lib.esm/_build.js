import fs from "fs";
import { Interface } from "ethers";
const abi = JSON.parse(fs.readFileSync("./misc/output/contracts_multicall3_sol_Multicall3.abi").toString());
const iface = new Interface(abi);
const bin = fs.readFileSync("./misc/output/contracts_multicall3_sol_Multicall3.bin").toString();
const output = [];
output.push(`export const bin = "0x${bin}";`);
output.push(`export const abi = [`);
for (let fragment of iface.format()) {
    if (fragment.match(/constructor/)) {
        fragment = fragment.replace(/ nonpayable/, "");
    }
    output.push(`  ${JSON.stringify(fragment)},`);
}
output.push(`];`);
fs.writeFileSync("./src.ts/_contract.ts", output.join("\n"));
//# sourceMappingURL=_build.js.map