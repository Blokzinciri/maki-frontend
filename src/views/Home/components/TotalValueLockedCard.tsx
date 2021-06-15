import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Text } from 'maki-uikit'
import BigNumber from 'bignumber.js'

import { useGetStats } from 'hooks/api'
import { useFarmFromPid, usePriceBtcHusd, usePriceEthHusd, usePriceMakiHusd, usePriceHtHusd } from 'state/hooks'
// import { split } from 'lodash'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const data = useGetStats()
  const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null

/* ACQUIRE PRICES */
  const makiPrice = new BigNumber(usePriceMakiHusd())
  const htPrice = new BigNumber(usePriceHtHusd())
  const ethPrice = new BigNumber(usePriceEthHusd())
  const btcPrice = new BigNumber(usePriceBtcHusd())
  
/* VALUE BY PID */
  const F0 = new BigNumber(1500000)
  const F1 = new BigNumber(useFarmFromPid(1).quoteTokenAmountTotal).times(htPrice)
  const F2 = new BigNumber(useFarmFromPid(2).quoteTokenAmountTotal).times(htPrice)
  const F3 = new BigNumber(useFarmFromPid(3).quoteTokenAmountTotal).times(makiPrice)
  const F4 = new BigNumber(useFarmFromPid(4).quoteTokenAmountTotal).times(htPrice)
  const F5 = new BigNumber(useFarmFromPid(5).quoteTokenAmountTotal).times(ethPrice)
  const F6 = new BigNumber(useFarmFromPid(6).quoteTokenAmountTotal).times(btcPrice)
  const F7 = new BigNumber(useFarmFromPid(7).quoteTokenAmountTotal).times(htPrice)
  const F8 = new BigNumber(useFarmFromPid(8).quoteTokenAmountTotal)
  const F9 = new BigNumber(useFarmFromPid(9).quoteTokenAmountTotal).times(ethPrice)
  const F10 = new BigNumber(useFarmFromPid(10).quoteTokenAmountTotal).times(htPrice)

  const HTVAL = F1.plus(F2).plus(F4).plus(F7).plus(F10)
  const MAKIVAL = F3.plus(F0)
  const ETHVAL = F5.plus(F9)
  const BTCVAL = F6
  const USDVAL = F8

/* SUM VALUE LOCKED */
  const ttlVal = new BigNumber(((HTVAL.plus(MAKIVAL).plus(ETHVAL)).plus(BTCVAL).plus(USDVAL)).times(2)).toLocaleString().slice(0,11)
  const totalValueFormated = ttlVal
  ? `$${Number(ttlVal).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  : '-'

  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="24px">
          Total Value Locked (TVL)
        </Heading>
        {data ? (
          <>
            <Heading size="xl">{tvl}</Heading>
            <Text color="textSubtle">Across all LPs and Maki Pools</Text>
          </>
        ) : (
          <>
          {/* <Skeleton height={45} /> */}
          <Heading size="xl">{totalValueFormated}</Heading>
          <Text color="textSubtle">Across all LPs and Maki Pools</Text>
          </>
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
