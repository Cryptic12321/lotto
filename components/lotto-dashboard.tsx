'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, ChevronRight, CircleHelp, Copy, Droplets, ExternalLink, LockKeyhole, Menu, ShieldCheck, Sparkles, Trophy, Wallet, X } from 'lucide-react'

const activity = [
  { wallet: '7xK...9Lm', action: 'entered Hourly Pot', amount: '0.25 SOL', time: '12 sec ago' },
  { wallet: '3pQ...2Ve', action: 'entered Daily Pot', amount: '1.00 SOL', time: '38 sec ago' },
  { wallet: '8mR...4Ka', action: 'entered Hourly Pot', amount: '0.50 SOL', time: '1 min ago' },
  { wallet: '5nT...7Ju', action: 'entered Daily Pot', amount: '0.25 SOL', time: '2 min ago' },
]

const winners = [
  { wallet: '9kF...a2X', pot: 'DAILY POT', prize: '$4,280.00', date: 'Aug 28, 2026' },
  { wallet: '4zP...n8Q', pot: 'HOURLY POT', prize: '$920.00', date: 'Aug 28, 2026' },
  { wallet: '6bM...r5L', pot: 'DAILY POT', prize: '$3,760.00', date: 'Aug 27, 2026' },
]

function Countdown({ initial }: { initial: number }) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value > 0 ? value - 1 : initial), 1000)
    return () => clearInterval(timer)
  }, [initial])
  const hours = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return <span className="countdown">{hours}:{minutes}:{secs}</span>
}

function PotCard({ type, amount, progress, countdown }: { type: string; amount: string; progress: number; countdown: number }) {
  const daily = type === 'DAILY POT'
  return (
    <article className={`pot-card ${daily ? 'pot-card-daily' : ''}`}>
      <div className="pot-card-top"><span className="eyebrow"><span className="status-dot" /> {type}</span><span className="pot-tag">DEMO POOL</span></div>
      <div className="pot-amount">{amount}</div>
      <div className="pot-meta"><span>DRAWING IN</span><Countdown initial={countdown} /></div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="pot-footer"><span>{daily ? '1,248' : '386'} entries</span><button className="enter-button">ENTER POT <ArrowUpRight size={15} /></button></div>
    </article>
  )
}

export function LottoDashboard() {
  const [connected, setConnected] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <main className="lotto-shell">
      <div className="ambient-line ambient-line-one" /><div className="ambient-line ambient-line-two" />
      <header className="site-header"><a className="brand" href="#top" aria-label="LOTTO home"><span className="brand-mark">L</span><span>LOTTO</span></a><nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}><a href="#pots" onClick={() => setMenuOpen(false)}>Pots</a><a href="#activity" onClick={() => setMenuOpen(false)}>Activity</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#transparency" onClick={() => setMenuOpen(false)}>Transparency</a></nav><button className="connect-button" onClick={() => setConnected(!connected)}>{connected ? <><Check size={15} /> 7xK...9Lm</> : <><Wallet size={15} /> Connect wallet</>}</button><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></header>
      <section className="hero" id="top"><div className="hero-copy"><div className="live-label"><span className="live-pulse" /> LIVE ON SOLANA <span className="demo-label">DEMO MODE</span></div><h1>Small entry.<br /><em>Big upside.</em></h1><p className="hero-subtitle">A transparent, community-powered lottery built for the next wave of Solana.</p><div className="hero-actions"><a href="#pots" className="primary-cta">View live pots <ArrowUpRight size={16} /></a><a href="#how-it-works" className="text-link">How it works <ChevronRight size={15} /></a></div></div><div className="hero-orbit"><div className="orbit-ring orbit-ring-one" /><div className="orbit-ring orbit-ring-two" /><div className="orbit-core"><span className="core-kicker">TOTAL DISTRIBUTED</span><strong>$184,920</strong><span className="core-note">across 3,842 winners</span></div><div className="orbit-node node-one">◎</div><div className="orbit-node node-two">◈</div></div></section>
      <section className="pots-section" id="pots"><div className="section-heading"><div><span className="section-kicker">CURRENTLY LIVE</span><h2>Pick your <span>pot.</span></h2></div><span className="refresh-note"><span className="status-dot" /> Pools refresh every draw</span></div><div className="pots-grid"><PotCard type="HOURLY POT" amount="$1,284.50" progress={72} countdown={1847} /><PotCard type="DAILY POT" amount="$8,920.00" progress={46} countdown={48721} /></div></section>
      <section className="content-grid" id="activity"><div className="panel activity-panel"><div className="panel-heading"><div><span className="section-kicker">ON-CHAIN FEED</span><h3>Live activity</h3></div><span className="live-badge"><span className="live-pulse" /> LIVE</span></div><div className="activity-list">{activity.map((item) => <div className="activity-row" key={item.wallet}><div className="activity-avatar">{item.wallet.slice(0, 1)}</div><div className="activity-info"><strong>{item.wallet}</strong><span>{item.action}</span></div><div className="activity-value"><strong>{item.amount}</strong><span>{item.time}</span></div></div>)}</div><a className="panel-link" href="#transparency">View all activity <ArrowUpRight size={14} /></a></div><div className="panel winners-panel"><div className="panel-heading"><div><span className="section-kicker">RECENTLY PAID</span><h3>Previous winners</h3></div><Trophy size={19} className="panel-icon" /></div><div className="winner-list">{winners.map((winner) => <div className="winner-row" key={winner.wallet}><div className="winner-avatar"><Trophy size={14} /></div><div className="winner-info"><strong>{winner.wallet}</strong><span>{winner.pot} · {winner.date}</span></div><div className="winner-prize">{winner.prize}</div></div>)}</div><a className="panel-link" href="#transparency">Explore winners <ArrowUpRight size={14} /></a></div></section>
      <section className="how-section" id="how-it-works"><div className="section-heading"><div><span className="section-kicker">SIMPLE BY DESIGN</span><h2>How it <span>works.</span></h2></div></div><div className="steps-grid"><div className="step"><div className="step-icon"><Wallet size={19} /></div><span className="step-number">01</span><h3>Connect</h3><p>Link your Solana wallet to get started. No account, no friction.</p></div><div className="step"><div className="step-icon"><Sparkles size={19} /></div><span className="step-number">02</span><h3>Enter a pot</h3><p>Choose a pool and enter with SOL. Every entry is recorded on-chain.</p></div><div className="step"><div className="step-icon"><Trophy size={19} /></div><span className="step-number">03</span><h3>Win & claim</h3><p>Winners are selected fairly. Prizes are sent directly to your wallet.</p></div></div></section>
      <section className="transparency-section" id="transparency"><div className="transparency-copy"><span className="section-kicker">BUILT IN PUBLIC</span><h2>Trust is <span>the feature.</span></h2><p>Every entry, draw, and payout is verifiable on-chain. No hidden mechanics. No black boxes.</p><a className="outline-cta" href="#activity">Explore on-chain data <ExternalLink size={15} /></a></div><div className="transparency-stats"><div className="transparency-stat"><ShieldCheck size={19} /><div><strong>100%</strong><span>Provably fair draws</span></div></div><div className="transparency-stat"><LockKeyhole size={19} /><div><strong>0%</strong><span>Platform custody</span></div></div><div className="transparency-stat"><Droplets size={19} /><div><strong>90/10</strong><span>Prize pool / protocol</span></div></div></div></section>
      <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark">L</span><span>LOTTO</span></a><span>© 2026 LOTTO PROTOCOL</span><span className="footer-demo"><CircleHelp size={14} /> Demo experience · No real funds</span></footer>
      {connected && <div className="toast"><Check size={16} /> Wallet connected <button onClick={() => setConnected(false)} aria-label="Dismiss"><X size={13} /></button></div>}
    </main>
  )
}

export default LottoDashboard

