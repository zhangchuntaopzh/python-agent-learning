import 'dotenv/config'
// 使用 Foundry 编译后的 ABI 与 bytecode；部署前运行 forge build。
// 部署命令和地址记录见 DEPLOYMENT.md。
if (!process.env.SEPOLIA_RPC_URL || !process.env.PRIVATE_KEY) throw new Error('请先在 .env 配置 SEPOLIA_RPC_URL 和 PRIVATE_KEY')
console.log('部署脚本已读取测试网配置；请用 Foundry 的 forge script 执行实际广播。')
