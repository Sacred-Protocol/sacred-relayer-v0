const { rpcUrl } = require('../config')
const Fetcher = require('./Fetcher')
const Sender = require('./sender')
const web3 = require('./setupWeb3')
const fetcher = new Fetcher(web3)
const sender = new Sender(web3);
const { GasPriceOracle } = require('gas-price-oracle');
const gasPriceOracle = new GasPriceOracle({ defaultRpc: rpcUrl })

module.exports = {
  fetcher,
  web3,
  sender,
  gasPriceOracle
}
