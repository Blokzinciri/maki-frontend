import React from 'react'
import styled from 'styled-components'
import chainNames from 'config/constants/chainNames'

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`
const Tab = styled.div<{ isActive: boolean }>`
  padding: 0.25rem 0.375rem;
  text-align: center;

  color: ${({ isActive }) => (isActive ? '#246EFF' : 'inherit')};
  background: ${({ isActive }) => (isActive ? 'rgba(36, 110, 255, 0.1)' : 'inherit')};
  border-radius: 0.25rem;
  cursor: pointer;
`

interface Props {
  selectedChainId: number
  handleChangeChain: (chainId: number) => void
}

const ChainSelector: React.FC<Props> = ({ selectedChainId, handleChangeChain }) => {
  return (
    <Tabs>
      {Object.keys(chainNames).map((chainId) => {
        return (
          <Tab
            key={chainId}
            onClick={() => handleChangeChain(Number(chainId))}
            isActive={selectedChainId === Number(chainId)}
          >
            {chainNames[chainId]}
          </Tab>
        )
      })}
    </Tabs>
  )
}

export default ChainSelector
