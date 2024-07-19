// contracts/ChuToken.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ChuToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ChuToken", "CTK") {
        _mint(msg.sender, initialSupply * 10**18);
    }
}
