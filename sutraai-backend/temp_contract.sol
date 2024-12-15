// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SimpleStorage {

    // Declare a state variable to store the value
    uint256 private storedValue;

    // Function to store a value
    function store(uint256 value) public {
        storedValue = value;
    }

    // Function to retrieve the stored value
    function retrieve() public view returns (uint256) {
        return storedValue;
    }
}
