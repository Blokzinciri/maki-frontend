import { useCallback } from 'react'
import axios from 'axios'
import { AppState, AppDispatch } from 'state'
import { useSelector, useDispatch } from 'react-redux'
import { Token, ISWAP_API_URL, mapChainIdToNames, PROVIDERS } from 'views/Bridge/constant'
import { aggCall } from 'views/Bridge/utils'
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

export const useBridgeActionHandlers = (): {
  onSelectInToken: (token: Token) => void
  onSelectOutToken: (token: Token) => void
  onMax: (maxAmount: string) => void
  onChangeInTokenAmount: (amount: string) => void
  onChangeOutTokenAmount: (amount: string) => void
  handleGetTradeInfo: (params: any) => void
  setTradeLimit: (chainId: number, data: { max: number; min: number }) => void
} => {
  const dispatch = useDispatch<AppDispatch>()
  const { inToken, outToken, inAmount, outAmount } = useBridgeState()

  const handleGetTradeInfo = useCallback(
    (params: any) => {
      dispatch(setBridgeInfoLoading(true))
      axios.post(`${ISWAP_API_URL}/get-trade-info`, params).then((result) => {
        if (result.data.code === 0) {
          if (inToken.chainId === outToken.chainId) {
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
            dispatch(setBridgeInfoLoading(false))
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
    [dispatch, inToken, outToken],
  )

  const onSelectInToken = useCallback(
    (token) => {
      dispatch(setInToken(token))

      if (outToken) {
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
            amount: '',
          },
          direct: 'src',
        }

        handleGetTradeInfo(params)
      }
    },
    [dispatch, outToken, inAmount, handleGetTradeInfo],
  )

  const onSelectOutToken = useCallback(
    (token) => {
      dispatch(setOutToken(token))

      if (inToken) {
        const params = {
          inToken: {
            chain: inToken.chainId,
            address: inToken.address,
            decimals: inToken.decimals,
            symbol: inToken.symbol,
          },
          outToken: {
            chain: token.chainId,
            address: token.address,
            decimals: token.decimals,
            symbol: token.symbol,
            amountOut: outAmount,
          },
          direct: 'dest',
        }

        handleGetTradeInfo(params)
      }
    },
    [dispatch, inToken, outAmount, handleGetTradeInfo],
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

        handleGetTradeInfo(params)
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

        handleGetTradeInfo(params)
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

        handleGetTradeInfo(params)
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

  return {
    onSelectInToken,
    onSelectOutToken,
    onMax,
    onChangeInTokenAmount,
    onChangeOutTokenAmount,
    handleGetTradeInfo,
    setTradeLimit,
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
