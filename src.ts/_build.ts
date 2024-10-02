/**
 *  This creates an importable version of the multicall bytecode and
 *  ABI for use in otther parts of the library.
 *
 *  Build command:   npm run build-solc
 *  Output:          src.ts/_contract.ts
 */

import fs from "fs";

import { encodeBase64, getBytes, Interface } from "ethers";

const result = JSON.parse(fs.readFileSync("./misc/output/result.json").toString());
const abi = result.contracts["multicall.sol"].Multicall.abi;
const iface = new Interface(abi);
const bin = getBytes("0x" + result.contracts["multicall.sol"].Multicall.evm.bytecode.object);

const output = [ ];
output.push(`/* Do NOT modify this file; it is generated by _build.ts. */`);
output.push(`/* Any changes will be clobbered on the next build.  */`);
output.push(`import { decodeBase64, hexlify } from "ethers";`);
output.push(`export const bin = hexlify(decodeBase64("${ encodeBase64(bin) }"));`);
output.push(`export const abi = [`);
for (let fragment of iface.format()) {
    if (fragment.match(/constructor/)) {
        fragment = fragment.replace(/ nonpayable/, "");
    }
    output.push(`  ${ JSON.stringify(fragment) },`);
}
output.push(`];`);


fs.writeFileSync("./src.ts/_contract.ts", output.join("\n"));
