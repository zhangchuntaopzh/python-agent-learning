import { parseAbi } from 'viem'
export const contractAddress = '0x0000000000000000000000000000000000000000' as const
export const contractAbi = parseAbi(['function post(string text)','function count() view returns (uint256)','function getMessage(uint256 index) view returns (address author, string text, uint256 createdAt)','event MessagePosted(address indexed author, string text, uint256 createdAt)'])
