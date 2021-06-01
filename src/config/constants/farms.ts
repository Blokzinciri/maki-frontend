import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: 'MAKI-HT',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad', // UPDATE
      128: '0xC923E7Dd24A96Da2136Cbc3C99F544F225A46424', // UPDATED
    },
    tokenSymbol: 'MAKI',
    tokenAddresses: {
      256: '0x6858a26bBBc8e185274969f6baf99674929Cf766', // UPDATED
      128: '0x5FaD6fBBA4BbA686bA9B8052Cf0bd51699f38B93', // UPDATED - ABI UPDATED
    },
    quoteTokenSymbol: QuoteToken.HT,
    quoteTokenAdresses: contracts.wht,
  },
  {
    pid: 2,
    lpSymbol: 'LAYER-HT',
    lpAddresses: {
      256: '0xa0af5d360232e077decfd4650e8b95875fdd6aad', // Is correct?
      128: '0xc189d2699c7e077cb050d9bc666effa40bb31771', // UPDATED
    },
    tokenSymbol: 'LAYER',
    tokenAddresses: {
      256: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c', // UPDATE
      128: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c', // UPDATED - ABI UPDATED
    },
    quoteTokenSymbol: QuoteToken.HT,
    quoteTokenAdresses: contracts.wht,
  },
  {
    pid: 3,
    lpSymbol: 'MAKI-HUSD',
    lpAddresses: {
      256: '',
      128: '0x88b076F1C2EDcf558711a21639C15D01706938e8', // UPDATED
    },
    tokenSymbol: 'HUSD',
    tokenAddresses: {
      256: '',
      128: '0x0298c2b32eae4da002a15f36fdf7615bea3da047', // UPDATED - ABI UPDATED
    },
    quoteTokenSymbol: QuoteToken.MAKI,
    quoteTokenAdresses: contracts.maki,
  },
  {
    pid: 4,
    lpSymbol: 'HUSD-HT',
    lpAddresses: {
      256: '',
      128: '0x12cb243CFa46f1cb98B0EAe80a1e2f757eDE2b3A', // (29/5/21)
    },
    tokenSymbol: 'HUSD',
    tokenAddresses: {
      256: '', // 
      128: '0x0298c2b32eae4da002a15f36fdf7615bea3da047', // (29/5/21)
    },
    quoteTokenSymbol: QuoteToken.HT,
    quoteTokenAdresses: contracts.wht,
  },
  {
    pid: 5,
    lpSymbol: 'ETH-HUSD',
    lpAddresses: {
      256: '',
      128: '0xBdb405E580774F1AbA1273f22aF06c9B81433e87', // (30/5/21)
    },
    tokenSymbol: 'HUSD',
    tokenAddresses: {
      256: '', // 
      128: '0x0298c2b32eae4da002a15f36fdf7615bea3da047', // (30/5/21)
    },
    quoteTokenSymbol: QuoteToken.ETH,
    quoteTokenAdresses: contracts.eth,
  },
  {
    pid: 6,
    lpSymbol: 'BTC-HUSD',
    lpAddresses: {
      256: '',
      128: '0x901a89e02cd610c04d0feb45791dbf64b8c20503', // (31/5/21)
    },
    tokenSymbol: 'HUSD',
    tokenAddresses: {
      256: '', // 
      128: '0x0298c2b32eae4da002a15f36fdf7615bea3da047', // (31/5/21)
    },
    quoteTokenSymbol: QuoteToken.BTC,
    quoteTokenAdresses: contracts.btc,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-HT',
    lpAddresses: {
      256: '',
      128: '0x94c8C66670dE883c6667B8aa214c4961bFeeB04a', // (1/6/21)
    },
    tokenSymbol: 'USDT',
    tokenAddresses: {
      256: '', // 
      128: '0xa71EdC38d189767582C38A3145b5873052c3e47a' // (1/6/21)
    },
    quoteTokenSymbol: QuoteToken.HT,
    quoteTokenAdresses: contracts.wht,
  },
]

export default farms
