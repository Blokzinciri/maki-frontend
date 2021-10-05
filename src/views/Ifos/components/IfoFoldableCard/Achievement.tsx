import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, Image, Text, PrizeIcon, Skeleton } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

const AchievementFlex = styled(Flex)<{ isFinished: boolean }>`
  ${({ isFinished }) => (isFinished ? 'filter: grayscale(100%)' : '')};
`

const StyledLinkExternal = styled(LinkExternal)`
  margin-top: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

const Achievement: React.FC = () => {
  const { t } = useTranslation()
  const numberPoints = 100
  const amount = 0.063
  const campaignTitle = 'HecoPad (HECO)'
  const { theme } = useTheme()
  const shopperColor = theme.isDark ? 'white' : 'black'

  return (
    <Container>
      <AchievementFlex isFinished alignItems="center" flexGrow={1}>
        {/* <Image src={`/images/achievements/ifo-${tokenName}.svg`} width={56} height={56} mr="8px" /> */}
        <Flex flexDirection="column">
          <Text color="secondary" fontSize="12px">
            {`${t('Achievement')}:`}
          </Text>
          <Flex>
            <Text color={shopperColor} mr="8px">
              {t('IFO Shopper: %title%', { title: campaignTitle })}
            </Text>
            <Flex alignItems="center" mr="8px">
              <PrizeIcon color="textSubtle" width="16px" mr="4px" />
              <Text color="textSubtle">{numberPoints}</Text>
            </Flex>
          </Flex>

          <Text color="textSubtle" fontSize="12px">
            {t('Commit ~%amount% LP in total to earn!', { amount })}
          </Text>
        </Flex>
      </AchievementFlex>
      <Flex alignItems="flex-end" flexDirection="column">
        <StyledLinkExternal href="/" mb="8px">
          {t('Learn more about %title%', { title: campaignTitle })}
        </StyledLinkExternal>
        <StyledLinkExternal href="/">{t('View Contract')}</StyledLinkExternal>
      </Flex>
    </Container>
  )
}

export default Achievement
