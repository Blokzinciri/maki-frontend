import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Text, Flex, Heading, Skeleton, Button, useModal } from 'maki-toolkit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { usePriceMakiHusd } from 'state/hooks'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import BuyTicketsButton from './BuyTicketsButton'
import SOYBridgeModal from './SOYBridgeModal'

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }  
`

const TicketContainer = styled(Flex)`
  animation: ${mainTicketAnimation} 3s ease-in-out infinite;
`

const PrizeTotalBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: #FC7A2E;
  width: 192px;
  height: 50px;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  font-size: 18px;
`

const ButtonWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
`

const ButtonImages = styled.div`
  position: absolute;
  top: -24px;
  left: -24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  & img:last-child {
    margin-top: -10px;
  }
`

const BridgeButton = styled(Button)`
  background: #FC7A2E;
  box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.1);
  width: 192px;
`

const Hero = () => {
  const { t } = useTranslation()
  const {
    currentRound: { amountCollectedInCake, status },
    isTransitioning,
  } = useLottery()

  const cakePriceBusd = usePriceMakiHusd()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning
  const [onPresentBridgeModal] = useModal(<SOYBridgeModal />)

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <>
          {prizeInBusd.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance fontSize="48px" bold prefix="$" value={prizeTotal} decimals={0} />
          )}
          <Heading mb="16px" scale="lg" color="#ffffff">
            {t('in prizes!')}
          </Heading>
          <Text color='white' fontSize="20px" maxWidth='680px' mx='32px' mb='12px' textAlign='center'>
            {t('In order to participate in the MakiSwap lottery you need to bridge your SOY tokens from HECO Chain to Polygon Network (MATIC) to begin playing.')}
          </Text>
          <BridgeButton onClick={onPresentBridgeModal}>Bridge</BridgeButton>
        </>
      )
    }
    return (
      <Heading mb="24px" scale="xl" color="#ffffff">
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Heading scale="md" color="#ffffff">
        {t('The MakiSwap Lottery')}
      </Heading>
      {getHeroHeading()}
      <TicketContainer
        position="relative"
        width={['240px', '288px']}
        height={['94px', '113px']}
        alignItems="center"
        justifyContent="center"
      >
        <ButtonWrapper>
          <ButtonImages>
            <img src='/images/lottery/lotteryCake1.svg' alt='Lottery Cake' />
            <img src='/images/lottery/lotteryCake2.svg' alt='Lottery Cake' />
          </ButtonImages>
          <StyledBuyTicketButton disabled={ticketBuyIsDisabled} />
        </ButtonWrapper>
      </TicketContainer>
    </Flex>
  )
}

export default Hero
