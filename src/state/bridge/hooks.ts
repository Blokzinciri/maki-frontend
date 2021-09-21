import { useCallback } from 'react'
import axios from 'axios'
import { AppState, AppDispatch } from 'state'
import { useSelector, useDispatch } from 'react-redux'
import { Token, ISWAP_API_URL, mapChainIdToNames, PROVIDERS, FetchStatus } from 'views/Bridge/constant'
import { swap } from 'views/Bridge/utils'
import { useActiveWeb3React } from 'hooks'

import {
  setInAmount,
  setOutAmount,
  setInToken,
  setOutToken,
  setBridgeInfo,
  setInTolerance,
  setOutTolerance,
  setUserDeadline,
  updateTradeLimit,
  setBridgeInfoLoading,
  setSwapState,
} from './actions'

export const useBridgeState = (): AppState['bridge'] => {
  return useSelector<AppState, AppState['bridge']>((state) => state.bridge)
}

export const useTempToken = (): Token => {
  const { tempToken } = useBridgeState()
  return tempToken
}

export const useCustomTokens = (chainId): Token[] => {
  const { customTokens } = useBridgeState()

  return customTokens[chainId]
}

export const useInToken = (): Token => {
  const { inToken } = useBridgeState()
  return inToken
}

export const useOutToken = (): Token => {
  const { outToken } = useBridgeState()
  return outToken
}

const isSameToken = (tokenA: Token, tokenB: Token): boolean => {
  if (tokenA && tokenB) {
    return tokenA.address === tokenB.address && tokenA.chainId === tokenB.chainId
  }

  return false
}

export const useBridgeActionHandlers = (): {
  onSelectInToken: (token: Token) => void
  onSelectOutToken: (token: Token) => void
  onMax: (maxAmount: string) => void
  onChangeInTokenAmount: (amount: string) => void
  onChangeOutTokenAmount: (amount: string) => void
  handleGetTradeInfo: (params: any, tokenIn: Token, tokenOut: Token) => void
  setTradeLimit: (chainId: number, data: { max: number; min: number }) => void
  onSwap: (chainId: number) => void
} => {
  const dispatch = useDispatch<AppDispatch>()
  const bridgeState = useBridgeState()
  const { inToken, outToken, inAmount, outAmount } = bridgeState
  const { account } = useActiveWeb3React()

  const handleGetTradeInfo = useCallback(
    (params: any, tokenIn: Token, tokenOut: Token) => {
      dispatch(setBridgeInfoLoading(true))
      axios.post(`${ISWAP_API_URL}/get-trade-info`, params).then((result) => {
        if (result.data.code === 0) {
          if (tokenIn.chainId === tokenOut.chainId) {
            dispatch(
              setBridgeInfo({
                code: result.data.code,
                inToken: {
                  ...result.data.data,
                },
                outToken: {
                  ...result.data.data,
                },
              }),
            )
            return
          }

          dispatch(
            setBridgeInfo({
              code: result.data.code,
              ...result.data.data,
            }),
          )
        }
      })
    },
    [dispatch],
  )

  const onSelectInToken = useCallback(
    (token) => {
      if (isSameToken(token, outToken)) {
        return
      }
      dispatch(setInToken(token))
      if (outToken) {
        const isDest = inAmount.length === 0
        const params = {
          inToken: {
            chain: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            amount: inAmount,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            amountOut: isDest ? outAmount : '',
          },
          direct: isDest ? 'dest' : 'src',
        }

        handleGetTradeInfo(params, token, outToken)
      }
    },
    [dispatch, outToken, inAmount, outAmount, handleGetTradeInfo],
  )

  const onSelectOutToken = useCallback(
    (token) => {
      if (isSameToken(token, inToken)) {
        return
      }
      dispatch(setOutToken(token))

      if (inToken) {
        const isSrc = outAmount.length === 0
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            amount: isSrc ? inAmount : '',
          },
          outToken: {
            chain: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            amountOut: outAmount,
          },
          direct: isSrc ? 'src' : 'dest',
        }

        handleGetTradeInfo(params, inToken, token)
      }
    },
    [dispatch, inToken, outAmount, inAmount, handleGetTradeInfo],
  )

  const onChangeInTokenAmount = useCallback(
    (amount: string) => {
      dispatch(setInAmount(amount))

      if (outToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            amount,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            amount: '',
          },
          direct: 'src',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo],
  )

  const onChangeOutTokenAmount = useCallback(
    (amount: string) => {
      dispatch(setOutAmount(amount))

      if (inToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            amountOut: amount,
          },
          direct: 'dest',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo],
  )

  const onMax = useCallback(
    (maxAmount: string) => {
      dispatch(setInAmount(maxAmount))

      if (outToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
            amount: maxAmount,
          },
          outToken: {
            chain: outToken.chainId,
            address: outToken.address,
            decimals: outToken.decimals,
            symbol: outToken.symbol,
            amount: '',
          },
          direct: 'src',
        }

        handleGetTradeInfo(params, inToken, outToken)
      }
    },
    [dispatch, inToken, outToken, handleGetTradeInfo],
  )

  const setTradeLimit = useCallback(
    (chainId: number, data) => {
      dispatch(
        updateTradeLimit({
          chainId,
          data,
        }),
      )
    },
    [dispatch],
  )

  const onSwap = useCallback(
    (chainId: number) => {
      dispatch(setSwapState({ isSwapping: true, txhash: null }))
      swap(bridgeState, account, chainId).then(([err, data]) => {
        if (err === FetchStatus.SUCCESS) {
          dispatch(setSwapState({ isSwapping: false, txhash: data }))
          return
        }

        dispatch(setSwapState({ isSwapping: false, txhash: null }))
      })
    },
    [bridgeState, account, dispatch],
  )

  return {
    onSelectInToken,
    onSelectOutToken,
    onMax,
    onChangeInTokenAmount,
    onChangeOutTokenAmount,
    handleGetTradeInfo,
    setTradeLimit,
    onSwap,
  }
}

export const useInSlippageTolerance = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { inTolerance: userSlippageTolerance } = useBridgeState()

  const setUserSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(setInTolerance(slippageTolerance))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export const useOutSlippageTolerance = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { outTolerance: userSlippageTolerance } = useBridgeState()

  const setUserSlippageTolerance = useCallback(
    (slippageTolerance: number) => {
      dispatch(setOutTolerance(slippageTolerance))
    },
    [dispatch],
  )

  return [userSlippageTolerance, setUserSlippageTolerance]
}

export const useUserDeadline = (): [number, (slippage: number) => void] => {
  const dispatch = useDispatch<AppDispatch>()
  const { userDeadline } = useBridgeState()

  const setDeadline = useCallback(
    (deadline: number) => {
      dispatch(setUserDeadline(deadline))
    },
    [dispatch],
  )

  return [userDeadline, setDeadline]
}
