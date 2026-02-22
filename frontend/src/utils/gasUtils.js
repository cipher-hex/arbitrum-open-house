import { ethers } from "ethers";

/**
 * Get gas parameters with proper fee estimation for EIP-1559 transactions
 * Adds a buffer to ensure maxFeePerGas is higher than baseFee
 */
export const getGasParams = async (provider) => {
  try {
    const feeData = await provider.getFeeData();
    
    // Get current block to check baseFee
    const block = await provider.getBlock("latest");
    const baseFee = block.baseFeePerGas || ethers.BigNumber.from(0);
    
    // Calculate maxPriorityFeePerGas (tip to miner)
    // Use 2 gwei as priority fee or use the feeData value
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas 
      ? feeData.maxPriorityFeePerGas 
      : ethers.utils.parseUnits("2", "gwei");
    
    // Calculate maxFeePerGas with buffer
    // maxFeePerGas = baseFee * 2 + maxPriorityFeePerGas (adds 100% buffer)
    const maxFeePerGas = baseFee.mul(2).add(maxPriorityFeePerGas);
    
    // Ensure we have minimum values
    const minMaxFeePerGas = ethers.utils.parseUnits("20", "gwei");
    const finalMaxFeePerGas = maxFeePerGas.gt(minMaxFeePerGas) 
      ? maxFeePerGas 
      : minMaxFeePerGas;
    
    return {
      maxFeePerGas: finalMaxFeePerGas,
      maxPriorityFeePerGas: maxPriorityFeePerGas,
      type: 2, // EIP-1559 transaction type
    };
  } catch (error) {
    console.error("Error getting gas params:", error);
    // Fallback to default values if estimation fails
    return {
      maxFeePerGas: ethers.utils.parseUnits("25", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei"),
      type: 2,
    };
  }
};

/**
 * Send transaction with proper gas parameters
 */
export const sendTransactionWithGas = async (contract, methodName, args, provider) => {
  const gasParams = await getGasParams(provider);
  
  // Estimate gas limit
  let gasLimit;
  try {
    gasLimit = await contract.estimateGas[methodName](...args);
    // Add 20% buffer to gas limit
    gasLimit = gasLimit.mul(120).div(100);
  } catch (error) {
    console.error("Gas estimation failed, using default:", error);
    gasLimit = ethers.BigNumber.from(500000); // Default gas limit
  }
  
  // Send transaction with gas parameters
  const tx = await contract[methodName](...args, {
    ...gasParams,
    gasLimit,
  });
  
  return tx;
};
