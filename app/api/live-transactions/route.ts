import { NextResponse } from 'next/server'
import { PublicKey } from '@solana/web3.js'
import { getMainnetConnection, LOTTO_MINT } from '@/lib/solana'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type TransactionRow = {
  signature: string
  timestamp: number | null
  type: 'BUY' | 'SELL' | 'TRANSACTION'
  solanaUrl: string
}

function classifyTransaction(transaction: any): TransactionRow['type'] {
  const instructions = transaction?.transaction?.message?.instructions ?? []
  const hasSwapProgram = instructions.some((instruction: any) => {
    const program = instruction?.program?.toLowerCase?.() ?? ''
    return program.includes('jupiter') || program.includes('raydium') || program.includes('orca') || program.includes('pump')
  })
  if (!hasSwapProgram) return 'TRANSACTION'

  const pre = transaction?.meta?.preTokenBalances ?? []
  const post = transaction?.meta?.postTokenBalances ?? []
  const tokenDelta = post.reduce((sum: number, balance: any) => sum + Number(balance?.uiTokenAmount?.uiAmount ?? 0), 0) - pre.reduce((sum: number, balance: any) => sum + Number(balance?.uiTokenAmount?.uiAmount ?? 0), 0)
  if (tokenDelta > 0) return 'BUY'
  if (tokenDelta < 0) return 'SELL'
  return 'TRANSACTION'
}

export async function GET() {
  try {
    const mint = new PublicKey(LOTTO_MINT)
    const connection = getMainnetConnection()
    const signatures = await connection.getSignaturesForAddress(mint, { limit: 20 }, 'confirmed')
    const transactions = await Promise.all(signatures.map((item) => connection.getParsedTransaction(item.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 })))
    const rows = signatures.map((item, index) => ({ signature: item.signature, timestamp: transactions[index]?.blockTime ?? item.blockTime ?? null, type: classifyTransaction(transactions[index]), solanaUrl: `https://solscan.io/tx/${item.signature}` })).filter((row): row is TransactionRow => Boolean(row.signature))
    return NextResponse.json({ network: 'mainnet-beta', mint: mint.toBase58(), transactions: rows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Solana Mainnet RPC request failed'
    console.warn('[v0] Live transaction feed failed:', message)
    return NextResponse.json({ error: 'LIVE TRANSACTION FEED TEMPORARILY UNAVAILABLE' }, { status: 503 })
  }
}
