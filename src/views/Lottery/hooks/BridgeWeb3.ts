import ERC20_ABI from 'config/abi/erc20.json'
import { ethers } from 'ethers'

const Web3 = require('web3')
const Tx  = require("ethereumjs-tx")
const nodeRPC = 'https://maticnode1.anyswap.exchange'

const web3 = new Web3()
let contract = new web3.eth.Contract(ERC20_ABI)

let mmWeb3
if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
  // Web3 browser user detected. You can now use the provider.
  mmWeb3 = window['ethereum'] || window.web3.currentProvider
}

function MMsign (from, msg, node) {
  return new Promise(resolve => {
    var params = [from, msg]
    var method = 'eth_sign'
    mmWeb3.sendAsync({
      method,
      params,
      // from,
    }, (err, rsv) => {
      // console.log(rsv)
      if (!err || rsv.result) {
        rsv = rsv.result.indexOf('0x') === 0 ? rsv.result.replace('0x', '') : rsv.result
        let v = '0x' + rsv.substr(128)
        v = (Number(node) * 2 + 35 + parseInt(v) - 27).toString()
        // console.log(v)
        resolve({
          msg: 'Success',
          info: {
            r: '0x' + rsv.substr(0, 64),
            s: '0x' + rsv.substr(64, 64),
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

export function MMsendERC20Txns(coin, from, to, value, PlusGasPricePercentage, node, inputCurrency) {
  return new Promise(resolve => {
    getBaseInfo(coin, from, to, value, PlusGasPricePercentage, node).then((res: any) => {
      if (res.msg === 'Success') {
        // let eTx = new Tx(res.info)
        // console.log(eTx)
        // console.log(res.info)
        let tx = new Tx(res.info)

        let hash = Buffer.from(tx.hash(false)).toString('hex')
        hash = hash.indexOf('0x') === 0 ? hash : '0x' + hash
        // console.log(hash)

        MMsign(from, hash, node).then((rsv: any) => {
          // console.log(rsv)
          if (res.msg === 'Success') {
            let rawTx = {
              ...res.info,
              ...rsv.info
            }
            let tx2 = new Tx(rawTx)
            let signTx = tx2.serialize().toString("hex")
            signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
            // console.log(rawTx)
            // console.log(signTx)
            sendTxns(signTx, node).then((hash: any) => {
              if (hash.msg === 'Success') {
                res.info.hash = hash.info
                resolve({
                  msg: 'Success',
                  info: res.info
                })
              } else {
                resolve({
                  msg: 'Error',
                  error: hash.error
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

function getBaseInfo (coin, from, to, value, PlusGasPricePercentage, node) {
  let input = ''
  let BridgeToken = {
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
  console.log(node)
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
    contract.options.address = BridgeToken[coin].token
    value = ethers.utils.parseUnits(value.toString(), BridgeToken[coin].decimals)
    input = contract.methods.transfer(to, value).encodeABI()
  } else {
    value = ethers.utils.parseUnits(value.toString(), 18)
  }
  // console.log(value)
  let data = {
    from,
    chainId: web3.utils.toHex(node),
    gas: '',
    gasPrice: "",
    nonce: "",
    to: isBridgeBaseCoin ? to : BridgeToken[coin].token,
    value: isBridgeBaseCoin ? value.toHexString() : "0x0",
    data: input
  }
  web3.setProvider(nodeRPC)
  // console.log(data)
  return new Promise(resolve => {
    let count = 0, time = Date.now()
    const batch = new web3.BatchRequest()
    batch.add(web3.eth.estimateGas.request(data, (err, res) => {
      if (err) {
        // console.log(err)
        data.gas = web3.utils.toHex(90000)
        count ++
      } else {
        // console.log(parseInt(Number(res) * 1.1))
        data.gas = web3.utils.toHex(Number(res) * 1.2)
        count ++
      }
    }))
    batch.add(web3.eth.getTransactionCount.request(from, (err, res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(2)
        // let nonce = web3.utils.hexToNumber(res)
        // data.nonce = web3.utils.toHex(nonce + 1)
        data.nonce = web3.utils.toHex(res)
        // data.nonce = web3.utils.toHex(2)
        count ++
      }
    }))
    batch.add(web3.eth.getGasPrice.request((err, res) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(res)
        // console.log(PlusGasPricePercentage)
        let pecent = 1
        if (PlusGasPricePercentage) {
          pecent = (100 + PlusGasPricePercentage) / 100
        }
        let _gasPrice = pecent * parseInt(res)
        data.gasPrice = web3.utils.toHex(_gasPrice)
        count ++
      }
    }))
    batch.execute()
    let getDataIntervel = setInterval(() => {
      if (count >= 3 && ( (Date.now() - time) <= 30000 )) {
        resolve({
          msg: 'Success',
          info: data
        })
        clearInterval(getDataIntervel)
      } else if (count < 3 && ( (Date.now() - time) > 30000 )) {
        resolve({
          msg: 'Error',
          error: 'Timeout'
        })
        clearInterval(getDataIntervel)
      }
    }, 1000)
  })
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
