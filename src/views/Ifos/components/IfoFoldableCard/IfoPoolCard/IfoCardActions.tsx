import React from 'react'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SkeletonCardActions } from './Skeletons'

interface Props {
  isLoading: boolean
}

const IfoCardActions: React.FC<Props> = ({ isLoading }) => {
  if (isLoading) {
    return <SkeletonCardActions />
  }

  return <ConnectWalletButton width="100%" />
}

export default IfoCardActions
