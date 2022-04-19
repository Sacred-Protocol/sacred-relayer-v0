const { redisClient } = require('./redis')
const config = require('../config')
const { toBN, toHex, toWei, BN, fromWei } = require('web3-utils')

class Sender {
  constructor(web3) {
    this.web3 = web3
    this.watherInterval = config.watherInterval
    this.pendingTxTimeout = config.pendingTxTimeout
    this.gasBumpPercentage = 100 + Number(config.gasBumpPercentage)
    this.watcher()
  }

  async watcher() {
    try {
      const networkNonce = await this.web3.eth.getTransactionCount(this.web3.eth.defaultAccount)
      let tx = await redisClient.get('tx:' + networkNonce)
      console.log('networkNonce', networkNonce);
      if (tx) {
        tx = JSON.parse(tx)
        console.log('txDate', tx.date);
        console.log('pendingTxTimeout', this.pendingTxTimeout);

        if ((Date.now() - tx.date) > this.pendingTxTimeout) {
          console.log('tx.gasPrice', tx.gasPrice);
          console.log('gasBumpPercentage', this.gasBumpPercentage);
          console.log('config.maxGasPrice', config.maxGasPrice);
          const newGasPrice = toBN(tx.gasPrice).mul(toBN(this.gasBumpPercentage)).div(toBN(100));
          console.log('newGasPrice', newGasPrice);
          const maxGasPrice = toBN(toWei(config.maxGasPrice.toString(), 'Gwei'))
          console.log('maxGasPrice', maxGasPrice);
          tx.gasPrice = toHex(BN.min(newGasPrice, maxGasPrice))
          tx.date = Date.now()
          await redisClient.set('tx:' + tx.nonce, JSON.stringify(tx))
          console.log('resubmitting with gas price', fromWei(tx.gasPrice.toString(), 'gwei'), ' gwei')
          this.sendTx(tx, null, 9999)
        }
      }
    } catch (e) {
      console.error('watcher error:', e)
    } finally {
      setTimeout(() => this.watcher(), this.watherInterval)
    }
  }

  async sendTx(tx, done, retryAttempt = 1) {
    let signedTx = await this.web3.eth.accounts.signTransaction(tx, config.privateKey)
    let result = this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)

    result
      .once('transactionHash', (txHash) => {
        console.log(`A new successfully sent tx ${txHash}`)
        if (done) {
          done(null, {
            status: 200,
            msg: { txHash }
          })
        }
      })
      .on('error', async (e) => {
        console.log(`Error for tx with nonce ${tx.nonce}\n${e.message}`)
        if (
          e.message ===
            'Returned error: Transaction gas price supplied is too low. There is another transaction with same nonce in the queue. Try increasing the gas price or incrementing the nonce.' ||
          e.message === 'Returned error: Transaction nonce is too low. Try incrementing the nonce.' ||
          e.message === 'Returned error: nonce too low' ||
          e.message === 'Returned error: replacement transaction underpriced'
        ) {
          console.log('nonce too low, retrying')
          if (retryAttempt <= 10) {
            retryAttempt++
            const newNonce = tx.nonce + 1
            tx.nonce = newNonce
            await redisClient.set('nonce', newNonce)
            await redisClient.set('tx:' + newNonce, JSON.stringify(tx))
            this.sendTx(tx, done, retryAttempt)
            return
          }
        }
        if (done) {
          done(null, {
            status: 400,
            msg: { error: 'Internal Relayer Error. Please use a different relayer service' }
          })
        }
      })
  }
}

module.exports = Sender
