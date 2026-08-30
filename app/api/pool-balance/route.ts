import { NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

const POOL_WALLET = process.env.NEXT_PUBLIC_LOTTO_POOL_WALLET ?? ''
const MAINNET_RPC = 'https://api.mainnet-beta.solana.com'

export async function GET() {
  try {
    const publicKey = new PublicKey(POOL_WALLET)
    const connection = new Connection(MAINNET_RPC, 'confirmed')
    const lamports = await connection.getBalance(publicKey)
    return NextResponse.json({ address: publicKey.toBase58(), sol: lamports / 1_000_000_000 })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown Mainnet RPC error'
    console.warn('[v0] Pool balance API failed:', reason)
    return NextResponse.json({ error: 'BALANCE TEMPORARILY UNAVAILABLE' }, { status: 502 })
  }
}
