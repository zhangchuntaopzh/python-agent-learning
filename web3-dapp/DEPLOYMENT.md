# Sepolia 部署

1. 安装 Foundry：`curl -L https://foundry.paradigm.xyz | bash && foundryup`
2. 复制 `.env.example` 为 `.env`，填写 Sepolia RPC 地址与**测试钱包**私钥。
3. 领取 Sepolia 测试 ETH；它只用于支付 Gas。
4. 编译：`forge build`
5. 部署：`forge create contracts/MessageBoard.sol:MessageBoard --rpc-url "$SEPOLIA_RPC_URL" --private-key "$PRIVATE_KEY" --broadcast`
6. 将输出的合约地址替换到 `frontend/src/contract.ts` 的 `contractAddress`。

交易过程：钱包使用私钥对交易签名；RPC 广播已签名交易；验证者执行合约并消耗 Gas；确认后前端可读取新状态。私钥只存在本地 `.env`，绝不提交。
