import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stake, sousStake } from 'utils/callHelpers'
import { useMasterchef, useSousChef } from './useContract'

const useStake = (pid: number) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      console.info(txHash)
    },
    [account, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId) => { // removed: isUsingHt = false
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      // } else if (isUsingHt) {
      //   await sousStakeHt(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, masterChefContract, sousChefContract, sousId], // removed: isUsingHt
  )

  return { onStake: handleStake }
}

export default useStake
