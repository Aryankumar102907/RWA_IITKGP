// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BondVault
 * @dev A fractional tokenized government bond platform (RWA) simulation.
 * Users deposit USDC and receive vault shares. 
 * Admins can distribute yield to simulate interest payments.
 */
contract BondVault is ERC4626, Ownable {
    constructor(IERC20 asset) 
        ERC4626(asset) 
        ERC20("Fractional Bond Vault", "fBOND") 
        Ownable(msg.sender) 
    {}

    /**
     * @dev Admin function to distribute yield.
     * Transfers assets from admin to the vault, increasing share price.
     * @param amount The amount of USDC to distribute as yield.
     */
    function distributeYield(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        SafeERC20.safeTransferFrom(IERC20(asset()), msg.sender, address(this), amount);
        // No need to mint shares. The increase in assets held by the vault 
        // automatically increases the asset-to-share ratio.
    }
}
