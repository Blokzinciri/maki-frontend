import { createAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import { Token } from 'views/Bridge/constant'
import { BridgeInfo } from './types'

export const addCustomToken = createAction<{
  token: Token
  chainId: number
}>('bridge/addCustomToken')

export const removeCustomToken = createAction<{
  token: Token
  chainId: number
}>('bridge/removeCustomToken')

export const setCustomToken = createAction<Token>('bridge/setCustomToken')

export const setInToken = createAction<Token>('bridge/setInToken')
export const setOutToken = createAction<Token>('bridge/setOutToken')

export const setInAmount = createAction<string>('bridge/setInAmount')
export const setOutAmount = createAction<string>('bridge/setOutAmount')

export const setBridgeInfo = createAction<BridgeInfo>('bridge/setBridgeInfo')
export const setBridgeInfoLoading = createAction<boolean>('bridge/setBridgeInfoLoading')

export const setInTolerance = createAction<number>('bridge/setInTolerance')
export const setOutTolerance = createAction<number>('bridge/setOutTolerance')
export const setUserDeadline = createAction<number>('bridge/setUserDeadline')

export const updateTradeLimit =
  createAction<{ chainId: number; data: { max: number; min: number } }>('bridge/updateTradeLimit')

export const setSwapState = createAction<{ isSwapping: boolean; txhash: string }>('bridge/setSwapState')
