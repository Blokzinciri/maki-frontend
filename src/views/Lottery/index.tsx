import React, { useState } from 'react'
import styled from 'styled-components'
import { Box, Flex, Heading, Skeleton } from 'maki-toolkit'
import { LotteryStatus } from 'config/constants/types'
import PageSection from 'components/PageSection'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useFetchLottery, useLottery } from 'state/lottery/hooks'
import {
  GET_TICKETS_BG,
  FINISHED_ROUNDS_BG,
  FINISHED_ROUNDS_BG_DARK,
} from './pageSectionStyles'
import useGetNextLotteryEvent from './hooks/useGetNextLotteryEvent'
import useStatusTransitions from './hooks/useStatusTransitions'
import Hero from './components/Hero'
import NextDrawCard from './components/NextDrawCard'
import Countdown from './components/Countdown'
import HistoryTabMenu from './components/HistoryTabMenu'
import YourHistoryCard from './components/YourHistoryCard'
import AllHistoryCard from './components/AllHistoryCard'
import CheckPrizesSection from './components/CheckPrizesSection'
import HowToPlay from './components/HowToPlay'

const LotteryPage = styled.div`
  min-height: calc(100vh - 64px);
`

const LotteryHero = styled.div`
  background-image: url(/images/lottery/${({ theme }) => theme.isDark ? 'lotteryHeroDark' : 'lotteryHeroLight'}.svg);
  padding: 48px 0 180px;
  background-size: cover;
  background-position: bottom center;
`

const CheckPrizesWrapper = styled(PageSection)`
  padding: 16px 0;
  background: #0D2850;
`

const FinishedBg = styled.img`
  position: absolute;
  bottom: 0;
  width: 100%;
  left: 0;
`

const Lottery = () => {
  useFetchLottery()
  useStatusTransitions()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()
  const {
    currentRound: { status, endTime },
  } = useLottery()
  const [historyTabMenuIndex, setHistoryTabMenuIndex] = useState(0)
  const endTimeAsInt = parseInt(endTime, 10)
  const { nextEventTime, postCountdownText, preCountdownText } = useGetNextLotteryEvent(endTimeAsInt, status)

  return (
    <LotteryPage>
      <LotteryHero>
        <Hero />
      </LotteryHero>
      <PageSection
        hasCurvedDivider={false} 
        background={GET_TICKETS_BG}
        index={2}
      >
        <Flex alignItems="center" justifyContent="center" flexDirection="column" my="-48px">
          {status === LotteryStatus.OPEN && (
            <Heading scale="xl" color="#ffffff" mb="24px" textAlign="center">
              {t('Get your tickets now!')}
            </Heading>
          )}
          <Flex alignItems="center" justifyContent="center" mb="24px">
            {nextEventTime && (postCountdownText || preCountdownText) ? (
              <Countdown
                nextEventTime={nextEventTime}
                postCountdownText={postCountdownText}
                preCountdownText={preCountdownText}
              />
            ) : (
              <Skeleton height="41px" width="250px" />
            )}
          </Flex>
          <NextDrawCard />
        </Flex>
      </PageSection>
      <CheckPrizesWrapper hasCurvedDivider={false} index={2}>
        <CheckPrizesSection />
      </CheckPrizesWrapper>
      <PageSection
        background={isDark ? FINISHED_ROUNDS_BG_DARK : FINISHED_ROUNDS_BG}
        hasCurvedDivider={false}
        index={2}
      >
        <Flex width="100%" flexDirection="column" alignItems="center" justifyContent="center" mt="-24px">
          <Heading mb="24px" scale="xl">
            {t('Finished Rounds')}
          </Heading>
          <Box mb="24px">
            <HistoryTabMenu
              activeIndex={historyTabMenuIndex}
              setActiveIndex={(index) => setHistoryTabMenuIndex(index)}
            />
          </Box>
          {historyTabMenuIndex === 0 ? <AllHistoryCard /> : <YourHistoryCard />}
        </Flex>
        <FinishedBg src='/images/lottery/lotteryBG2.png' alt='Finished Rounds' />
      </PageSection>
      <PageSection background={isDark ? '#141826' : 'white'} hasCurvedDivider={false} index={2}>
        <HowToPlay />
      </PageSection>
    </LotteryPage>
  )
}

export default Lottery
