import { NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { drawSnapshots } from '@/lib/db/schema'
import { Connection, PublicKey } from '@solana/web3.js'
import { LOTTO_MINT, SOLANA_NETWORK } from '@/lib/solana'

const RPC = 'https://api.mainnet-beta.solana.com'
const MIN_TOKENS = Number(process.env.LOTTO_MIN_ELIGIBLE_TOKENS ?? '1')

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { drawId?: string; scheduledAt?: string }
  const drawId = body.drawId?.trim() || `daily-${new Date().toISOString().slice(0, 10)}`
  const mint = new PublicKey(LOTTO_MINT)
  if (SOLANA_NETWORK !== 'mainnet-beta' && SOLANA_NETWORK !== 'mainnet') return NextResponse.json({ error: 'Snapshot requires Solana Mainnet' }, { status: 400 })
  const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : new Date()
  const connection = new Connection(RPC, 'confirmed')
  const accounts = await connection.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), { filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: mint.toBase58() } }] })
  const balances = new Map<string, number>()
  for (const account of accounts) {
    const info = (account.account.data as { parsed?: { info?: { owner?: string; tokenAmount?: { uiAmount?: number } } } }).parsed?.info
    const owner = info?.owner
    const amount = info?.tokenAmount?.uiAmount ?? 0
    if (owner && amount > 0) balances.set(owner, (balances.get(owner) ?? 0) + amount)
  }
  const wallets = [...balances.entries()].filter(([, amount]) => amount >= MIN_TOKENS).sort(([a], [b]) => a.localeCompare(b)).map(([wallet, tokenBalance]) => ({ wallet, tokenBalance }))
  const capturedAt = new Date()
  const snapshotHash = createHash('sha256').update(JSON.stringify({ drawId, mint: mint.toBase58(), wallets })).digest('hex')
  const snapshot = { id: drawId, drawType: 'DAILY', scheduledAt, capturedAt, network: 'mainnet-beta', mintAddress: mint.toBase58(), holderCount: balances.size, eligibleCount: wallets.length, snapshotHash, status: 'TEST', wallets }
  await db.insert(drawSnapshots).values(snapshot).onConflictDoUpdate({ target: drawSnapshots.id, set: snapshot })
  return NextResponse.json(snapshot)
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('id')
  const rows = id ? await db.select().from(drawSnapshots).where(eq(drawSnapshots.id, id)) : await db.select().from(drawSnapshots)
  return NextResponse.json(rows)
}
