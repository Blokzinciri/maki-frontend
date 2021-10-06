import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import FoldableText from 'components/FoldableSection/FoldableText'
import config from './config'

const ImageWrapper = styled.div`
  flex: none;
  order: 2;
  max-width: 414px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const DetailsWrapper = styled.div`
  order: 1;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
    margin-left: 40px;
  }
`

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 3px #00000029;
  ${CardBody} {
    background: ${({ theme }) => (!theme.isDark ? '#fff' : theme.colors.backgroundAlt)};
  }
  ${CardHeader} {
    background: ${({ theme }) =>
      !theme.isDark ? 'linear-gradient(180deg, #e6edf8 0%, #c2e4fb 100%)' : theme.colors.gradients.cardHeader};
  }
`

const IfoQuestions = () => {
  const { t } = useTranslation()

  return (
    <Flex alignItems={['center', null, null, 'start']} flexDirection={['column', null, null, 'row']}>
      <ImageWrapper>
        <img src="/images/ifos/ifo-maki.png" alt="ifo maki" width="414px" height="500px" />
      </ImageWrapper>
      <DetailsWrapper>
        <StyledCard>
          <CardHeader>
            <Heading scale="lg" color="secondary">
              {t('Details')}
            </Heading>
          </CardHeader>
          <CardBody>
            {config.map(({ title, description }, i, { length }) => (
              <FoldableText key={title} id={title} mb={i + 1 === length ? '' : '24px'} title={t(title)}>
                {description.map((desc) => {
                  return (
                    <Text key={desc} color="#707070" as="p">
                      {t(desc)}
                    </Text>
                  )
                })}
              </FoldableText>
            ))}
          </CardBody>
        </StyledCard>
      </DetailsWrapper>
    </Flex>
  )
}

export default IfoQuestions
