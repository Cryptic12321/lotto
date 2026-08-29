'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Copy, Crown, Menu, Moon, Sparkles, Ticket, Trophy, Wallet, X, Zap } from 'lucide-react'

const activity = [
  ['New holder', '8Jf...2Kp', 'just joined the community', 'green'],
  ['Hourly pot increased', '+$42.18', 'from new eligible holders', 'gold'],
  ['New eligible holder', '4Lm...91x', 'is now in the draw', 'green'],
  ['Previous winner', '7xK...92P', 'won $1,284.50', 'gold'],
]
const winners = [
  ['HOURLY WINNER', '7xK...92P', '$1,284.50', 'hourly'],
  ['HOURLY WINNER', '9aB...1Qx', '$1,102.30', 'hourly'],
  ['DAILY WINNER', '3Fd...7Lm', '$8,214.00', 'daily'],
]

function Countdown({ initial }: { initial: number }) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => { const timer = setInterval(() => setSeconds((v) => v > 0 ? v - 1 : initial), 1000); return () => clearInterval(timer) }, [initial])
  return <span className="countdown">{String(Math.floor(seconds / 3600)).padStart(2, '0')}:{String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
}

function PotCard({ daily = false }: { daily?: boolean }) {
  return <article className={`pot-card ${daily ? 'daily-card' : ''}`}>
    <div className="pot-card-top"><span className="eyebrow">{daily ? <Moon size={17} /> : <Zap size={17} />} {daily ? 'DAILY JACKPOT' : 'HOURLY DRAW'}</span><span className="demo-pill">DEMO</span></div>
    <p className="pot-label">{daily ? 'The big one, every day.' : 'A new chance every hour.'}</p>
    <strong className="pot-amount">{daily ? '$8,920' : '$1,284.50'}</strong>
    <div className="draw-row"><span>DRAWING IN</span><Countdown initial={daily ? 24137 : 2537} /></div>
    <div className="pot-bar"><span style={{ width: daily ? '62%' : '78%' }} /></div>
    <div className="pot-bottom"><span>{daily ? '8,421' : '1,284'} eligible holders</span><button className="card-connect">CONNECT WALLET <ArrowRight size={14} /></button></div>
    <p className="eligibility">Hold enough LOTTO to be eligible.</p>
  </article>
}

export function LottoDashboard() {
  const [connected, setConnected] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const connect = () => setConnected((v) => !v)
  return <main className="lotto-shell">
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark"><Ticket size={19} /></span><span>LOTTO</span></a><nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}><a href="#pots" onClick={() => setMenuOpen(false)}>Pots</a><a href="#activity" onClick={() => setMenuOpen(false)}>Activity</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a><a href="#winners" onClick={() => setMenuOpen(false)}>Winners</a><a href="#transparency" onClick={() => setMenuOpen(false)}>Transparency</a></nav><button className="connect-button" onClick={connect}>{connected ? <><Check size={16} /> 7xK...92P</> : <><Wallet size={16} /> Connect Wallet</>}</button><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="demo-status"><span className="status-dot" /> SOLANA <span>•</span> DEMO</div><h1>WHO&apos;S<br /><span>WINNING NEXT?</span></h1><p className="hero-subtitle">Hold LOTTO. Stay eligible. One holder gets the pot.</p><div className="hero-actions"><button className="primary-cta" onClick={connect}><Wallet size={17} /> CONNECT WALLET</button><a href="#pots" className="secondary-cta">VIEW CURRENT DRAW <ArrowRight size={16} /></a></div><p className="hero-note"><Sparkles size={14} /> Community-powered drawings on Solana</p></div><div className="hero-visual" aria-label="LOTTO mascot and ticket demo"><div className="ticket"><div className="ticket-head"><span>LOTTO</span><span>DEMO 001</span></div><div className="ticket-title">YOU COULD<br /><b>WIN THE POT</b></div><div className="balls"><i>7</i><i>2</i><i>4</i><i>8</i><i>1</i></div><div className="ticket-foot">HOLD • STAY ELIGIBLE • GOOD LUCK</div></div><div className="mascot"><div className="mascot-eye" /><div className="mascot-eye" /></div><span className="spark spark-one">✦</span><span className="spark spark-two">✦</span></div></section>
    <section className="pots-section" id="pots"><div className="section-intro"><div><span className="section-kicker">THE POTS</span><h2>Pick your <span>moment.</span></h2></div><p>Two draws. One simple idea: hold LOTTO, and you&apos;re in.</p></div><div className="pots-grid"><PotCard /><PotCard daily /></div></section>
    <section className="status-card"><div className="status-icon"><Wallet size={22} /></div><div><span className="section-kicker">YOUR LOTTO STATUS</span><h3>{connected ? 'YOU&apos;RE ELIGIBLE' : 'Connect to check your spot.'}</h3><p>{connected ? '42,810 LOTTO · Minimum required: 10,000 LOTTO' : 'Connect your wallet to check your eligibility.'}</p>{connected && <strong className="status-good">You&apos;re in the draw. Good luck.</strong>}</div><button className="status-action" onClick={connect}>{connected ? 'WALLET CONNECTED' : 'CONNECT WALLET'} <ArrowRight size={15} /></button></section>
    <section className="content-grid"><div className="panel" id="activity"><div className="panel-heading"><div><span className="section-kicker">HAPPENING NOW</span><h3>Live LOTTO activity</h3></div><span className="live-badge"><span className="status-dot" /> LIVE</span></div><div className="activity-list">{activity.map(([title, value, note, tone]) => <div className="activity-row" key={title}><span className={`activity-dot ${tone}`} /> <div><strong>{title}</strong><span>{value} · {note}</span></div><small>now</small></div>)}</div></div><div className="panel" id="winners"><div className="panel-heading"><div><span className="section-kicker">THE LUCKY ONES</span><h3>Who won?</h3></div><Crown className="panel-icon" size={22} /></div><div className="winner-list">{winners.map(([label, wallet, prize, type]) => <div className="winner-row" key={wallet}><div className={`winner-icon ${type}`}><Trophy size={16} /></div><div><strong>{label}</strong><span>Wallet: {wallet}</span></div><b>{prize}</b></div>)}</div></div></section>
    <section className="how-section" id="how-it-works"><div className="section-heading"><span className="section-kicker">NO FUSS, JUST LOTTO</span><h2>How it <span>works.</span></h2></div><div className="steps-grid">{[['01', 'HOLD LOTTO', 'Keep LOTTO in your wallet.'], ['02', 'STAY ELIGIBLE', 'Hold the required minimum when the draw occurs.'], ['03', 'RANDOM DRAW', 'A verifiable random process selects a wallet.'], ['04', 'SOMEONE WINS', 'The selected wallet receives the prize pool.']].map(([number, title, text]) => <div className="step" key={number}><span className="step-number">{number}</span><div className="step-art"><Ticket size={22} /></div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="transparency-section" id="transparency"><div className="transparency-copy"><span className="section-kicker">LOOKING AHEAD</span><h2>Open by <span>default.</span></h2><p>The live version will make every pool and treasury balance publicly verifiable on Solana. For now, this is a friendly demo with zero real funds.</p><span className="demo-banner"><Sparkles size={16} /> DEMO MODE · NO REAL FUNDS</span></div><div className="treasury-card"><div className="treasury-head"><span>DEMO TREASURY</span><span className="copy-address"><Copy size={14} /> COPY</span></div><code>LOTToDemo...7xK92P</code><div className="treasury-balance"><span>DEMO BALANCE</span><strong>$12,480.00</strong></div><div className="treasury-foot"><span>Pool allocation</span><b>90% prizes / 10% protocol</b></div></div></section>
    <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark"><Ticket size={16} /></span><span>LOTTO</span></a><span>© 2026 LOTTO COMMUNITY</span><span>DEMO EXPERIENCE · NO REAL FUNDS</span></footer>
    {connected && <div className="toast"><Check size={16} /> Demo wallet connected <button onClick={() => setConnected(false)} aria-label="Dismiss"><X size={13} /></button></div>}
  </main>
}
export default LottoDashboard
