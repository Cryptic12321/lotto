import { NextResponse } from 'next/server'

export const revalidate = 60

export async function GET() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd', {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!response.ok) throw new Error(`SOL price API returned ${response.status}`)
    const data = (await response.json()) as { solana?: { usd?: number } }
    const usd = data.solana?.usd
    if (typeof usd !== 'number' || !Number.isFinite(usd) || usd < 0) throw new Error('Invalid SOL/USD price response')

    return NextResponse.json({ usd })
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown SOL/USD price error'
    console.warn('[v0] SOL/USD price lookup failed:', reason)
    return NextResponse.json({ error: 'USD value temporarily unavailable' }, { status: 502 })
  }
}
