// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClawditorSubscription
 * @dev Manages tiered subscriptions for the Clawditor Audit Dashboard using $clawditor token.
 */
contract ClawditorSubscription is Ownable {
    IERC20 public clawditorToken;

    enum Tier { None, Basic, Premium, Enterprise }

    struct Subscription {
        Tier tier;
        uint256 expiration;
    }

    mapping(address => Subscription) public subscriptions;
    mapping(Tier => uint256) public tierPrices; // Monthly price in tokens

    event Subscribed(address indexed user, Tier tier, uint256 expiration);

    constructor(address _token) Ownable(msg.sender) {
        clawditorToken = IERC20(_token);
        
        // Initial pricing (example)
        tierPrices[Tier.Basic] = 100 * 10**18;
        tierPrices[Tier.Premium] = 500 * 10**18;
        tierPrices[Tier.Enterprise] = 2000 * 10**18;
    }

    function subscribe(Tier _tier, uint256 _months) external {
        require(_tier != Tier.None, "Invalid tier");
        require(_months > 0, "Duration must be at least 1 month");

        uint256 cost = tierPrices[_tier] * _months;
        require(clawditorToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");

        uint256 currentExpiration = subscriptions[msg.sender].expiration;
        uint256 startTime = block.timestamp > currentExpiration ? block.timestamp : currentExpiration;
        uint256 duration = _months * 30 days;

        subscriptions[msg.sender] = Subscription({
            tier: _tier,
            expiration: startTime + duration
        });

        emit Subscribed(msg.sender, _tier, startTime + duration);
    }

    function getTier(address _user) external view returns (Tier) {
        if (subscriptions[_user].expiration < block.timestamp) {
            return Tier.None;
        }
        return subscriptions[_user].tier;
    }

    function setTierPrice(Tier _tier, uint256 _price) external onlyOwner {
        tierPrices[_tier] = _price;
    }

    function withdrawTokens(address _token) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).transfer(owner(), balance);
    }
}
