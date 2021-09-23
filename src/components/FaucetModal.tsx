import React, { useCallback, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Modal, Text, LinkExternal, Flex, Box, Button, Input } from 'maki-uikit-v2'
import { useTranslation } from 'contexts/Localization'
import axios from 'axios'

interface ClaimModalProps {
  onDismiss?: () => void
}

const ClaimModal: React.FC<ClaimModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const claimAirdrop = useCallback(async () => {
    try {
      const response = await axios.post("https://shielded-tor-40211.herokuapp.com/api/users/faucet", {
        address: account
      })
      console.log(response)
    } catch (e) {
      setError(e.response.data)
    }
    // setMessage(response)
  }, [account])

  return (
    <Modal title={t('MAKI HT CLAIM')} onDismiss={onDismiss}>
      <Flex justifyContent="center">
        <Box maxWidth="320px">
          <Text fontSize="14px">
            {t('Enter an address to trigger a HT claim. If the address has any claimable HT it will be sent to them on submission.')}
          </Text>
          <Text color="red">{error}</Text>
          <Text color="green">{message}</Text>
          <Button width="100%" mt="16px" onClick={claimAirdrop}>Claim HT</Button>
        </Box>
      </Flex>
    </Modal>
  )
}

export default ClaimModal
