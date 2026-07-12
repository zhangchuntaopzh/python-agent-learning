import { useState } from 'react'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'
import { contractAbi, contractAddress } from './contract'
const publicClient = createPublicClient({ chain: sepolia, transport: http() })
export default function App() {
  const [account, setAccount] = useState<string>(); const [message, setMessage] = useState(''); const [hash, setHash] = useState<string>(); const [count, setCount] = useState<string>()
  async function readCount() { const total = await publicClient.readContract({ address: contractAddress, abi: contractAbi, functionName: 'count' }); setCount(total.toString()) }
  async function connect() { const [address] = await createWalletClient({ chain: sepolia, transport: custom(window.ethereum!) }).requestAddresses(); setAccount(address) }
  async function post() { if (!window.ethereum || !message) return; const wallet = createWalletClient({ chain: sepolia, transport: custom(window.ethereum) }); const gas = await publicClient.estimateContractGas({ address: contractAddress, abi: contractAbi, functionName: 'post', args: [message], account: account as `0x${string}` }); const tx = await wallet.writeContract({ address: contractAddress, abi: contractAbi, functionName: 'post', args: [message], account: account as `0x${string}`, gas }); setHash(tx) }
  return <main><h1>链上留言板</h1><button onClick={connect}>{account ? account : '连接 MetaMask'}</button><p>写入交易需要签名和 Gas；读取合约不需要签名。</p><button onClick={readCount}>读取留言数量</button>{count && <p>链上已有 {count} 条留言。</p>}<input value={message} onChange={e=>setMessage(e.target.value)} placeholder="写一条链上留言"/><button onClick={post}>估算 Gas 并发布</button>{hash && <p>交易哈希：{hash}</p>}</main>
}
