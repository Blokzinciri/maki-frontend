import { currencyEquals, Trade } from 'maki-sdk'
import React, { useCallback } from 'react'
import { useBridgeState } from 'state/bridge/hooks'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import BridgeModalHeader from './BridgeModalHeader'
import BridgeSummary from '../BridgeSummary'

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
  const { bridgeInfo } = useBridgeState()

  const modalHeader = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeModalHeader />
    }

    return null
  }, [bridgeInfo])

  const modalBottom = useCallback(() => {
    if (bridgeInfo) {
      return <BridgeSummary />
    }

    return null
  }, [bridgeInfo])

  const confirmationContent = useCallback(() => <div>test</div>, [])

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      hash="txHash"
      content={confirmationContent}
      pendingText=""
      attemptingTxn
    />
  )
}

export default ConfirmBridgeModal
