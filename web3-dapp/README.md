# 链上留言板 dApp

学习项目：Solidity 合约读写、MetaMask 钱包连接、Viem 交易、Gas 估算与 Sepolia 部署。

真实部署前复制 `.env.example` 为 `.env`，填写 `SEPOLIA_RPC_URL`、`PRIVATE_KEY`；永远不要提交 `.env`。

合约核心：`post(text)` 是写入交易，需钱包签名和 Gas；`count()` 与 `getMessage(index)` 是免费读取。
