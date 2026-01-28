// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AuditRegistry
 * @dev Stores audit report hashes for immutable on-chain verification.
 */
contract AuditRegistry is Ownable {
    // Mapping from contract address to its audit report hash
    mapping(address => bytes32) public auditHashes;

    // Mapping to track all audited contracts
    mapping(address => bool) public hasAudit;

    // Array of all audited contract addresses
    address[] public auditedContracts;

    event AuditRegistered(address indexed contractAddress, bytes32 reportHash, uint256 timestamp);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register an audit report hash for a contract.
     * @param contractAddress The address of the audited contract.
     * @param reportHash The keccak256 hash of the audit report.
     */
    function registerAudit(address contractAddress, bytes32 reportHash) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        require(reportHash != bytes32(0), "Invalid report hash");

        if (!hasAudit[contractAddress]) {
            auditedContracts.push(contractAddress);
            hasAudit[contractAddress] = true;
        }

        auditHashes[contractAddress] = reportHash;

        emit AuditRegistered(contractAddress, reportHash, block.timestamp);
    }

    /**
     * @notice Verify if a report hash matches the stored hash for a contract.
     * @param contractAddress The address of the contract to verify.
     * @param reportHash The hash to verify against.
     * @return True if the hash matches, false otherwise.
     */
    function verifyAudit(address contractAddress, bytes32 reportHash) external view returns (bool) {
        return auditHashes[contractAddress] == reportHash;
    }

    /**
     * @notice Get the audit hash for a contract.
     * @param contractAddress The address of the contract.
     * @return The stored audit report hash.
     */
    function getAuditHash(address contractAddress) external view returns (bytes32) {
        return auditHashes[contractAddress];
    }

    /**
     * @notice Get the total number of audited contracts.
     * @return The count of audited contracts.
     */
    function getAuditedContractsCount() external view returns (uint256) {
        return auditedContracts.length;
    }
}
