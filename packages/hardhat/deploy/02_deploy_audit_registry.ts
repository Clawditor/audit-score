import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployAuditRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("AuditRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployAuditRegistry;
deployAuditRegistry.tags = ["AuditRegistry"];
