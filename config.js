require('dotenv').config()

module.exports = {
  netId: Number(process.env.NET_ID) || 42,
  redisUrl: process.env.REDIS_URL,
  rpcUrl: process.env.RPC_URL || 'https://kovan.infura.io/',
  oracleRpcUrl: process.env.ORACLE_RPC_URL || 'https://mainnet.infura.io/',
  oracleAddress: '0xA2b8E7ee7c8a18ea561A5CF7C9C365592026E374',
  privateKey: process.env.PRIVATE_KEY,
  mixers: {
    netId1: {
      eth: {
        mixerAddress: {
          '0.1': '0x0',
          '1': '0x0',
          '10': '0x0',
          '100': '0x0'
        },
        symbol: 'ETH',
        decimals: 18
      },
    },
    netId42: {
      eth: {
        mixerAddress: {
          '0.1': '0xf43D169bd8feCc36344a08669620FB29490E677c',
          '1': '0x045A42f9396Dfb3798f8F75C3F8625738dC3b041',
          '10': '0x075a48b34C2e4665B1F7C2ED118E55337ed0067E',
          '100': '0x90c4758c345172a665CAc7C41180fc4D46ce6079'
        },
        symbol: 'ETH',
        decimals: 18
      },
    }
  },
  defaultGasPrice: 20,
  port: process.env.APP_PORT,
  relayerServiceFee: Number(process.env.RELAYER_FEE),
  maxGasPrice: process.env.MAX_GAS_PRICE || 200,
  watherInterval: Number(process.env.NONCE_WATCHER_INTERVAL || 30) * 1000,
  pendingTxTimeout: Number(process.env.ALLOWABLE_PENDING_TX_TIMEOUT || 180) * 1000,
  gasBumpPercentage: process.env.GAS_PRICE_BUMP_PERCENTAGE || 20
}
