import { useActiveWeb3React } from "hooks"
import { useAnyTokenContract } from "hooks/useContract"

export default function useSwapOut(address) {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? address : undefined
  const tokenContract = useAnyTokenContract(tokenAddress)

  return async function swapOut(state) {
    const redeemTx = await tokenContract?.Swapout(state.amount, state.address)
    return redeemTx.wait()
  }
}