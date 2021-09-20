import { currencyEquals, Trade } from 'maki-sdk'
import React, { useCallback } from 'react'
import { useBridgeActionHandlers, useBridgeState } from 'state/bridge/hooks'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { useActiveWeb3React } from 'hooks'

import BridgeModalHeader from './BridgeModalHeader'
import BridgeSummary from '../BridgeSummary'
import BridgeModalFooter from './BridgeModalFooter'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

interface ConfirmBridgeModalProps {
  isOpen: boolean
  onDismiss: () => void
}

const ConfirmBridgeModal: React.FunctionComponent<ConfirmBridgeModalProps> = ({ isOpen, onDismiss }) => {
  const { bridgeInfo, swap, inToken, outToken } = useBridgeState()
  const { onSwap } = useBridgeActionHandlers()
  const { chainId } = useActiveWeb3React()

  const modalHeader = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeModalHeader />
    }

    return null
  }, [bridgeInfo])

  const modalBottom = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeModalFooter onConfirm={() => onSwap(chainId)} disableConfirm={swap.isSwapping} />
    }

    return null
  }, [bridgeInfo, chainId, swap, onSwap])

  const confirmationContent = useCallback(
    () => (
      <ConfirmationModalContent
        title="Confirm Bridge"
        onDismiss={onDismiss}
        topContent={modalHeader}
        bottomContent={modalBottom}
      />
    ),
    [onDismiss, modalHeader, modalBottom],
  )

  const pendingText = `Swapping ${inToken?.symbol}
   for ${outToken?.symbol}`

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      hash={swap.txhash}
      content={confirmationContent}
      pendingText={pendingText}
      attemptingTxn={swap.isSwapping}
    />
  )
}

export default ConfirmBridgeModal
