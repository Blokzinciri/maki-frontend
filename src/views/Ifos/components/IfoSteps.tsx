import React from 'react'
import styled from 'styled-components'

import { Stepper, Step, Card, CardBody, Heading, Text, Button, Link, OpenNewIcon } from 'maki-toolkit'
import { Link as RouterLink } from 'react-router-dom'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { Status } from 'maki-toolkit/dist/components/Stepper/types'

const Wrapper = styled(Container)`
  background: ${({ theme }) =>
    !theme.isDark
      ? 'linear-gradient(126deg, #ffffff 0%, #e6edf8 100%)'
      : 'linear-gradient(126deg, #212121 0%,#3A3045 100%)'};
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;
  max-width: 1200px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`
const StyledCardBody = styled(CardBody)`
  background: ${({ theme }) => (!theme.isDark ? '#fff' : theme.colors.background)};
  box-shadow: 0px 2px 3px #00000029;
`

const StyledStep = styled(Step)`
  color: #707070;
`

const IfoSteps: React.FC = () => {
  const { t } = useTranslation()

  const stepsValidationStatus = ['current', 'future', 'future', 'future']

  const renderCardBody = (step: number) => {
    const renderAccountStatus = () => {
      return (
        <Button as={RouterLink} to="/">
          {t('Activate your Profile')}
        </Button>
      )
    }

    switch (step) {
      case 0:
        return (
          <StyledCardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Activate your Profile')}
            </Heading>
            <Text color="#707070" small mb="16px">
              {t('You’ll need an active MakiSwap Profile to take part in an IFO!')}
            </Text>
            {renderAccountStatus()}
          </StyledCardBody>
        )
      case 1:
        return (
          <StyledCardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Get MAKI-BNB LP Tokens')}
            </Heading>
            <Text color="#707070" small>
              {t('Stake MAKI and BNB in the liquidity pool to get LP tokens.')} <br />
              {t('You’ll spend them to buy IFO sale tokens.')}
            </Text>
            <Button
              as={Link}
              external
              href={`${BASE_ADD_LIQUIDITY_URL}/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`}
              endIcon={<OpenNewIcon color="white" />}
              mt="16px"
            >
              {t('Get LP tokens')}
            </Button>
          </StyledCardBody>
        )
      case 2:
        return (
          <StyledCardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Commit LP Tokens')}
            </Heading>
            <Text color="#707070" small>
              {t('When the IFO sales are live, you can “commit” your LP tokens to buy the tokens being sold.')} <br />
              {t('We recommend committing to the Basic Sale first, but you can do both if you like.')}
            </Text>
          </StyledCardBody>
        )
      case 3:
        return (
          <StyledCardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Claim your tokens and achievement')}
            </Heading>
            <Text color="#707070" small>
              {t(
                'After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent MAKI-BNB LP tokens will be returned to your wallet.',
              )}
            </Text>
          </StyledCardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {t('How to Take Part')}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((status, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledStep key={index} index={index} status={status as Status}>
            <Card>{renderCardBody(index)}</Card>
          </StyledStep>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
