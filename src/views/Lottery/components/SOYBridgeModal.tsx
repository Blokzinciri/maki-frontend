import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useTokenBalanceNew } from 'hooks/useTokenBalance'
import { formatNumber, getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { Modal, Text, Flex, Box, Button, BalanceInput } from 'maki-uikit-v2'
import { useTranslation } from 'contexts/Localization'
import { usePriceMakiHusd } from 'state/hooks'
import defaultTokenJson from 'config/constants/token/makiswap.json'
import { parseUnits } from '@ethersproject/units'
import useToast from 'hooks/useToast'
import useTokenTransfer from '../hooks/useTokenTransfer'

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
  const [bridgeAmount, setBridgeAmount] = useState('')
  const soyData = defaultTokenJson.tokens.filter(val => val.symbol === 'SOY')[0]
  const { balance: soyBalance, fetchStatus } = useTokenBalanceNew(soyData.address)
  const [ bridgeData, setBridgeData ] = useState<any>(null)
  const [ depositAddress, setDepositAddress ] = useState('')
  const userSOYDisplayBalance = getFullDisplayBalance(soyBalance, 18, 3)
  const tokenTransfer = useTokenTransfer(depositAddress);
  const { toastSuccess, toastError } = useToast()

  const isEligible = useMemo(() => {
    return !Number.isNaN(bridgeAmount) && Number(bridgeAmount) >= 50
  }, [bridgeAmount])

  const makiPriceHusd = usePriceMakiHusd()
  const usdValueBridge =
    makiPriceHusd.gt(0) && bridgeAmount ? formatNumber(new BigNumber(bridgeAmount).times(makiPriceHusd).toNumber()) : ''

  const error = useMemo(() => {
    if (Number.isNaN(bridgeAmount) || Number(bridgeAmount) < 50) {
      return '* Entered amount below minimum bridge amount'
    }
    return ''
  }, [bridgeAmount])

  const handleBridgeAmount = (input: string) => {
    setBridgeAmount(input)
  }

  useEffect(() => {
    fetch('https://bridgeapi.anyswap.exchange/v2/serverinfoFull/137')
      .then(res => res.json())
      .then(data => {
        setBridgeData(data.soyv5)
        setDepositAddress(data.soyv5.SrcToken.ContractAddress)
      })
  })

  const bridgeSOYHecoToPolygon = () => {
    const transferArgs = {
      address: bridgeData.SrcToken.DepositAddress,
      amount: parseUnits(bridgeAmount, bridgeData.DestToken.Decimals)
    }
    tokenTransfer(transferArgs).then(res => {
      toastSuccess(`${bridgeAmount} SOY successfully bridged to Polygon network`)
    }).catch(e => {
      toastError('There was an error while bridging SOY')
    })
  }

  return (
    <Modal title={t('SOY Bridge')} onDismiss={onDismiss}>
      <Flex justifyContent="center">
        <Box maxWidth="320px">
          <Text fontSize="14px">
            {t('Bridge SOY from HECO to Polygon mainnet')}
          </Text>
          <InputWrapper>
            {
              fetchStatus === 'success' &&
                <Flex justifyContent='space-between' alignItems='center' mb='8px'>
                  <Text fontSize='14px'>Balance: {userSOYDisplayBalance}</Text>
                  <Button scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={() => setBridgeAmount(getBalanceNumber(soyBalance, soyData.decimals).toString())}>
                    {t('Max')}
                  </Button>
                </Flex>
            }
            <BalanceInput
              value={bridgeAmount}
              onUserInput={handleBridgeAmount}
              currencyValue={makiPriceHusd.gt(0) && `~${usdValueBridge || 0} USD`}
              decimals={soyData.decimals}
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
          <Button width="100%" mt="16px" disabled={depositAddress === '' || !isEligible} onClick={bridgeSOYHecoToPolygon}>Approve</Button>
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
