import React from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem } from 'maki-toolkit'
import { useTranslation } from 'contexts/Localization'

const ButtonMenuWrapper = styled.div`
  & > div {
    background: ${({ theme }) => theme.isDark ? '#0950B5' : 'white'};
    border: ${({ theme }) => theme.isDark ? '1px solid #000' : 'none'};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
  }
  & button {
    height: 40px;
    border-radius: 20px;
    &.active {
      color: white;
    }
  }
`

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <ButtonMenuWrapper>
      <ButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="subtle">
        <ButtonMenuItem className={activeIndex === 0 ? 'active' : ''}>{t('All History')}</ButtonMenuItem>
        <ButtonMenuItem className={activeIndex === 1 ? 'active' : ''}>{t('Your History')}</ButtonMenuItem>
      </ButtonMenu>
    </ButtonMenuWrapper>
  )
}

export default HistoryTabMenu
