import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021"; // Base Mainnet EAS
const SCHEMA_UID = "0x..."; // Auditor score schema

export async function attestScore(
  recipient: string,
  safetyScore: number,
  reportHash: string,
  signer: ethers.Signer
) {
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  eas.connect(signer);

  const schemaEncoder = new SchemaEncoder("uint8 safetyScore, bytes32 reportHash");
  const encodedData = schemaEncoder.encodeData([
    { name: "safetyScore", value: safetyScore, type: "uint8" },
    { name: "reportHash", value: reportHash, type: "bytes32" },
  ]);

  const tx = await eas.attest({
    schema: SCHEMA_UID,
    data: {
      recipient,
      expirationTime: 0n,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();
  return newAttestationUID;
}
