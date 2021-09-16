import { ChainId, Token } from 'maki-sdk'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS, UNSUPPORTED_TOKEN_LIST } from 'config/constants/lists'
import { AppState } from 'state'
import DEFAULT_TOKEN_LIST from 'config/constants/token/makiswap.json'
import ETH_TOKEN_LIST from 'config/constants/token/1.json'
import BNB_TOKEN_LIST from 'config/constants/token/56.json'
import OKT_TOKEN_LIST from 'config/constants/token/66.json'
import HUOBI_TOKEN_LIST from 'config/constants/token/128.json'
import POLYGON_TOKEN_LIST from 'config/constants/token/137.json'

const TOKENS = {
  1: ETH_TOKEN_LIST,
  56: BNB_TOKEN_LIST,
  66: OKT_TOKEN_LIST,
  128: HUOBI_TOKEN_LIST,
  137: POLYGON_TOKEN_LIST,
}

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

// use ordering of default list of lists to assign priority
function sortByListPriority(urlA: string, urlB: string) {
  const first = DEFAULT_LIST_OF_LISTS.includes(urlA) ? DEFAULT_LIST_OF_LISTS.indexOf(urlA) : Number.MAX_SAFE_INTEGER
  const second = DEFAULT_LIST_OF_LISTS.includes(urlB) ? DEFAULT_LIST_OF_LISTS.indexOf(urlB) : Number.MAX_SAFE_INTEGER

  // need reverse order to make sure mapping includes top priority last
  if (first < second) return 1
  if (first > second) return -1
  return 0
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo

  public readonly tags: TagInfo[]

  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }

  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{
  [chainId: string]: Readonly<{ [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList } }>
}>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.MAINNET]: {},
  [ChainId.TESTNET]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const LIST = {
    [Number(list.tokens[0].chainId)]: {},
  }

  const result = listCache?.get(list)
  if (result) return result

  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map((tagId) => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: {
            token,
            list,
          },
        },
      }
    },
    { ...LIST },
  )
  listCache?.set(list, map)
  return map
}

export function useAllLists(): {
  readonly [url: string]: {
    readonly current: TokenList | null
    readonly pendingUpdate: TokenList | null
    readonly loadingRequestId: string | null
    readonly error: string | null
  }
} {
  return useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
}

function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap, chainId = 128): TokenAddressMap {
  return {
    [chainId]: { ...map1[chainId], ...map2[chainId] },
    [ChainId.TESTNET]: { ...map1[ChainId.TESTNET], ...map2[ChainId.TESTNET] },
  }
}

// merge tokens contained within lists from urls
function useCombinedTokenMapFromUrls(urls: string[] | undefined, chainId = 128): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    const LIST = {
      [chainId]: {},
    }
    if (!urls) return LIST

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            const newTokens = Object.assign(listToTokenMap(current))
            return combineMaps(allTokens, newTokens, chainId)
          } catch (error) {
            console.error('Could not show token list due to error', error)
            return allTokens
          }
        }, LIST)
    )
  }, [lists, urls, chainId])
}

// filter out unsupported lists
export function useActiveListUrls(): string[] | undefined {
  return useSelector<AppState, AppState['lists']['activeListUrls']>((state) => state.lists.activeListUrls)?.filter(
    (url) => !UNSUPPORTED_LIST_URLS.includes(url),
  )
}

export function useInactiveListUrls(): string[] {
  const lists = useAllLists()
  const allActiveListUrls = useActiveListUrls()
  return Object.keys(lists).filter((url) => !allActiveListUrls?.includes(url) && !UNSUPPORTED_LIST_URLS.includes(url))
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(chainId): TokenAddressMap {
  const activeListUrls = useActiveListUrls()
  const activeTokens = useCombinedTokenMapFromUrls(activeListUrls)
  const defaultTokenMap = useDefaultTokenList(chainId)

  return combineMaps(activeTokens, defaultTokenMap, chainId)
}

// all tokens from inactive lists
export function useCombinedInactiveList(): TokenAddressMap {
  const allInactiveListUrls: string[] = useInactiveListUrls()
  return useCombinedTokenMapFromUrls(allInactiveListUrls)
}

// used to hide warnings on import for default tokens
export function useDefaultTokenList(chainId): TokenAddressMap {
  return listToTokenMap(TOKENS[String(chainId)])
}

// list of tokens not supported on interface, used to show warnings and prevent swaps and adds
export function useUnsupportedTokenList(): TokenAddressMap {
  // get hard coded unsupported tokens
  const localUnsupportedListMap = listToTokenMap(UNSUPPORTED_TOKEN_LIST)

  // get any loaded unsupported tokens
  const loadedUnsupportedListMap = useCombinedTokenMapFromUrls(UNSUPPORTED_LIST_URLS)

  // format into one token address map
  return combineMaps(localUnsupportedListMap, loadedUnsupportedListMap)
}

export function useIsListActive(url: string): boolean {
  const activeListUrls = useActiveListUrls()
  return Boolean(activeListUrls?.includes(url))
}

export function useTokenList(url: string | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>((state) => state.lists.byUrl)
  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url]?.current
    if (!current) return EMPTY_LIST
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
}

export function useSelectedListUrl(): string | undefined {
  return useSelector<AppState, AppState['lists']['selectedListUrl']>((state) => state.lists.selectedListUrl)
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListUrl())
}
