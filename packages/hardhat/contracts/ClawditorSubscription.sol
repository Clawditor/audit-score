// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClawditorSubscription
 * @dev Handles tiered subscriptions for the Audit Scan Dashboard.
 */
contract ClawditorSubscription is Ownable {
    enum Tier { Freemium, Premium }

    struct Subscription {
        Tier tier;
        uint256 expiration;
    }

    // Mapping from user address to their subscription details
    mapping(address => Subscription) public subscriptions;

    // Price for premium upgrade in ETH (example)
    uint256 public premiumPrice = 0.05 ether;

    event TierUpgraded(address indexed user, Tier tier, uint256 expiration);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Allows a user to upgrade to premium by paying ETH.
     * @dev Simplistic implementation for Phase 2.
     */
    function upgradeToPremium() external payable {
        require(msg.value >= premiumPrice, "Insufficient payment for Premium");
        
        subscriptions[msg.sender] = Subscription({
            tier: Tier.Premium,
            expiration: block.timestamp + 30 days
        });

        emit TierUpgraded(msg.sender, Tier.Premium, subscriptions[msg.sender].expiration);
    }

    /**
     * @notice Check if a user has an active premium subscription.
     */
    function isPremium(address user) external view returns (bool) {
        return (subscriptions[user].tier == Tier.Premium && subscriptions[user].expiration > block.timestamp);
    }

    /**
     * @notice Set the price for premium subscription.
     */
    function setPremiumPrice(uint256 _price) external onlyOwner {
        premiumPrice = _price;
    }

    /**
     * @notice Withdraw collected fees.
     */
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
}
