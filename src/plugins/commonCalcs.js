import BigNumber from "bignumber.js";
import Web3 from "web3";

BigNumber.config({ POW_PRECISION: 1000 });

function maxAllo(target_apr_dec, signalledTokens, networkStore, stakedTokens){
  let target_apr = new BigNumber(target_apr_dec).dividedBy(100);

  // signalledTokens / totalTokensSignalled * issuancePerYear / apr - stakedTokens = maxAllocation
  try{
    return new BigNumber(signalledTokens)
        .dividedBy(networkStore.getTotalTokensSignalled)
        .multipliedBy(networkStore.getIssuancePerYear)
        .dividedBy(target_apr)
        .minus(stakedTokens)
        .dividedBy(new BigNumber(10).pow(18));
  }catch(e){
    return new BigNumber(0);
  }
}

function calculateApr(currentSignalledTokens, stakedTokens, networkStore){
  return calculateNewApr(currentSignalledTokens, stakedTokens, networkStore, "0");
}

function calculateNewApr(currentSignalledTokens, stakedTokens, networkStore, newAllocation){
  try{
    // signalledTokens / totalTokensSignalled * issuancePerYear / (stakedTokens + newAllocation)
    return new BigNumber(currentSignalledTokens)
          .dividedBy(networkStore.getTotalTokensSignalled)
          .multipliedBy(networkStore.getIssuancePerYear)
          .dividedBy(
              new BigNumber(stakedTokens).plus(Web3.utils.toWei(newAllocation))
          ).multipliedBy(100);
  }
  catch(e){
    return new BigNumber(0);
  }
}

function calculateAllocationDailyRewards(signalledTokens, stakedTokens, allocatedTokens, networkStore){
  try{
    // signalledTokens / totalTokensSignalled * issuancePerBlock * blocks per day * (allocatedTokens / stakedTokens))
      return new BigNumber(signalledTokens)
          .dividedBy(networkStore.getTotalTokensSignalled)
          .multipliedBy(networkStore.getIssuancePerBlock)
          .multipliedBy(6450)
          .multipliedBy(allocatedTokens)
          .dividedBy(stakedTokens)
          .dp(0);
  }
  catch(e){
    return new BigNumber(0);
  }
}

function calculateSubgraphDailyRewards(currentSignalledTokens, stakedTokens, networkStore, newAllocation){
  try{
    return new BigNumber(currentSignalledTokens)
        .dividedBy(networkStore.getTotalTokensSignalled)
        .multipliedBy(networkStore.getIssuancePerBlock)
        .multipliedBy(6450)
        .multipliedBy(
            new BigNumber(Web3.utils.toWei(newAllocation)).dividedBy(new BigNumber(stakedTokens).plus(Web3.utils.toWei(newAllocation)))
        ).dp(0);
  }
  catch(e){
    return new BigNumber(0);
  }
  
}

function calculateReadableDuration(seconds) {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600*24));
  let h = Math.floor(seconds % (3600*24) / 3600);
  let m = Math.floor(seconds % 3600 / 60);
  return `${d}d ${h}h ${m}m`;
}

function indexerCut(rewards, rewardCut){
  console.log(rewards);
  console.log(rewardCut);
  let afterCut = new BigNumber(rewards).multipliedBy(rewardCut).dividedBy(1000000).dp(0,1);
  console.log(afterCut);
  console.log(afterCut.toString());
  console.log();
  return afterCut;
}

export { maxAllo, calculateApr, calculateNewApr, calculateAllocationDailyRewards, calculateSubgraphDailyRewards, calculateReadableDuration, indexerCut };