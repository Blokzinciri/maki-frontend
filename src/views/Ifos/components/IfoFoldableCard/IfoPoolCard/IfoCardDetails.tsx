import React from 'react'
import { Text, Flex, Box, Skeleton } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'

export interface FooterEntryProps {
  label: string
  value: string | number
}

export interface IfoCardDetailsProps {
  type: string
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small color="textSubtle">
        {label}
      </Text>
      {value ? (
        <Text small textAlign="right">
          {value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  )
}

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({ type }) => {
  const { t } = useTranslation()

  const renderBasedOnIfoStatus = () => {
    return (
      <>
        {type === 'basic' && <FooterEntry label={t('Max. LP token entry')} value="0.5920663114" />}
        {type === 'unlimited' && <FooterEntry label={t('Additional fee:')} value="0%" />}
        <FooterEntry label={t('Total committed:')} value="~$15,572,834 (2232.19%)" />
        <FooterEntry label={t('Funds to raise:')} value="$750,000" />
        <FooterEntry label={t('CAKE to burn:')} value="$375,000" />
        <FooterEntry label={t('Price per %symbol%:', { symbol: 'HECO' })} value="$2" />
      </>
    )
  }

  return <Box paddingTop="24px">{renderBasedOnIfoStatus()}</Box>
}

export default IfoCardDetails
