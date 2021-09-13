import React from 'react'
import { Modal } from 'maki-uikit-v2'
import SlippageToleranceSetting from './SlippageToleranceSetting'
import TransactionDeadlineSetting from './TransactionDeadlineSetting'

type SettingsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const SettingsModal: React.FC<SettingsModalProps> = ({ onDismiss = defaultOnDismiss }: SettingsModalProps) => {
  return (
    <Modal title="Settings" onDismiss={onDismiss}>
      <SlippageToleranceSetting />
      <SlippageToleranceSetting isFirst={false} />
      <TransactionDeadlineSetting />
    </Modal>
  )
}

export default SettingsModal
