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

function classifyTransaction(transaction: any, mint: string): TransactionRow['type'] {
  const instructions = transaction?.transaction?.message?.instructions ?? []
  const hasRecognizedSwap = instructions.some((instruction: any) => {
    const program = instruction?.program?.toLowerCase?.() ?? ''
    return program === 'jupiter' || program === 'raydium' || program === 'orca' || program === 'pump.fun'
  })
  if (!hasRecognizedSwap) return 'TRANSACTION'

  const pre = transaction?.meta?.preTokenBalances ?? []
  const post = transaction?.meta?.postTokenBalances ?? []
  const byOwner = new Map<string, number>()
  for (const balance of pre) if (balance?.mint === mint && balance?.owner) byOwner.set(balance.owner, (byOwner.get(balance.owner) ?? 0) - Number(balance?.uiTokenAmount?.uiAmount ?? 0))
  for (const balance of post) if (balance?.mint === mint && balance?.owner) byOwner.set(balance.owner, (byOwner.get(balance.owner) ?? 0) + Number(balance?.uiTokenAmount?.uiAmount ?? 0))
  const nonZeroDeltas = [...byOwner.values()].filter((value) => value !== 0)
  if (nonZeroDeltas.length !== 1) return 'TRANSACTION'
  if (nonZeroDeltas[0] > 0) return 'BUY'
  if (nonZeroDeltas[0] < 0) return 'SELL'
  return 'TRANSACTION'
}

export async function GET() {
  try {
    const mint = new PublicKey(LOTTO_MINT)
    const connection = getMainnetConnection()
    const signatures = await connection.getSignaturesForAddress(mint, { limit: 20 }, 'confirmed')
    const transactions = []
    for (const item of signatures.slice(0, 5)) {
      try {
        transactions.push(await connection.getParsedTransaction(item.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }))
      } catch (error) {
        console.warn('[v0] Parsed transaction lookup skipped:', item.signature, error instanceof Error ? error.message : 'RPC error')
        transactions.push(null)
      }
    }
    const rows = signatures.slice(0, 5).map((item, index) => ({ signature: item.signature, timestamp: transactions[index]?.blockTime ?? null, type: classifyTransaction(transactions[index], mint.toBase58()), solanaUrl: `https://solscan.io/tx/${item.signature}` })).filter((row): row is TransactionRow => Boolean(row.signature))
    return NextResponse.json({ network: 'mainnet-beta', mint: mint.toBase58(), transactions: rows })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Solana Mainnet RPC request failed'
    console.warn('[v0] Live transaction feed failed:', message)
    return NextResponse.json({ error: 'LIVE TRANSACTION FEED TEMPORARILY UNAVAILABLE' }, { status: 503 })
  }
}
