// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Coin is ERC20, Ownable {
    constructor() ERC20("Coin", "COIN") {
        // Mint 10,000 COIN to the deployer
        _mint(msg.sender, 10000 * 10**18);
    }

    /**
     * @dev Allows the owner to mint new tokens.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Allows a user with a zero balance to get 100 free COINs.
     */
    function getTokens() external {
        require(balanceOf(msg.sender) == 0, "You already have COINs.");
        // Mint 100 COINs to the user
        _mint(msg.sender, 100 * 10**18);
    }
}