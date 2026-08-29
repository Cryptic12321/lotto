'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, ChevronDown, Menu, ShieldCheck, Sparkles, Ticket, Trophy, Wallet, X, Zap } from 'lucide-react'

const activity = [
  ['New eligible holder', '8Jf...2Kp', 'just joined the community', 'red', 'now'],
  ['Hourly pot increased', '+$42.18', 'from new eligible holders', 'gold', '2m'],
  ['New LOTTO holder', '4Lm...91x', 'is now in the draw', 'navy', '4m'],
  ['Winner announced', '7xK...92P', 'won $1,284.50', 'red', '8m'],
]
const winners = [
  ['HOURLY WINNER', '7xK...92P', 'WON $1,284.50', 'red'],
  ['HOURLY WINNER', '9aB...1Qx', 'WON $1,102.30', 'gold'],
  ['DAILY WINNER', '3Fd...7Lm', 'WON $8,214', 'navy'],
]

function Countdown({ initial }: { initial: number }) {
  const [seconds, setSeconds] = useState(initial)
  useEffect(() => { const timer = setInterval(() => setSeconds((v) => v > 0 ? v - 1 : initial), 1000); return () => clearInterval(timer) }, [initial])
  return <span className="countdown">{String(Math.floor(seconds / 3600)).padStart(2, '0')}:{String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</span>
}

function PotCard({ daily = false, onConnect }: { daily?: boolean; onConnect: () => void }) {
  return <article className={`pot-card ${daily ? 'daily-card' : 'hourly-card'}`}>
    <div className="pot-card-top"><span className="eyebrow">{daily ? <Sparkles /> : <Zap />} {daily ? 'DAILY JACKPOT' : 'HOURLY DRAW'}</span><span className="demo-pill">DEMO</span></div>
    <p className="pot-label">{daily ? 'The big one, every day.' : 'A new chance every hour.'}</p>
    <strong className="pot-amount">{daily ? '$8,920' : '$1,284.50'}</strong>
    <div className="draw-row"><span>DRAWING IN</span><Countdown initial={daily ? 24137 : 2537} /></div>
    <div className="pot-bar"><span style={{ width: daily ? '62%' : '78%' }} /></div>
    <div className="pot-bottom"><span>{daily ? '8,421' : '1,284'} eligible holders</span><button className="card-connect" onClick={onConnect}>CHECK MY ELIGIBILITY <ArrowRight /></button></div>
    <p className="eligibility">One eligible holder wins the designated {daily ? 'daily' : 'hourly'} pot.</p>
  </article>
}

export function LottoDashboard() {
  const [connected, setConnected] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const connect = () => setConnected((v) => !v)
  return <main className="lotto-shell">
    <div className="top-ribbon"><span className="live-dot" /> SOLANA <span>•</span> DEMO EXPERIENCE · NO REAL FUNDS <a href="#transparency">Learn more <ArrowRight /></a></div>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark"><Ticket /></span><span>LOTTO</span></a><nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}><a href="#pots" onClick={() => setMenuOpen(false)}>Draws</a><a href="#winners" onClick={() => setMenuOpen(false)}>Winners</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a><a href="#transparency" onClick={() => setMenuOpen(false)}>Transparency</a></nav><button className="connect-button" onClick={connect}>{connected ? <><Check /> 7xK...92P</> : <><Wallet /> Connect Wallet</>}</button><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button></header>
    <section className="hero" id="top"><div className="hero-copy"><div className="demo-status"><span className="status-dot" /> SOLANA <span>•</span> DEMO</div><h1>WHO&apos;S <span>WINNING</span><br />NEXT?</h1><p className="hero-subtitle">Hold LOTTO. Stay eligible. One holder gets the pot.</p><div className="hero-actions"><button className="primary-cta" onClick={connect}><Wallet /> CONNECT WALLET</button><a href="#pots" className="secondary-cta">VIEW CURRENT DRAW <ArrowRight /></a></div><p className="hero-note"><ShieldCheck /> Your friendly community lottery on the internet.</p></div><div className="hero-visual" aria-label="A LOTTO ticket, lottery balls, and a daily jackpot"><div className="confetti confetti-a">✦</div><div className="confetti confetti-b">✦</div><div className="ticket"><div className="ticket-head"><span>LOTTO</span><span>DEMO 001</span></div><div className="ticket-title">HOLD LOTTO<br /><b>WIN THE POT</b></div><div className="balls"><i>7</i><i>2</i><i>4</i><i>8</i><i>1</i></div><div className="ticket-foot">HOLD • STAY ELIGIBLE • GOOD LUCK</div></div><div className="jackpot-box"><span>DAILY JACKPOT</span><strong>$8,920</strong><small>DEMO POT</small></div></div></section>
    <section className="pots-section" id="pots"><div className="section-intro"><div><span className="section-kicker">CURRENT DRAWS</span><h2>Pick your <span>moment.</span></h2></div><p>Hold LOTTO → stay eligible → wait for the draw → someone wins.</p></div><div className="pots-grid"><PotCard onConnect={connect} /><PotCard daily onConnect={connect} /></div></section>
    <section className="status-card"><div className="status-icon"><Ticket /></div><div><span className="section-kicker">YOUR LOTTO STATUS</span><h3>{connected ? "YOU'RE IN!" : 'ARE YOU IN?'}</h3><p>{connected ? 'LOTTO BALANCE 42,810 LOTTO · MINIMUM REQUIRED 10,000 LOTTO' : "Connect your wallet to see if you're eligible for the next draw."}</p>{connected && <strong className="status-good">You&apos;re eligible for the next draw. Good luck! 👀</strong>}</div><button className="status-action" onClick={connect}>{connected ? 'WALLET CONNECTED' : 'CONNECT WALLET'} <ArrowRight /></button></section>
    <section className="content-grid"><div className="panel" id="activity"><div className="panel-heading"><div><span className="section-kicker">LIVE ACTIVITY</span><h3>What&apos;s happening</h3></div><span className="live-badge"><span className="status-dot" /> LIVE</span></div><div className="activity-list">{activity.map(([title, value, note, tone, time]) => <div className="activity-row" key={`${title}-${value}`}><span className={`activity-dot ${tone}`} /><div><strong>{title}</strong><span>{value} · {note}</span></div><small>{time}</small></div>)}</div></div><div className="panel winners-panel" id="winners"><div className="panel-heading"><div><span className="section-kicker">THE LUCKY ONES</span><h3>Who won?</h3></div><Trophy className="panel-icon" /></div><div className="winner-list">{winners.map(([label, wallet, prize, tone]) => <div className={`winner-row ${tone}`} key={wallet}><div className="winner-icon"><Trophy /></div><div><strong>{label}</strong><span>{wallet}</span></div><b>{prize}</b></div>)}</div></div></section>
    <section className="how-section" id="how-it-works"><div className="section-heading"><span className="section-kicker">FOUR EASY STEPS</span><h2>How it <span>works.</span></h2></div><div className="steps-grid">{[['01', 'HOLD LOTTO', 'Keep LOTTO in your wallet.', <Ticket />], ['02', 'STAY ELIGIBLE', 'Hold the required minimum amount.', <Check />], ['03', 'WAIT FOR THE DRAW', 'The hourly or daily draw takes place.', <ChevronDown />], ['04', 'SOMEONE WINS', 'One eligible wallet is randomly selected.', <Trophy />]].map(([number, title, text, icon]) => <div className="step" key={number}><span className="step-number">{number}</span><div className="step-art">{icon}</div><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="transparency-section" id="transparency"><div className="transparency-copy"><span className="section-kicker">POOL TRANSPARENCY</span><h2>Where&apos;s the <span>pot?</span></h2><p>The live version will make the pool balances and associated Solana accounts publicly visible so anyone can verify where the funds are.</p><span className="demo-banner"><Sparkles /> DEMO MODE · ZERO REAL FUNDS</span></div><div className="pool-cards"><div className="pool-card"><span>HOURLY POOL</span><strong>$1,284.50</strong><small>DEMO</small></div><div className="pool-card"><span>DAILY POOL</span><strong>$8,920</strong><small>DEMO</small></div><div className="pool-card pool-wide"><span>TREASURY</span><strong>DEMO ADDRESS</strong><small>PUBLIC WHEN LIVE</small></div></div></section>
    <footer className="site-footer"><a className="brand" href="#top"><span className="brand-mark"><Ticket /></span><span>LOTTO</span></a><span>Who&apos;s winning next?</span><nav><a href="#pots">Draws</a><a href="#winners">Winners</a><a href="#how-it-works">How It Works</a><a href="#transparency">Transparency</a></nav><span>SOLANA • DEMO</span></footer>
    {connected && <div className="toast"><Check /> Demo wallet connected <button onClick={() => setConnected(false)} aria-label="Dismiss"><X /></button></div>}
  </main>
}
export default LottoDashboard
