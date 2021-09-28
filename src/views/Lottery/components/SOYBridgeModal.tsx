import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useSOYBalanceMatic, useTokenBalanceNew } from 'hooks/useTokenBalance'
import { formatNumber, getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import { Modal, Text, Flex, Box, Button, BalanceInput, ButtonMenu, ButtonMenuItem } from 'maki-uikit-v2'
import { useTranslation } from 'contexts/Localization'
import { usePriceMakiHusd } from 'state/hooks'
import defaultTokenJson from 'config/constants/token/makiswap.json'
import { parseUnits } from '@ethersproject/units'
import useToast from 'hooks/useToast'
import { useActiveWeb3React } from 'hooks'
import useTokenTransfer from '../hooks/useTokenTransfer'
import useSwapOut from '../hooks/useSwapOut'

const InputWrapper = styled.div`
  position: relative;
  margin-top: 16px;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`

const MenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

interface SOYBridgeModalProps {
  onDismiss?: () => void
}

const SOYBridgeModal: React.FC<SOYBridgeModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const [bridgeAmount, setBridgeAmount] = useState('')
  const [bridgeIndex, setBridgeIndex] = useState(0)
  const soyData = defaultTokenJson.tokens.filter(val => val.symbol === 'SOY')[0]
  const { balance: soyBalanceHECO, fetchStatus: fetchStatusHECO } = useTokenBalanceNew(soyData.address)
  const { balance: soyBalanceMatic, fetchStatus: fetchStatusMatic } = useSOYBalanceMatic()
  const fetchStatus = bridgeIndex === 0 ? fetchStatusHECO : fetchStatusMatic
  const [ bridgeData, setBridgeData ] = useState<any>(null)
  const [ depositTokenAddress, setDepositTokenAddress ] = useState('')
  const [ withdrawTokenAddress, setWithdrawTokenAddress ] = useState('')
  const soyBalance = bridgeIndex === 0 ? soyBalanceHECO : soyBalanceMatic
  const userSOYDisplayBalanceHECO = getFullDisplayBalance(soyBalanceHECO, 18, 3)
  const userSOYDisplayBalanceMatic = getFullDisplayBalance(soyBalanceMatic, 18, 3)
  const userSOYDisplayBalance = bridgeIndex === 0 ? userSOYDisplayBalanceHECO : userSOYDisplayBalanceMatic
  const tokenTransfer = useTokenTransfer(depositTokenAddress);
  const swapOut = useSwapOut(withdrawTokenAddress)
  const { toastSuccess, toastError } = useToast()

  const isEligible = useMemo(() => {
    const tokenAddress = bridgeIndex === 0 ? depositTokenAddress : withdrawTokenAddress
    return tokenAddress !== '' && !Number.isNaN(bridgeAmount) && Number(bridgeAmount) >= (bridgeIndex === 0 ? 50 : 500) && Number(bridgeAmount) <= getBalanceNumber(soyBalance, soyData.decimals)
  }, [bridgeAmount, bridgeIndex, soyBalance, soyData, depositTokenAddress, withdrawTokenAddress])

  const makiPriceHusd = usePriceMakiHusd()
  const usdValueBridge =
    makiPriceHusd.gt(0) && bridgeAmount ? formatNumber(new BigNumber(bridgeAmount).times(makiPriceHusd).toNumber()) : ''

  const error = useMemo(() => {
    if (Number.isNaN(bridgeAmount) || Number(bridgeAmount) < (bridgeIndex === 0 ? 50 : 500)) {
      return '* Entered amount below minimum bridge amount'
    }
    if (Number(bridgeAmount) > getBalanceNumber(soyBalance, soyData.decimals)) {
      return '* Insufficient SOY Balance'
    }
    return ''
  }, [bridgeAmount, bridgeIndex, soyBalance, soyData])

  const handleBridgeAmount = (input: string) => {
    setBridgeAmount(input)
  }

  useEffect(() => {
    fetch('https://bridgeapi.anyswap.exchange/v2/serverinfoFull/137')
      .then(res => res.json())
      .then(data => {
        setBridgeData(data.soyv5)
        setDepositTokenAddress(data.soyv5.SrcToken.ContractAddress)
        setWithdrawTokenAddress(data.soyv5.DestToken.ContractAddress)
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

  const bridgeSOYPolygonToHeco = () => {
    const transferArgs = {
      address: account,
      amount: parseUnits(bridgeAmount, bridgeData.DestToken.Decimals)
    }
    swapOut(transferArgs).then(res => {
      toastSuccess(`${bridgeAmount} SOY successfully bridged to HECO network`)
    }).catch(e => {
      toastError('There was an error while bridging SOY')
    })
  }

  return (
    <Modal title={t('SOY Bridge')} onDismiss={onDismiss}>
      <Flex justifyContent="center">
        <Box maxWidth="320px">
          <MenuWrapper>
            <ButtonMenu activeIndex={bridgeIndex} onItemClick={(index) => { setBridgeIndex(index); }} scale="sm" variant="subtle">
              <ButtonMenuItem id="deposit-item">
                Deposit
              </ButtonMenuItem>
              <ButtonMenuItem id="withdraw-item">
                Withdraw
              </ButtonMenuItem>
            </ButtonMenu>
          </MenuWrapper>
          <Text fontSize="14px">
            {t(`Bridge SOY from ${bridgeIndex === 0 ? 'HECO': 'Polygon'} to ${bridgeIndex === 0 ? 'Polygon': 'HECO'} mainnet`)}
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
            <Text fontSize='14px'>{ bridgeIndex === 0 ?  0 : '0.1%' }</Text>
          </Flex>
          {
            bridgeIndex === 1 &&
              <>
                <Flex justifyContent='space-between' alignItems='center' mt='8px'>
                  <Text fontSize='14px'>Min Fee</Text>
                  <Text fontSize='14px'>50 SOY</Text>
                </Flex>
                <Flex justifyContent='space-between' alignItems='center' mt='8px'>
                  <Text fontSize='14px'>Max Fee</Text>
                  <Text fontSize='14px'>10,000 SOY</Text>
                </Flex>
              </>
          }
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Max Bridge Amount</Text>
            <Text fontSize='14px'>50,000,000 SOY</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Min Bridge Amount</Text>
            <Text fontSize='14px'>{ bridgeIndex === 0 ? 50 : 500 } SOY</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>Normal Estimated Arrival</Text>
            <Text fontSize='14px'>10-30 mins</Text>
          </Flex>
          <Flex justifyContent='space-between' alignItems='center' mt='8px'>
            <Text fontSize='14px'>10m+ SOY Estimated Arrival</Text>
            <Text fontSize='14px'>Up to 12 hrs</Text>
          </Flex>
          <Button width="100%" mt="16px" disabled={!isEligible} onClick={bridgeIndex === 0 ? bridgeSOYHecoToPolygon : bridgeSOYPolygonToHeco}>Approve</Button>
          {
            !isEligible &&
              <Text color="red" fontSize='14px' mt='6px' textAlign='center'>{error}</Text>
          }
        </Box>
      </Flex>
    </Modal>
  )
}

export default SOYBridgeModal
