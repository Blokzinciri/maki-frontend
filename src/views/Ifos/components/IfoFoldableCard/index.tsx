import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, CardFooter, ExpandableButton, Button, ChevronUpIcon } from 'maki-toolkit'

import { useTranslation } from 'contexts/Localization'

import { EnableStatus } from './types'
import IfoPoolCard from './IfoPoolCard'
// import Timer from './Timer'
import Achievement from './Achievement'

const StyledCard = styled(Card)`
  max-width: 736px;
  width: 100%;
  margin: auto;
  border-radius: 0;
`

const Header = styled(CardHeader)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 112px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url('/images/ifos/belt-bg.svg');
`

const FoldableContent = styled.div<{ isVisible: boolean; isActive: boolean }>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  background: ${({ theme }) => (!theme.isDark ? '#f6f6f6' : theme.colors.backgroundAlt)};
`

const CardsWrapper = styled.div<{ singleCard: boolean }>`
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: ${({ singleCard }) => (singleCard ? '1fr' : '1fr 1fr')};
    justify-items: ${({ singleCard }) => (singleCard ? 'center' : 'unset')};
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`

const StyledCardFooter = styled(CardFooter)`
  text-align: center;
  padding: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: 0px 2px 3px #00000029;
  border-radius: 0 0 20px 20px;
`

const IfoFoldableCard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [enableStatus, setEnableStatus] = useState(EnableStatus.ENABLED)
  const { t } = useTranslation()

  const isActive = true

  return (
    <StyledCard>
      {!isVisible && (
        <Header>
          <ExpandableButton expanded={isVisible} onClick={() => setIsVisible((prev) => !prev)} />
        </Header>
      )}
      <FoldableContent isVisible={isVisible} isActive={isActive}>
        {/* {isActive && <Progress variant="flat" primaryStep={publicIfoData.progress} />} */}
        <StyledCardBody>
          {/* {isActive && <Timer />} */}
          <CardsWrapper singleCard={false}>
            <IfoPoolCard type="basic" enableStatus={enableStatus} />
            <IfoPoolCard type="unlimited" enableStatus={enableStatus} />
          </CardsWrapper>
          <Achievement />
        </StyledCardBody>
        <StyledCardFooter>
          <Button variant="text" endIcon={<ChevronUpIcon color="primary" />} onClick={() => setIsVisible(false)}>
            {t('Close')}
          </Button>
        </StyledCardFooter>
      </FoldableContent>
    </StyledCard>
  )
}

export default IfoFoldableCard
