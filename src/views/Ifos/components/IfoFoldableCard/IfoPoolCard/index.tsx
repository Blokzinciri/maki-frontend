import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Card, CardBody, CardHeader, Text, useTooltip, HelpIcon, Flex } from 'maki-toolkit'

import { EnableStatus } from '../types'
import IfoCardTokens from './IfoCardTokens'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'

interface IfoCardProps {
  enableStatus: EnableStatus
  type: string
}

interface CardConfig {
  [key: string]: {
    title: string
    variant: 'blue' | 'lightBlue'
    tooltip: string
  }
}

const cardConfig: CardConfig = {
  basic: {
    title: 'Basic Sale',
    variant: 'blue',
    tooltip: 'Every person can only commit a limited amount, but may expect a higher return per token committed.',
  },
  unlimited: {
    title: 'Unlimited Sale',
    variant: 'lightBlue',
    tooltip: 'No limits on the amount you can commit. Additional fee applies when claiming.',
  },
}

const StyledCardHeader = styled(CardHeader)<{ variant: 'blue' | 'lightBlue' }>`
  ${({ variant, theme }) => {
    const blueGradient = theme.isDark
      ? theme.colors.gradients.cardHeader
      : 'linear-gradient(180deg, #EBFFF2 0%, #C2E4FB 100%)'
    const lightBlueGradient = theme.isDark
      ? 'linear-gradient(166.77deg, #3B4155 0%,#28212f 100%)'
      : 'linear-gradient(180deg, #E5F2FF 0%, #96AEF1 100%)'

    return variant === 'blue' ? `background: ${blueGradient}` : `background: ${lightBlueGradient}`
  }}
`

const StyledCard = styled(Card)`
  background: ${({ theme }) => (!theme.isDark ? '#fff' : theme.colors.background)};
`

const SmallCard: React.FC<IfoCardProps> = ({ enableStatus, type }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('IFO sales'), { placement: 'bottom' })
  const config = cardConfig[type]

  const isLoading = false

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <StyledCardHeader variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px">
              {t(config.title)}
            </Text>
            <div ref={targetRef}>
              <HelpIcon />
            </div>
          </Flex>
        </StyledCardHeader>
        <CardBody>
          <IfoCardTokens isLoading={isLoading} />
          <IfoCardActions isLoading={isLoading} />
          <IfoCardDetails type={type} />
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
