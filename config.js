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
          0.1: "0x69ADD7A9a222447e857ac3926F7B87dD0868A13c",
          1: "0x5F7b0bC185eF688D15ab0bD0320DD7C0D7A567Cc",
        },
        symbol: 'ETH',
        decimals: 18
      },
    },
    netId4: {
      eth: {
        mixerAddress: {
          0.1: "0x21A85A1F70Cf0EDC3ee4B91d479011deef2193F1",
          1: "0x2132986d56F4737920d11fCec3dCAa0e9AbE6EC9",
          10: "0x6D6Ec1443fEe828A64DaD87B28195B2661c846E8",
          100: "0x73b39BEBdfAf0bbD19bAA1a0aFE26AF9BA54c2Ea"
        },
        symbol: 'ETH',
        decimals: 18
      }
    },
    netId42: {
      eth: {
        mixerAddress: {
          0.1: "0x21A85A1F70Cf0EDC3ee4B91d479011deef2193F1",
          1: "0x2132986d56F4737920d11fCec3dCAa0e9AbE6EC9",
          10: "0x6D6Ec1443fEe828A64DaD87B28195B2661c846E8",
          100: "0x73b39BEBdfAf0bbD19bAA1a0aFE26AF9BA54c2Ea"
        },
        symbol: 'ETH',
        decimals: 18
      }
    },
    netId80001: {
      matic: {
        mixerAddress: {
          0.1: "0x21A85A1F70Cf0EDC3ee4B91d479011deef2193F1",
          1: "0x2132986d56F4737920d11fCec3dCAa0e9AbE6EC9",
          10: "0x6D6Ec1443fEe828A64DaD87B28195B2661c846E8",
          100: "0x73b39BEBdfAf0bbD19bAA1a0aFE26AF9BA54c2Ea"
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