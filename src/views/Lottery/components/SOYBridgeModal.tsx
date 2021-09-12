import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useWeb3 from 'hooks/useWeb3'
import { Modal, Text, Flex, Box, Button, Input } from 'maki-uikit-v2'
import { useTranslation } from 'contexts/Localization'

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`
const InputWrapper = styled.div`
  position: relative;
  margin-top: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`
interface SOYBridgeModalProps {
  onDismiss?: () => void
}

const SOYBridgeModal: React.FC<SOYBridgeModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const [bridgeAmount, setBridgeAmount] = useState('')
  const isEligible = useMemo(() => {
    return !Number.isNaN(bridgeAmount) && Number(bridgeAmount) >= 50
  }, [bridgeAmount])

  const error = useMemo(() => {
    if (Number.isNaN(bridgeAmount) || Number(bridgeAmount) < 50) {
      return '* Entered amount below minimum bridge amount'
    }
    return ''
  }, [bridgeAmount])

  const handleInputChange = (evt: any) => {
    setBridgeAmount(evt.target.value)
  }

  const bridgeSOYHecoToPolygon = () => {
    console.log('bbb')
  }

  return (
    <Modal title={t('SOY Bridge')} onDismiss={onDismiss}>
      <Flex justifyContent="center">
        <Box maxWidth="320px">
          <Text fontSize="14px">
            {t('Bridge SOY from HECO to Polygon mainnet')}
          </Text>
          <InputWrapper>
            <StyledInput
              scale="lg"
              value={bridgeAmount}
              placeholder="0"
              onChange={handleInputChange}
            />
          </InputWrapper>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Fee</Text>
            <Text fontSize='14px'>0</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Max Bridge Amount</Text>
            <Text fontSize='14px'>50,000,000 SOY</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Min Bridge Amount</Text>
            <Text fontSize='14px'>50 SOY</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Normal Estimated Arrival</Text>
            <Text fontSize='14px'>10-30 mins</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>10m+ SOY Estimated Arrival</Text>
            <Text fontSize='14px'>Up to 12 hrs</Text>
          </Flex>
          <Button width="100%" mt="16px" disabled={!isEligible} onClick={bridgeSOYHecoToPolygon}>Approve</Button>
          {
            !isEligible &&
              <Text color="red" fontSize='14px' mt='6px'>{error}</Text>
          }
        </Box>
      </Flex>
    </Modal>
  )
}

export default SOYBridgeModal
