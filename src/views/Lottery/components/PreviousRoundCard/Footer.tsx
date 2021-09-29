import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, ExpandableLabel, CardFooter } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import { LotteryRound } from 'state/types'
import FooterExpanded from './FooterExpanded'

interface PreviousRoundCardFooterProps {
  lotteryData: LotteryRound
  lotteryId: string
}

const CardFooterWrapper = styled(CardFooter)`
  border-top: 1px solid #357CE1;
  & button {
    color: ${({ theme }) => theme.isDark ? 'white' : '#357CE1'};
    & svg {
      fill: ${({ theme }) => theme.isDark ? 'white' : '#357CE1'};
    }
  }
`

const PreviousRoundCardFooter: React.FC<PreviousRoundCardFooterProps> = ({ lotteryData, lotteryId }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <CardFooterWrapper p="0">
      {isExpanded && <FooterExpanded lotteryData={lotteryData} lotteryId={lotteryId} />}
      <Flex p="8px 24px" alignItems="center" justifyContent="center">
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('Hide') : t('Details')}
        </ExpandableLabel>
      </Flex>
    </CardFooterWrapper>
  )
}

export default PreviousRoundCardFooter
