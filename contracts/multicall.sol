// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

function getBytes(address addr, bytes memory data) view returns (bool status, bytes memory result) {
    assembly {
        // Allocate a new slot for the output
        result := mload(0x40)

        // Initialize the output as length 0 (in case things go wrong)
        mstore(result, 0)
        mstore(0x40, add(result, 32))

        // Call the target address with the data, limiting gas usage
        status := staticcall(gas(), addr, add(data, 32), mload(data), 0, 0)

        // Allocate enough space to store the ceil_32(len_32(result) + result)
        mstore(0x40, add(result, and(add(add(returndatasize(), 0x20), 0x1f), not(0x1f))))

        // Place the length of the result value into the output
        mstore(result, returndatasize())

        // Copy the result value into the output
        returndatacopy(add(result, 32), 0, returndatasize())
    }
}

contract Multicall {

    struct Call {
        address target;
        bytes data;
    }

    struct Result {
        bool status;
        bytes data;
    }

    constructor(Call[] memory calls) {
        Result[] memory result = new Result[](calls.length);

        // Make each call
        for (uint256 i = 0; i < calls.length; i++) {
            (result[i].status, result[i].data) = getBytes(calls[i].target, calls[i].data);
        }

        // Override the initcode with our result
        bytes memory output = abi.encode(block.number, result);
        assembly {
            return(add(output, 0x20), mload(output))
        }
    }
}
