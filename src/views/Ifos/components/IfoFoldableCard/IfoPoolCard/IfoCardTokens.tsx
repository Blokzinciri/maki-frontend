import React from 'react'
import { Text, Flex, Box } from 'maki-toolkit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { SkeletonCardTokens } from './Skeletons'

const CardImage = styled.img`
  margin-bottom: 16px;
`

interface IfoCardTokensProps {
  isLoading: boolean
}

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({ isLoading }) => {
  const { t } = useTranslation()

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />
    }
    return (
      <Flex flexDirection="column" alignItems="center">
        <CardImage src="/images/stats-img.png" alt="maki logo" width={80} />
        <Text>{t('You didn’t participate in this sale!')}</Text>
      </Flex>
    )
  }
  return <Box pb="24px">{renderTokenSection()}</Box>
}

export default IfoCardTokens
