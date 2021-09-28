import { useActiveWeb3React } from "hooks"
import { useTokenContract } from "hooks/useContract"

export default function useTokenTransfer(address) {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? address : undefined
  const tokenContract = useTokenContract(tokenAddress)

  return async function tokenTransfer(state) {
    const tx = await tokenContract?.transfer(state.address, state.amount)
    return tx.wait()
  }
}