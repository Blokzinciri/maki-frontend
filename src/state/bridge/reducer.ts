import { createReducer } from '@reduxjs/toolkit'
import { Token } from 'views/Bridge/constant'
import { BridgeInfo, TradeLimit } from './types'

import {
  addCustomToken,
  removeCustomToken,
  setBridgeInfo,
  setBridgeInfoLoading,
  setCustomToken,
  setInAmount,
  setInToken,
  setInTolerance,
  setOutAmount,
  setOutToken,
  setOutTolerance,
  setUserDeadline,
  updateTradeLimit,
} from './actions'

interface CustomTokens {
  56: Token[]
  128: Token[]
  137: Token[]
  66: Token[]
  1: Token[]
}

export interface BrideState {
  customTokens: CustomTokens
  tempToken: Token
  inToken: Token
  outToken: Token
  inAmount: string
  outAmount: string
  bridgeInfo: BridgeInfo
  inTolerance: number
  outTolerance: number
  userDeadline: number
  tradeLimit: TradeLimit
  infoLoading: boolean
}

const initialState: BrideState = {
  customTokens: {
    56: [],
    128: [],
    137: [],
    66: [],
    1: [],
  },
  tempToken: null,
  inToken: null,
  outToken: null,
  inAmount: '',
  outAmount: '',
  bridgeInfo: null,
  inTolerance: 50, // 0.5%
  outTolerance: 100, // 1%
  userDeadline: 300, // 5 minutes,
  tradeLimit: {
    128: { max: 0, min: 0 },
    56: { max: 0, min: 0 },
    137: { max: 0, min: 0 },
    66: { max: 0, min: 0 },
    1: { max: 0, min: 0 },
  },
  infoLoading: false,
}

export default createReducer<BrideState>(initialState, (builder) =>
  builder
    .addCase(addCustomToken, (state, { payload: { token, chainId } }) => {
      const { customTokens } = state
      if (customTokens[chainId].findIndex((customToken) => customToken.address === token.address) === -1) {
        customTokens[chainId].push(token)
      }
      state.tempToken = null
    })
    .addCase(removeCustomToken, (state, { payload: { token, chainId } }) => {
      const { customTokens } = state

      const index = customTokens[chainId].findIndex(
        (item) => item.address.toLowerCase() === token.address.toLowerCase(),
      )
      if (index !== -1) {
        customTokens[chainId].splice(index, 1)
      }
    })
    .addCase(setCustomToken, (state, { payload }) => {
      return {
        ...state,
        tempToken: payload,
      }
    })
    .addCase(setInToken, (state, { payload }) => {
      return {
        ...state,
        inToken: payload,
      }
    })
    .addCase(setOutToken, (state, { payload }) => {
      return {
        ...state,
        outToken: payload,
      }
    })
    .addCase(setInAmount, (state, { payload }) => {
      return {
        ...state,
        inAmount: payload,
      }
    })
    .addCase(setOutAmount, (state, { payload }) => {
      return {
        ...state,
        outAmount: payload,
      }
    })
    .addCase(setBridgeInfo, (state, { payload }) => {
      return {
        ...state,
        inAmount: payload.inToken.amount,
        outAmount: payload.outToken.amountOut,
        bridgeInfo: payload,
      }
    })
    .addCase(setInTolerance, (state, { payload }) => {
      return {
        ...state,
        inTolerance: payload,
      }
    })
    .addCase(setOutTolerance, (state, { payload }) => {
      return {
        ...state,
        outTolerance: payload,
      }
    })
    .addCase(setUserDeadline, (state, { payload }) => {
      return {
        ...state,
        userDeadline: payload,
      }
    })
    .addCase(updateTradeLimit, (state, { payload: { chainId, data } }) => {
      const { tradeLimit } = state
      tradeLimit[chainId] = data
    })
    .addCase(setBridgeInfoLoading, (state, { payload }) => {
      return {
        ...state,
        infoLoading: payload,
      }
    }),
)
