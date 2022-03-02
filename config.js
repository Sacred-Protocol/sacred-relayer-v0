require('dotenv').config()

module.exports = {
  netId: Number(process.env.NET_ID) || 42,
  redisUrl: process.env.REDIS_URL,
  rpcUrl: process.env.RPC_URL || 'https://kovan.infura.io/',
  oracleRpcUrl: process.env.ORACLE_RPC_URL || 'https://mainnet.infura.io/',
  oracleAddress: '0xA2b8E7ee7c8a18ea561A5CF7C9C365592026E374',
  privateKey: process.env.PRIVATE_KEY,
  mixers: {
    netId4: {
      eth: {
        mixerAddress: {
          0.1: "0x8e1657ffdf84Ef90c25E8dc465Fa23127f4185Ef",
          1: "0xf88BD8230A9e3Ad6cEE4A14B5B5D834084E80371",
          10: "0x0415F93a1b846EB4471681680f948b34BcEb9156",
          100: "0xC18b26cC6C19BcEBbfdC456029eE93181e933BfD"
        },
        symbol: 'ETH',
        decimals: 18
      }
    },
    netId42: {
      eth: {
        mixerAddress: {
          0.1: "0xaAa355c04bee5D0dAd9f774F30c0Fb49FEdF252e",
          1: "0x147A4B5a098d71E457030E2F0631a00e62680102",
          10: "0x13742E4Ed90B6ff8B73A763670ae6FAbb250767c",
          100: "0x6944D64CC1487a2715EE35aef617f8767DF0815e"
        },
        symbol: 'ETH',
        decimals: 18
      }
    },
    netId80001: {
      eth: {
        mixerAddress: {
          0.1: "0x91CCB886d9E0A916c76eE17cD311A276d1a4C40f",
          1: "0x1731094433BE73250707bDF94FdB4B1bf0BDbAca",
          10: "0x28c62C78A015Ce6505dFD594D90A6a43dA3068Bd",
          100: "0x2588DaA1892A858C83E7a1Ba8b0f996Cc30877d1"
        },
        symbol: 'MATIC',
        decimals: 18
      }
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
