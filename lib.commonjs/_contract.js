"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abi = exports.bin = void 0;
exports.bin = "0x60806040526040516200086938038062000869833981810160405281019062000029919062000600565b5f815190505f8167ffffffffffffffff8111156200004c576200004b6200027a565b5b6040519080825280602002602001820160405280156200008957816020015b6200007562000203565b8152602001906001900390816200006b5790505b509050620000966200021e565b5f5b83811015620001d5575f838281518110620000b857620000b76200064f565b5b60200260200101519050858281518110620000d857620000d76200064f565b5b60200260200101519250825f015173ffffffffffffffffffffffffffffffffffffffff168360400151604051620001109190620006c6565b5f604051808303815f865af19150503d805f81146200014b576040519150601f19603f3d011682016040523d82523d5f602084013e62000150565b606091505b50825f0183602001829052821515151581525050508051602084013517620001c8577f08c379a0000000000000000000000000000000000000000000000000000000005f52602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260645ffd5b8160010191505062000098565b505f82604051602001620001ea919062000846565b6040516020818303038152906040529050805160208201f35b60405180604001604052805f15158152602001606081525090565b60405180606001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f15158152602001606081525090565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b620002b2826200026a565b810181811067ffffffffffffffff82111715620002d457620002d36200027a565b5b80604052505050565b5f620002e862000255565b9050620002f68282620002a7565b919050565b5f67ffffffffffffffff8211156200031857620003176200027a565b5b602082029050602081019050919050565b5f80fd5b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f620003608262000335565b9050919050565b620003728162000354565b81146200037d575f80fd5b50565b5f81519050620003908162000367565b92915050565b5f8115159050919050565b620003ac8162000396565b8114620003b7575f80fd5b50565b5f81519050620003ca81620003a1565b92915050565b5f80fd5b5f67ffffffffffffffff821115620003f157620003f06200027a565b5b620003fc826200026a565b9050602081019050919050565b5f5b83811015620004285780820151818401526020810190506200040b565b5f8484015250505050565b5f620004496200044384620003d4565b620002dd565b905082815260208101848484011115620004685762000467620003d0565b5b6200047584828562000409565b509392505050565b5f82601f83011262000494576200049362000266565b5b8151620004a684826020860162000433565b91505092915050565b5f60608284031215620004c757620004c66200032d565b5b620004d36060620002dd565b90505f620004e48482850162000380565b5f830152506020620004f984828501620003ba565b602083015250604082015167ffffffffffffffff81111562000520576200051f62000331565b5b6200052e848285016200047d565b60408301525092915050565b5f620005506200054a84620002fb565b620002dd565b9050808382526020820190506020840283018581111562000576576200057562000329565b5b835b81811015620005c457805167ffffffffffffffff8111156200059f576200059e62000266565b5b808601620005ae8982620004af565b8552602085019450505060208101905062000578565b5050509392505050565b5f82601f830112620005e557620005e462000266565b5b8151620005f78482602086016200053a565b91505092915050565b5f602082840312156200061857620006176200025e565b5b5f82015167ffffffffffffffff81111562000638576200063762000262565b5b6200064684828501620005ce565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f81519050919050565b5f81905092915050565b5f6200069c826200067c565b620006a8818562000686565b9350620006ba81856020860162000409565b80840191505092915050565b5f620006d3828462000690565b915081905092915050565b5f81519050919050565b5f82825260208201905092915050565b5f819050602082019050919050565b620007128162000396565b82525050565b5f82825260208201905092915050565b5f62000734826200067c565b62000740818562000718565b93506200075281856020860162000409565b6200075d816200026a565b840191505092915050565b5f604083015f8301516200077f5f86018262000707565b506020830151848203602086015262000799828262000728565b9150508091505092915050565b5f620007b3838362000768565b905092915050565b5f602082019050919050565b5f620007d382620006de565b620007df8185620006e8565b935083602082028501620007f385620006f8565b805f5b85811015620008345784840389528151620008128582620007a6565b94506200081f83620007bb565b925060208a01995050600181019050620007f6565b50829750879550505050505092915050565b5f6020820190508181035f830152620008608184620007c7565b90509291505056fe";
exports.abi = [
    "constructor(tuple(address target, bool allowFailure, bytes callData)[] calls)",
    "function aggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes[] returnData)",
    "function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)",
    "function aggregate3Value(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)",
    "function blockAndAggregate(tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)",
    "function getBasefee() view returns (uint256 basefee)",
    "function getBlockHash(uint256 blockNumber) view returns (bytes32 blockHash)",
    "function getBlockNumber() view returns (uint256 blockNumber)",
    "function getChainId() view returns (uint256 chainid)",
    "function getCurrentBlockCoinbase() view returns (address coinbase)",
    "function getCurrentBlockDifficulty() view returns (uint256 difficulty)",
    "function getCurrentBlockGasLimit() view returns (uint256 gaslimit)",
    "function getCurrentBlockTimestamp() view returns (uint256 timestamp)",
    "function getEthBalance(address addr) view returns (uint256 balance)",
    "function getLastBlockHash() view returns (bytes32 blockHash)",
    "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (tuple(bool success, bytes returnData)[] returnData)",
    "function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) payable returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)",
];
//# sourceMappingURL=_contract.js.map