import React, { useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Text, Flex } from 'maki-toolkit'
import { Currency, Token, HUOBI, WHT, ChainId } from 'maki-sdk'
import { darken } from 'polished'
import { BusinessDay, TickMarkType, UTCTimestamp } from 'lightweight-charts'

import { formatNumber } from 'utils/formatBalance'
import CurrencyLogo from 'components/CurrencyLogo'

import { useActiveWeb3React } from 'hooks'
import { CandlePeriod, NumericalCandlestickDatum } from 'config/constants/types'
import fillCandlestickGaps from 'utils/fillCandlestickGaps'
import useWindowDimensions from 'hooks/useWindowDimensions'
import TVChart from './kaktana-react-lightweight-charts'

interface ChartProps {
  inputCurrency: Currency | Token | undefined
  outputCurrency: Currency | Token | undefined
}

const ChartHeaderWrapper = styled.div`
  display: flex;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`

const ChartSubHeader = styled(Flex)`
  margin-top: 1rem;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm}{
    flex-direction: row;
    align-items: flex-end;
  }
`

// const PriceText = styled(Text)`
//   color: ${({ theme }) => theme.text2};
// `

const LastPriceHeaderWrapper = styled.div`
  font-size: 46px;
`

const CandlePeriodsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const FlexColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`

const CandlePeriodButton = styled.div`
  padding: 0.5rem 0.75rem;
  margin: 0.25rem;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};

  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.backgroundAlt)};
  }

  &.selected {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.background};
  }
  border: none;
`

const ChartWrapper = styled.div<{ hasData: boolean }>`
  background-color: ${({ theme, hasData }) => !hasData && theme.colors.primaryDark};
  z-index: 999;
`

// We put Jan at the back because the tick mark for the first day of the next month is read from the last day of the
// previous month. E.g. the monthly tick mark shows for Dec 31, but we want it to show Jan to signal the start of Jan.
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

// Major hierarchy in ascending order.
const MAJOR_HIERARCHY = [
  '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'.toLowerCase(), // WAVAX
  '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab'.toLowerCase(), // WETH.e
  '0x50b7545627a5162f82a992c33b87adc75187b218'.toLowerCase(), // WBTC.e
  '0xd586e7f844cea2f87f50152665bcbc2c279d8d70'.toLowerCase(), // DAI.e
  '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664'.toLowerCase(), // USDC.e
  '0xc7198437980c041c805A1EDcbA50c1Ce5db95118'.toLowerCase() // USDT.e
]

export default function TradingChart({ inputCurrency, outputCurrency }: ChartProps) {
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)
  const [candlePeriod, setCandlePeriod] = useState(CandlePeriod.OneHour)
  const [candlestickSeries, setCandlestickSeries] = useState<{ data: NumericalCandlestickDatum[] }[]>([{ data: [] }])

  // dynamically set chart width
  const { height, width } = useWindowDimensions()
  const chartWidth = Math.min(width - 16 - 16, 500)

  const inputAddress =
    inputCurrency instanceof Token
      ? inputCurrency.address
      : inputCurrency === HUOBI
      ? WHT[chainId || ChainId.MAINNET]?.address
      : ''
  const outputAddress =
    outputCurrency instanceof Token
      ? outputCurrency.address
      : outputCurrency === HUOBI
      ? WHT[chainId || ChainId.MAINNET]?.address
      : ''

  // Chart should always show alt/major, e.g. JOE/AVAX.
  // In this case, we want token0 = alt and token1 = major.
  // However, if both tokens are both considered majors,
  // then we defer to MAJOR_HIERARCHY to decide which major is more major,
  // e.g. USDC.e is more major than WAVAX, so token0 = WAVAX and token1 = USDC.e.
  const token0Index = MAJOR_HIERARCHY.indexOf(inputAddress.toLowerCase())
  const token1Index = MAJOR_HIERARCHY.indexOf(outputAddress.toLowerCase())

  const altCurrency = token0Index < token1Index ? inputCurrency : outputCurrency
  const majorCurrency = token0Index < token1Index ? outputCurrency : inputCurrency

  // A greater index denotes a greater major. -1 denotes altcoin.
  // const token0LCase = token0Index < token1Index ? inputAddress.toLowerCase() : outputAddress.toLowerCase()
  // const token1LCase = token0Index < token1Index ? outputAddress.toLowerCase() : inputAddress.toLowerCase()

  // const candleData: NumericalCandlestickDatum[] = useDexCandles(token0LCase, token1LCase, candlePeriod)

  const chartOptions = {
    // General chart options
    width: chartWidth,
    height: 300,
    layout: {
      backgroundColor: `${theme.colors.background}`,
      lineColor: '#2B2B43',
      textColor: `${theme.colors.textSecondary}`
    },
    priceFormat: {
      type: 'custom',
      minMove: 1 / (10 ** 10),
      formatter: (price: any) => {
        if (price < 0) return 0
        if (price < 0.001) return parseFloat(price).toFixed(10)
        if (price >= 0.001 && price < 1) return parseFloat(price).toFixed(6)
        return parseFloat(price).toFixed(3)
      }
    },
    priceScale: {
      position: 'left',
      autoScale: true,
      borderColor: `${theme.colors.textSecondary}`
    },
    timeScale: {
      visible: true,
      timeVisible: true,
      borderColor: `${theme.colors.textSecondary}`,
      tickMarkFormatter: (time: BusinessDay | UTCTimestamp, tickMarkType: TickMarkType) => {
        const date = new Date((time as UTCTimestamp) * 1000)
        const year = date.getFullYear()
        const month = monthNames[date.getMonth()]
        const day = date.getDate()
        const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours().toString()
        const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes().toString()
        const second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds().toString()
        if (tickMarkType === TickMarkType.Year)
          return year
        if (tickMarkType === TickMarkType.Month)
          return month
        if (tickMarkType === TickMarkType.DayOfMonth)
          return day
        if (tickMarkType === TickMarkType.Time)
          return `${hour}:${minute}`
        return `${hour}:${minute}:${second}`
      }
    },
    localization: {
      timeFormatter: (time: BusinessDay | UTCTimestamp) => {
        const date = new Date((time as UTCTimestamp) * 1000)
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours().toString()
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes().toString()
        return `${hours}:${minutes}`
      },
      priceFormatter: (price: any) => {
        if (price < 0) return 0
        if (price < 0.001) return parseFloat(price).toFixed(10)
        if (price >= 0.001 && price < 0.01) return parseFloat(price).toFixed(8)
        if (price >= 0.01 && price < 1) return parseFloat(price).toFixed(6)
        return parseFloat(price).toFixed(3)
      }
    },
    crosshair: {
      vertLine: {
        width: 1.5,
        color: `${theme.colors.card}`,
        style: 2
      },
      horzLine: {
        width: 1.5,
        color: `${theme.colors.card}`,
        style: 2
      },
      mode: 0 // 0 = normal mode, 1 = magnet mode
    },
    grid: {
      vertLines: {
        visible: false
      },
      horzLines: {
        visible: false
      }
    },
    handleScale: {
      mouseWheel: true,
      axisPressedMouseMove: {
        time: false
      },
      pinch: false
    },
    // Candlestick series options
    upColor: `${theme.colors.success}`,
    borderUpColor: `${theme.colors.success}`,
    wickUpColor: `${theme.colors.success}`,
    downColor: `${theme.colors.failure}`,
    borderDownColor: `${theme.colors.failure}`,
    wickDOwnColor: `${theme.colors.failure}`
  }

  useEffect(() => {
    const candleData: NumericalCandlestickDatum[] = [
      { time: 1632661577, open: 173.16, high: 176.43, low: 172.64, close: 176.24 },
      { time: 1632662577, open: 177.98, high: 178.85, low: 175.59, close: 175.88 },
      { time: 1632663577, open: 176.84, high: 180.86, low: 175.90, close: 180.46 },
      { time: 1632664577, open: 182.47, high: 183.01, low: 177.39, close: 179.93 },
      { time: 1632665577, open: 181.02, high: 182.41, low: 179.30, close: 182.19 }
    ]
    const formattedCandleData: NumericalCandlestickDatum[] = fillCandlestickGaps(candleData, candlePeriod)
    setCandlestickSeries([{ data: formattedCandleData }])
  }, [candlePeriod])

  const hasData = candlestickSeries[0].data.length > 0
  const lastClose = hasData ? candlestickSeries[0].data[candlestickSeries[0].data.length - 1].close : undefined
  const fmtLastClose = lastClose ? formatNumber(lastClose) : 'N/A'

  return (
    <div style={{ padding: '1rem' }}>
      {/*
       * TODO: show empty state if insufficient data
       *
       */}

      <FlexColumnWrapper>
        <ChartHeaderWrapper>
          {altCurrency ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CurrencyLogo currency={altCurrency} size='30px' />
              <Text style={{ marginLeft: '0.5rem' }}>{altCurrency?.symbol}</Text>
            </div>
          ) : (
            <></>
          )}

          {altCurrency && majorCurrency ? (
            <Text style={{ margin: '0 1rem' }}>/</Text>
          ) : (
            <div />
          )}

          {majorCurrency ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CurrencyLogo currency={majorCurrency} size='30px' />
              <Text style={{ marginLeft: '0.5rem' }}>{majorCurrency?.symbol}</Text>
            </div>
          ) : (
            <></>
          )}
        </ChartHeaderWrapper>
        <ChartSubHeader>
          <LastPriceHeaderWrapper>{fmtLastClose}</LastPriceHeaderWrapper>

          <CandlePeriodsWrapper>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.FiveMinutes ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.FiveMinutes)}
            >
              5m
            </CandlePeriodButton>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.FifteenMinutes ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.FifteenMinutes)}
            >
              15m
            </CandlePeriodButton>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.OneHour ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.OneHour)}
            >
              1H
            </CandlePeriodButton>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.FourHours ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.FourHours)}
            >
              4H
            </CandlePeriodButton>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.OneDay ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.OneDay)}
            >
              1D
            </CandlePeriodButton>
            <CandlePeriodButton
              className={candlePeriod === CandlePeriod.OneWeek ? 'selected' : ''}
              onClick={() => setCandlePeriod(CandlePeriod.OneWeek)}
            >
              1W
            </CandlePeriodButton>
          </CandlePeriodsWrapper>
        </ChartSubHeader>
        <ChartWrapper hasData={hasData}>
          <TVChart options={chartOptions} candlestickSeries={candlestickSeries} />
        </ChartWrapper>
        {!hasData && (
          <Text
            fontSize='14px'
            textAlign='center'
          >Unforunately, this pair doesn&rsquo;t have enough data.</Text>
        )}
      </FlexColumnWrapper>
    </div>
  )
}
