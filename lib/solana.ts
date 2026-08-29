import { Connection, PublicKey } from '@solana/web3.js'

export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? 'devnet'
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL ?? 'https://api.devnet.solana.com'
export const LOTTO_MINT = process.env.NEXT_PUBLIC_LOTTO_MINT ?? ''
export const HOURLY_POOL = process.env.NEXT_PUBLIC_HOURLY_POOL ?? ''
export const DAILY_POOL = process.env.NEXT_PUBLIC_DAILY_POOL ?? ''

export const connection = new Connection(SOLANA_RPC_URL, 'confirmed')

export function publicKeyFrom(value?: string) {
  if (!value) return null
  try { return new PublicKey(value) } catch { return null }
}

export function shortAddress(value: string) {
  return `${value.slice(0, 4)}...${value.slice(-4)}`
}

export async function getSplBalance(owner: PublicKey, mintAddress = LOTTO_MINT) {
  const mint = publicKeyFrom(mintAddress)
  if (!mint) return 0
  const accounts = await connection.getParsedTokenAccountsByOwner(owner, { mint })
  return accounts.value.reduce((sum, account) => sum + Number(account.account.data.parsed.info.tokenAmount.uiAmount ?? 0), 0)
}

export async function getPoolBalance(address?: string) {
  const pool = publicKeyFrom(address)
  if (!pool) return null
  const lamports = await connection.getBalance(pool)
  return lamports / 1_000_000_000
}

export function explorerAddress(address: string) {
  return `https://solscan.io/account/${address}?cluster=${SOLANA_NETWORK}`
}
