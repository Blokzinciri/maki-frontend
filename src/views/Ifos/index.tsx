import React from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Flex, Heading, useMatchBreakpoints } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import PageHeader from 'components/PageHeader'
import { Route, useRouteMatch, Link } from 'react-router-dom'
import CurrentIfo from './CurrentIfo'

interface ComingSoonProps {
  children?: React.ReactNode
}

// eslint-disable-next-line
const StyledHeading = styled(Heading)`
  color: #5f6471;
  font-size: 18px;
  font-weight: 500;
`

const ContentWrapper = styled.div`
  margin: 36px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 2px solid #e6edf8;
  max-width: 1200px;
`

const StyledButtonMenu = styled(ButtonMenu)`
  background: ${({ theme }) => (theme.isDark ? '#353547' : '#e9f2ff')};
  border: none;
`

const IfoContainer = styled(Container)`
  max-width: 1200px;
`

const HecoPadBanner = styled.a`
  max-width: 736px;
  display: block;
  margin: 0 auto;
`

const ComingSoon: React.FC<ComingSoonProps> = ({ children }) => {
  const { t } = useTranslation()
  const { isXl } = useMatchBreakpoints()
  const { path, url, isExact } = useRouteMatch()

  return (
    <>
      <PageHeader background="url(/images/banner-bg.png) no-repeat">
        <Flex justifyContent="space-between" flexDirection={isXl ? 'row' : 'column'}>
          <div>
            <Heading as="h2" scale="xl" color="secondary" mb={isXl ? '24px' : '10px'}>
              {t('IFO: Initial Farm Offerings')}
            </Heading>
            <StyledHeading scale="md" color="text">
              {t('Buy new tokens with a brand new token sale model.')}
            </StyledHeading>
          </div>
          <div>
            <img src="/images/sushi-pair.svg" alt="IFO Page Banner" style={{ height: isXl ? 'auto' : '80px' }} />
          </div>
        </Flex>
      </PageHeader>
      <ContentWrapper>
        <Flex justifyContent="center" alignItems="center" mb="32px">
          <StyledButtonMenu activeIndex={!isExact ? 1 : 0} scale="sm">
            <ButtonMenuItem as={Link} to={`${url}`}>
              {t('Next IFO')}
            </ButtonMenuItem>
            <ButtonMenuItem id="past-ifos-button" as={Link} to={`${url}/history`}>
              {t('Past IFOs')}
            </ButtonMenuItem>
          </StyledButtonMenu>
        </Flex>
      </ContentWrapper>
      <IfoContainer>
        <HecoPadBanner href="https://hecopad.com" target="_blank" rel="noreferrer">
          <img src="/images/hecopad-banner.png" alt="HecoPad Banner" />
        </HecoPadBanner>
        <Route exact path={`${path}`}>
          <CurrentIfo />
        </Route>
        <Route path={`${path}/history`} />
      </IfoContainer>
    </>
  )
}

export default ComingSoon
