import React from 'react'

import IfoFoldableCard from './components/IfoFoldableCard'
import IfoLayout from './components/IfoLayout'
import IfoSteps from './components/IfoSteps'
import IfoQuestions from './components/IfoQuestions'

/**
 * Note: currently there should be only 1 active IFO at a time
 */
// const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const Ifo = () => {
  return (
    <IfoLayout id="current-ifo">
      <IfoFoldableCard />
      <IfoSteps />
      <IfoQuestions />
    </IfoLayout>
  )
}

export default Ifo
