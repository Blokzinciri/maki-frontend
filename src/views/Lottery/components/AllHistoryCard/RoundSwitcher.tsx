import React from 'react'
import styled from 'styled-components'
import { IconButton, ArrowForwardIcon, ArrowBackIcon, Flex, Heading, Input } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'
import { ArrowLastIcon } from '../Svg'

const StyledInput = styled(Input)`
  width: 60px;
  height: 100%;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.isDark ? 'white' : '#0950B5'};
  background: ${({ theme }) => theme.isDark ? '#0950B5' : '#E9F2FF'};
  color: ${({ theme }) => theme.isDark ? 'white' : '#5F6471'};
`

const StyledIconButton = styled(IconButton)`
  width: 32px;

  :disabled {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.textDisabled};

      path {
        fill: ${({ theme }) => theme.colors.textDisabled};
      }
    }
  }
`

interface RoundSwitcherProps {
  isLoading: boolean
  selectedRoundId: string
  mostRecentRound: number
  handleInputChange: (event: any) => void
  handleArrowButonPress: (targetRound: number) => void
}

const RoundSwitcher: React.FC<RoundSwitcherProps> = ({
  isLoading,
  selectedRoundId,
  mostRecentRound,
  handleInputChange,
  handleArrowButonPress,
}) => {
  const { t } = useTranslation()
  const selectedRoundIdAsInt = parseInt(selectedRoundId, 10)

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Heading mr="8px">{t('Round')}</Heading>
        <StyledInput
          disabled={isLoading}
          id="round-id"
          name="round-id"
          type="number"
          value={selectedRoundId}
          scale="lg"
          onChange={handleInputChange}
        />
      </Flex>
      <Flex alignItems="center">
        <StyledIconButton
          disabled={!selectedRoundIdAsInt || selectedRoundIdAsInt <= 1}
          onClick={() => handleArrowButonPress(selectedRoundIdAsInt - 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowBackIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButonPress(selectedRoundIdAsInt + 1)}
          variant="text"
          scale="sm"
          mr="4px"
        >
          <ArrowForwardIcon />
        </StyledIconButton>
        <StyledIconButton
          disabled={selectedRoundIdAsInt >= mostRecentRound}
          onClick={() => handleArrowButonPress(mostRecentRound)}
          variant="text"
          scale="sm"
        >
          <ArrowLastIcon />
        </StyledIconButton>
      </Flex>
    </Flex>
  )
}

export default RoundSwitcher
