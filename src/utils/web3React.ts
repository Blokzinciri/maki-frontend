import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { ConnectorNames } from 'maki-toolkit'
import { ethers } from 'ethers'
import getNodeUrl, { getNodeUrlMatic } from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
const rpcUrlMatic = getNodeUrlMatic()
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const chainIdMatic = 137

const injected = new InjectedConnector({ supportedChainIds: [chainId, chainIdMatic] })

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl, [chainIdMatic]: rpcUrlMatic },
  // bridge: 'https://pancakeswap.bridge.walletconnect.org/',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}
