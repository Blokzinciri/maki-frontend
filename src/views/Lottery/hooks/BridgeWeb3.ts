import ERC20_ABI from 'config/abi/erc20.json'
import getNodeUrl from 'utils/getRpcUrl'
import { ethers } from 'ethers'
import Web3 from 'web3'
import Tx from 'ethereumjs-tx'

const nodeRPC = 'https://rpc-mainnet.matic.quiknode.pro/'
const bridgeProvider = new ethers.providers.JsonRpcProvider(getNodeUrl())

const web3 = new Web3()

let mmWeb3;
if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
  // Web3 browser user detected. You can now use the provider.
  mmWeb3 = window.ethereum || window.web3.currentProvider
}

function MMsign (from, msg, node) {
  return new Promise(resolve => {
    const params = [from, msg]
    const method = 'eth_sign'
    mmWeb3.sendAsync({
      method,
      params,
    }, (err, rsv: any) => {
      let rsv1;
      if (!err || rsv.result) {
        rsv1 = rsv.result.indexOf('0x') === 0 ? rsv.result.replace('0x', '') : rsv.result
        let v = `0x${rsv1.substr(128)}`
        v = (Number(node) * 2 + 35 + parseInt(v) - 27).toString()
        resolve({
          msg: 'Success',
          info: {
            r: `0x${rsv1.substr(0, 64)}`,
            s: `0x${rsv1.substr(64, 64)}`,
            v: web3.utils.toHex(v)
          }
        })
      } else {
        console.log(err)
        resolve({
          msg: 'Error',
          error: err.message ? err.message : err.toString()
        })
      }
    })
  })
}

export default function MMsendERC20Txns(coin, from, to, value, PlusGasPricePercentage, node, inputCurrency) {
  return new Promise(resolve => {
    getBaseInfo(coin, from, to, value, PlusGasPricePercentage, node).then((res: any) => {
      console.log('res', res);
      if (res.msg === 'Success') {
        const tx = new Tx(res.info)

        let hash = Buffer.from(tx.hash(false)).toString('hex')
        hash = hash.indexOf('0x') === 0 ? hash : `0x${hash}`

        MMsign(from, hash, node).then((rsv: any) => {
          if (res.msg === 'Success') {
            const rawTx = {
              ...res.info,
              ...rsv.info
            }
            const tx2 = new Tx(rawTx)
            let signTx = tx2.serialize().toString("hex")
            signTx = signTx.indexOf("0x") === 0 ? signTx : (`0x${signTx}`)
            sendTxns(signTx, node).then((hash1: any) => {
              if (hash1.msg === 'Success') {
                res.info.hash = hash1.info
                resolve({
                  msg: 'Success',
                  info: res.info
                })
              } else {
                resolve({
                  msg: 'Error',
                  error: hash1.error
                })
              }
            })
          } else {
            resolve({
              msg: 'Error',
              error: rsv.error
            })
          }
        })
      } else {
        resolve({
          msg: 'Error',
          error: res.error
        })
      }
    })
  })
}

async function getBaseInfo (coin, from, to, value, PlusGasPricePercentage, node) {
  let input = ''
  const BridgeToken = {
    'XNFT': { // 
      'name': 'XNFT',
      'token': '0xE5944B50DF84001a36c7DE0d5Cb4da7ab21407D2',
      'decimals': 18,
    },
    'PLF': { // 
      'name': 'PLF',
      'token': '0x601464Aa0Df93e1FcB4afc96C0a615d546BAdC9f',
      'decimals': 18,
    },
    'PTT': {
      'name': 'PTT',
      'token': '0x7eed8a3ccfe3d507ec4df443773eae792b9ef2d7',
      'decimals': 18
    },
    'MAKI': {
      'name': 'MAKI',
      'token': '0x5fad6fbba4bba686ba9b8052cf0bd51699f38b93',
      'decimals': 18
    },
    'SOY': {
      'name': 'SOY',
      'token': '0xfb4c85b31b888e4f84ac131667865e029d6486f7',
      'decimals': 18
    },
    'HYN': {
      'name': 'HYN',
      'token': '0x3ac19481face71565155f370b3e34a1178745382',
      'decimals': 18
    },
    'PIPI': {
      'name': 'PIPI',
      'token': '0xaaae746b5e55d14398879312660e9fde07fbc1dc',
      'decimals': 18
    },
  }
  let isBridgeBaseCoin = false
  if (
    (coin === 'ETH' && (node === 1 || node === 4)) || 
    (coin === 'FSN' && (node === 32659 || node === 46688)) ||
    (coin === 'BNB' && (node === 97 || node === 56)) ||
    (coin === 'HT' && (node === 128 || node === 256)) ||
    (coin === 'FTM' && (node === 250)) ||
    (coin === 'ONE' && (node === 1666600000)) ||
    (coin === 'MOVR' && (node === 1285))
  ) {
    isBridgeBaseCoin = true
  }
  if (!isBridgeBaseCoin) {
    const signer = bridgeProvider.getSigner(from)
    const contract = new ethers.Contract(BridgeToken[coin].token, ERC20_ABI, signer)
    try {
      const tAmount = ethers.utils.parseUnits(value.toString(), BridgeToken[coin].decimals)
      const transferToken = await contract.transfer(to, tAmount)
      input = transferToken.data
    } catch (e) {
      return {
        msg: 'Error',
        error: e
      }
    }
  } else {
    value = ethers.utils.parseUnits(value.toString(), 18)
  }
  const data = {
    from,
    chainId: Number(web3.utils.toHex(node)),
    gas: '',
    gasPrice: "",
    nonce: 0,
    to: isBridgeBaseCoin ? to : BridgeToken[coin].token,
    value: isBridgeBaseCoin ? value.toHexString() : "0x0",
    data: input
  }
  let count = 0;

  try {
    const gasData = await bridgeProvider.estimateGas(data)
    data.gas = web3.utils.toHex(Number(gasData) * 1.2)
  } catch (e) {
    data.gas = web3.utils.toHex(90000)
  } finally {
    count++
  }

  try {
    const transactionCount = await bridgeProvider.getTransactionCount(from)
    data.nonce = Number(web3.utils.toHex(transactionCount))
    count++
  } catch (e) {
    return {
      msg: 'Error',
      error: e
    }
  }

  try {
    const gasPrice = await bridgeProvider.getGasPrice()
    let percent = 1;
    if (PlusGasPricePercentage) {
      percent = (100 + PlusGasPricePercentage) / 100
    }
    data.gasPrice = gasPrice.toString()
    count ++
  } catch (e) {
    return {
      msg: 'Error',
      error: e
    }
  }

  return {
    msg: 'Success',
    info: data
  }
}

function sendTxns (signedTx, node) {
  return new Promise(resolve => {
    web3.setProvider(nodeRPC)
    web3.eth.sendSignedTransaction(signedTx, (err, hash) => {
      // console.log(err)
      // console.log(hash)
      if (err) {
        resolve({
          msg: 'Error',
          error: err
        })
      } else {
        resolve({
          msg: 'Success',
          info: hash
        })
      }
    })
  })
}
