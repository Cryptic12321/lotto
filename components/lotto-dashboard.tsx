'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Check, Copy, ExternalLink, Ticket, Trophy, Wallet } from 'lucide-react'
import { LOTTO_MINT, LOTTO_POOL_WALLET, POOL_CONNECTED, SOLANA_NETWORK, TOKEN_CONNECTED, explorerAddress, getPoolBalance, getSplBalance, shortAddress } from '@/lib/solana'

const DRAW_TIME_ZONE = 'America/New_York'
const DRAW_HOUR = 18
const MINIMUM_LOTTO = 10_000

type DrawState = { target: number; remaining: number; drawing: boolean }

function formatTimer(seconds: number) {
  const safe = Math.max(seconds, 0)
  return `${String(Math.floor(safe / 3600)).padStart(2, '0')} : ${String(Math.floor((safe % 3600) / 60)).padStart(2, '0')} : ${String(safe % 60).padStart(2, '0')}`
}

function easternOffset(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: DRAW_TIME_ZONE, timeZoneName: 'longOffset' }).formatToParts(date)
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT-05:00'
  const match = offset.match(/GMT([+-])(\d{2}):?(\d{2})/)
  if (!match) return -5 * 60
  return (match[1] === '+' ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3]))
}

function nextEasternDraw(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: DRAW_TIME_ZONE, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', hour12: false }).formatToParts(now)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  const year = get('year')
  const month = get('month')
  const day = get('day')
  const localMidnight = Date.UTC(year, month - 1, day, DRAW_HOUR, 0, 0)
  const offsetAtTarget = easternOffset(new Date(localMidnight))
  const candidate = new Date(localMidnight - offsetAtTarget * 60_000)

  if (candidate.getTime() <= now.getTime()) {
    const tomorrow = new Date(Date.UTC(year, month - 1, day + 1, DRAW_HOUR, 0, 0))
    const tomorrowOffset = easternOffset(tomorrow)
    return tomorrow.getTime() - tomorrowOffset * 60_000
  }

  return candidate.getTime()
}

function useDailyDraw() {
  const [state, setState] = useState<DrawState>(() => {
    const target = nextEasternDraw()
    return { target, remaining: Math.max(0, Math.ceil((target - Date.now()) / 1000)), drawing: false }
  })
  useEffect(() => {
    const id = window.setInterval(() => setState((current) => {
      const remaining = Math.ceil((current.target - Date.now()) / 1000)
      if (remaining <= 0) return { target: nextEasternDraw(), remaining: 0, drawing: true }
      return { ...current, remaining, drawing: false }
    }), 1000)
    return () => window.clearInterval(id)
  }, [])
  return state
}

function ContractSection() {
  const [copied, setCopied] = useState(false)
  const copy = async () => { if (!LOTTO_MINT) return; await navigator.clipboard.writeText(LOTTO_MINT); setCopied(true); window.setTimeout(() => setCopied(false), 1600) }
  return <section className="contract-section" aria-label="LOTTO contract address"><div><span className="eyebrow">LOTTO CONTRACT</span><strong>{LOTTO_MINT ? <span className="contract-address">{LOTTO_MINT}</span> : 'CA NOT CONNECTED'}</strong></div><div className="contract-actions"><button className="outline-button" onClick={copy} disabled={!LOTTO_MINT}><Copy />{copied ? 'COPIED' : 'COPY CA'}</button>{LOTTO_MINT && <a className="outline-button" href={explorerAddress(LOTTO_MINT)} target="_blank" rel="noreferrer">VIEW ON SOLSCAN <ExternalLink /></a>}</div></section>
}

function DrawCard({ poolBalance }: { poolBalance: number | null }) {
  const draw = useDailyDraw()
  const connected = POOL_CONNECTED && poolBalance !== null
  return <article className="draw-card draw-card-red"><div className="draw-card-header"><span className="draw-title"><span className="draw-symbol">✦</span>DAILY LOTTO</span><span className="demo-tag">{connected ? `${poolBalance.toFixed(2)} SOL` : 'POOL NOT CONNECTED'}</span></div><span className="eyebrow">CURRENT POT</span><strong className={`pot-value ${connected ? '' : 'pot-status'}`}>{connected ? `${poolBalance.toFixed(2)} SOL` : 'POOL NOT CONNECTED'}</strong><div className="timer-wrap"><span className="eyebrow">DRAWING IN</span><strong className={`countdown ${draw.drawing ? 'drawing' : ''}`}>{draw.drawing ? 'DRAWING...' : formatTimer(draw.remaining)}</strong><span className="timer-label">NEXT DRAW &nbsp; EVERY DAY AT 6:00 PM ET</span></div><div className="holder-line"><strong>10,000</strong><span>LOTTO MINIMUM</span></div><p>One verified eligible holder wins the daily pot.</p></article>
}

export function LottoDashboard() {
  const { publicKey, connected } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [poolBalance, setPoolBalance] = useState<number | null>(null)
  useEffect(() => { if (!publicKey || !TOKEN_CONNECTED) { setBalance(null); return }; getSplBalance(publicKey, LOTTO_MINT).then(setBalance).catch(() => setBalance(null)) }, [publicKey])
  useEffect(() => { if (!POOL_CONNECTED) return; getPoolBalance(LOTTO_POOL_WALLET).then(setPoolBalance).catch(() => setPoolBalance(null)) }, [])
  const eligible = useMemo(() => TOKEN_CONNECTED && connected && (balance ?? 0) >= MINIMUM_LOTTO, [balance, connected])
  const networkLabel = TOKEN_CONNECTED ? 'MAINNET' : 'NOT CONNECTED'
  return <main className="lotto-shell"><header className="site-header"><a className="brand" href="#top">LOTTO</a><nav><a href="#draws">DRAW</a><a href="#winner">WINNER</a><a href="#how">HOW IT WORKS</a></nav><div className="header-actions"><span className="network-pill">SOLANA <b>• {networkLabel}</b></span><WalletMultiButton className="wallet-button" /></div></header><section className="intro" id="top"><span className="intro-kicker">WHO&apos;S WINNING NEXT?</span><h1>Hold LOTTO. Stay eligible. <span>One holder gets the pot.</span></h1></section><ContractSection /><section className="draws-section" id="draws"><div className="section-heading"><h2>DAILY LOTTO JACKPOT</h2><span><i /> READ-ONLY ON-CHAIN DATA</span></div><div className="draw-grid"><DrawCard poolBalance={poolBalance} /></div></section><section className="eligibility-panel"><div className="eligibility-title"><Ticket /><h2>ARE YOU IN?</h2></div>{!TOKEN_CONNECTED ? <div className="token-status">TOKEN NOT CONNECTED</div> : connected ? <div className="eligible-state"><span className={`status-dot ${eligible ? '' : 'status-dot-muted'}`} /><div><strong>{eligible ? "YOU'RE IN" : 'NOT ELIGIBLE'}</strong><p>{shortAddress(publicKey?.toBase58() ?? '')} &nbsp;·&nbsp; {balance === null ? 'Checking LOTTO balance...' : `${balance.toLocaleString()} LOTTO`}</p><span>{eligible ? `Your wallet currently holds ${balance?.toLocaleString()} LOTTO.` : 'You need at least 10,000 LOTTO.'}</span></div>{eligible && <Check />}</div> : <div className="eligibility-row"><div><strong>Connect your wallet to check eligibility.</strong><p>Read-only wallet check. No transactions are requested.</p></div><WalletMultiButton className="outline-button" /></div>}</section><section className="secondary-grid"><article id="winner"><div className="section-heading"><h2>LAST WINNER</h2><span>NO VERIFIED DRAW DATA</span></div><div className="winner-card"><Trophy /><div><strong>NO WINNER RECORDED YET</strong><p>Verified draw results will appear here after the first completed draw.</p></div></div></article><article><div className="section-heading"><h2>LIVE ACTIVITY</h2></div><div className="activity-list"><p>On-chain activity will appear here when available.</p></div></article></section><section className="how-section" id="how"><div className="section-heading"><h2>HOW IT WORKS</h2></div><div className="steps-grid">{[['01', 'HOLD LOTTO', 'Keep the minimum amount of LOTTO in your connected wallet.'], ['02', 'STAY ELIGIBLE', 'Maintain the required LOTTO balance until the daily draw.'], ['03', 'WATCH THE COUNTDOWN', 'The draw occurs every day at 8:00 PM Eastern Time.'], ['04', 'DAILY DRAW', 'A verified winner is selected according to the published draw rules.']].map(([num, title, copy]) => <div key={num}><b>{num}</b><strong>{title}</strong><p>{copy}</p></div>)}</div></section><section className="transparency-section" id="transparency"><div className="section-heading"><h2>DAILY PRIZE POOL</h2></div><div className="transparency-grid"><div><span>DAILY PRIZE POOL</span><strong>{poolBalance === null || !POOL_CONNECTED ? 'POOL NOT CONNECTED' : `${poolBalance.toFixed(2)} SOL`}</strong></div><div><span>POOL WALLET</span><strong>{POOL_CONNECTED ? shortAddress(LOTTO_POOL_WALLET) : 'POOL NOT CONNECTED'}</strong>{POOL_CONNECTED && <a href={explorerAddress(LOTTO_POOL_WALLET)} target="_blank" rel="noreferrer">VIEW ON SOLSCAN</a>}</div><div><span>NETWORK</span><strong>SOLANA MAINNET</strong></div></div></section><footer><span>LOTTO © 2026 · SOLANA • {SOLANA_NETWORK === 'mainnet-beta' && TOKEN_CONNECTED ? 'MAINNET' : 'NOT CONNECTED'}</span><a href="#top">BACK TO TOP ↑</a></footer></main>
}

export default LottoDashboard
