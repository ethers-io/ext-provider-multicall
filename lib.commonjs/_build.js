"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const ethers_1 = require("ethers");
const abi = JSON.parse(fs_1.default.readFileSync("./misc/output/contracts_multicall3_sol_Multicall3.abi").toString());
const iface = new ethers_1.Interface(abi);
const bin = fs_1.default.readFileSync("./misc/output/contracts_multicall3_sol_Multicall3.bin").toString();
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
fs_1.default.writeFileSync("./src.ts/_contract.ts", output.join("\n"));
//# sourceMappingURL=_build.js.map