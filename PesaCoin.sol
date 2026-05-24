// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PesaCoin is ERC20, Ownable {
    constructor() ERC20("PesaCoin", "PESA") Ownable(msg.sender) {}

    // 1 PesaCoin = 1 KES
    // We use 18 decimals like standard ETH tokens, or 0 if you want simplicity.
    // To match standard ERC20, we'll use 18.
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    // Minting occurs when KES is deposited via M-Pesa
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Burning occurs when user withdraws PesaCoin to M-Pesa
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }
}
