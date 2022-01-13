const { rpcUrl } = require('../config')
const Fetcher = require('./Fetcher')
const Sender = require('./sender')
const web3 = require('./setupWeb3')
const fetcher = new Fetcher(web3)
const sender = new Sender(web3)

module.exports = {
  fetcher,
  web3,
  sender
}
