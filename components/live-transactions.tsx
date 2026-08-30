'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, RefreshCw } from 'lucide-react'

type TransactionRow = { signature: string; timestamp: number | null; type: 'BUY' | 'SELL' | 'TRANSACTION'; solanaUrl: string }

function formatTime(timestamp: number | null) {
  if (!timestamp) return 'TIME UNAVAILABLE'
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(timestamp * 1000)
}

export function LiveTransactions() {
  const [rows, setRows] = useState<TransactionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    const load = () => fetch('/api/live-transactions', { cache: 'no-store' }).then((response) => { if (!response.ok) throw new Error('Feed unavailable'); return response.json() }).then((data: { transactions: TransactionRow[] }) => { if (active) { setRows(data.transactions); setError(false); setLoading(false) } }).catch(() => { if (active) { setError(true); setLoading(false) } })
    load()
    const interval = window.setInterval(load, 30_000)
    return () => { active = false; window.clearInterval(interval) }
  }, [])

  return <section className="transactions-section" aria-labelledby="transactions-title">
    <div className="section-heading"><div><span className="eyebrow">TRANSPARENCY</span><h2 id="transactions-title">LIVE TRANSACTIONS</h2></div><span className="live-pill"><i aria-hidden="true" />LIVE</span></div>
    {loading ? <div className="transaction-state"><RefreshCw className="spin" aria-hidden="true" /> LOADING MAINNET ACTIVITY</div> : error ? <div className="transaction-state">LIVE TRANSACTION FEED TEMPORARILY UNAVAILABLE</div> : rows.length === 0 ? <div className="transaction-state">NO RECENT MINT ACTIVITY FOUND</div> : <div className="transaction-list">{rows.map((row) => <a className="transaction-row" href={row.solanaUrl} target="_blank" rel="noreferrer" key={row.signature}><span className={`transaction-type transaction-type-${row.type.toLowerCase()}`}>{row.type}</span><span className="transaction-signature">{row.signature.slice(0, 8)}…{row.signature.slice(-8)}</span><span className="transaction-time">{formatTime(row.timestamp)}</span><ArrowUpRight aria-hidden="true" /></a>)}</div>}
  </section>
}
