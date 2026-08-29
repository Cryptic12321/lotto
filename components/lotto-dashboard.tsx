'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, Ticket, Trophy, Wallet } from 'lucide-react'

function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(' : ')
}

function Countdown({ initial }: { initial: number }) {
  const [remaining, setRemaining] = useState(initial)
  const [drawing, setDrawing] = useState(false)
  useEffect(() => {
    const interval = window.setInterval(() => setRemaining((current) => {
      if (current > 0) return current - 1
      setDrawing(true)
      window.setTimeout(() => { setDrawing(false); setRemaining(initial) }, 1800)
      return 0
    }), 1000)
    return () => window.clearInterval(interval)
  }, [initial])
  return <span className={drawing ? 'countdown drawing' : 'countdown'}>{drawing ? 'DRAWING...' : formatCountdown(remaining)}</span>
}

function DrawCard({ daily = false, onEligibility }: { daily?: boolean; onEligibility: () => void }) {
  return <article className={`draw-card ${daily ? 'draw-card-red' : 'draw-card-light'}`}>
    <div className="draw-card-header"><span className="draw-title"><span className="draw-symbol">{daily ? '✦' : '●'}</span>{daily ? 'DAILY JACKPOT' : 'HOURLY DRAW'}</span><span className="demo-tag">DEMO</span></div>
    <span className="eyebrow">CURRENT POT</span><strong className="pot-value">{daily ? '$8,920' : '$1,284.50'}</strong>
    <div className="timer-wrap"><span className="eyebrow">DRAWING IN</span><Countdown initial={daily ? 6 * 3600 + 42 * 60 + 17 : 42 * 60 + 17} /><span className="timer-label">HOURS&nbsp;&nbsp;:&nbsp;&nbsp; MINUTES&nbsp;&nbsp;:&nbsp;&nbsp; SECONDS</span></div>
    <div className="holder-line"><strong>{daily ? '8,421' : '1,284'}</strong><span>ELIGIBLE HOLDERS</span></div>
    <p>{daily ? 'One eligible holder wins the daily pot.' : 'Hold the minimum amount of LOTTO to be eligible.'}</p>
    <button className={daily ? 'card-button card-button-gold' : 'card-button'} onClick={onEligibility}>CHECK MY ELIGIBILITY <ArrowRight /></button>
  </article>
}

export function LottoDashboard() {
  const [connected, setConnected] = useState(false)
  const connect = () => setConnected((current) => !current)
  return <main className="lotto-shell">
    <header className="site-header"><a className="brand" href="#top">LOTTO</a><nav><a href="#draws">DRAWS</a><a href="#winner">WINNERS</a><a href="#how">HOW IT WORKS</a><a href="#transparency">TRANSPARENCY</a></nav><div className="header-actions"><span className="network-pill">SOLANA <b>• DEMO</b></span><button className="wallet-button" onClick={connect}><Wallet /> {connected ? 'WALLET CONNECTED' : 'CONNECT WALLET'}</button></div></header>
    <section className="intro" id="top"><span className="intro-kicker">WHO&apos;S WINNING NEXT?</span><h1>Hold LOTTO. Stay eligible. <span>One holder gets the pot.</span></h1></section>
    <section className="draws-section" id="draws"><div className="section-heading"><h2>LIVE DRAWS</h2><span><i /> UPDATING LIVE</span></div><div className="draw-grid"><DrawCard onEligibility={connect} /><DrawCard daily onEligibility={connect} /></div></section>
    <section className="eligibility-panel"><div className="eligibility-title"><Ticket /><h2>ARE YOU IN?</h2></div>{connected ? <div className="eligible-state"><span className="status-dot" /><div><strong>YOU&apos;RE IN</strong><p>42,810 LOTTO &nbsp;·&nbsp; Minimum required: 10,000 LOTTO</p><span>You&apos;re eligible for the next draw. Good luck.</span></div><Check /></div> : <div className="eligibility-row"><div><strong>Connect your wallet to see if you&apos;re eligible for the next draw.</strong><p>Demo mode — no real funds or lottery functionality connected.</p></div><button className="outline-button" onClick={connect}>CONNECT WALLET <ArrowRight /></button></div>}</section>
    <section className="secondary-grid"><article id="winner"><div className="section-heading"><h2>LAST WINNER</h2><span>DEMO RESULT</span></div><div className="winner-card"><Trophy /><div><strong>HOURLY WINNER</strong><p>7xK...92P</p></div><div><small>WON</small><b>$1,284.50</b></div><span className="next-draw">NEXT DRAW<br /><strong><Countdown initial={42 * 60 + 17} /></strong></span></div></article><article><div className="section-heading"><h2>LIVE ACTIVITY</h2><span><i /> LIVE</span></div><div className="activity-list"><p><i className="activity-dot green" /> Wallet 8Jf...2Kp became eligible <time>now</time></p><p><i className="activity-dot gold" /> Hourly pot increased +$42.18 <time>2m</time></p><p><i className="activity-dot red" /> New LOTTO holder <time>4m</time></p></div></article></section>
    <section className="how-section" id="how"><div className="section-heading"><h2>HOW IT WORKS</h2><span>FOUR SIMPLE STEPS</span></div><div className="steps-grid"><div><b>01</b><strong>HOLD LOTTO</strong><p>Keep the minimum amount in your wallet.</p></div><div><b>02</b><strong>STAY ELIGIBLE</strong><p>Stay eligible until the draw closes.</p></div><div><b>03</b><strong>WAIT FOR THE DRAW</strong><p>The countdown tells you exactly when.</p></div><div><b>04</b><strong>ONE HOLDER WINS</strong><p>A demo winner is selected from the pool.</p></div></div></section>
    <section className="transparency-section" id="transparency"><div className="section-heading"><h2>POOL TRANSPARENCY</h2><span>ALL VALUES ARE DEMO</span></div><div className="transparency-grid"><div><span>HOURLY POOL</span><strong>$1,284.50 DEMO</strong></div><div><span>DAILY POOL</span><strong>$8,920 DEMO</strong></div><div><span>TREASURY</span><strong>DEMO ADDRESS</strong></div></div></section>
    <footer><a className="brand" href="#top">LOTTO</a><span>SOLANA • DEMO &nbsp;|&nbsp; UI preview only. No real funds.</span><a href="#top">BACK TO TOP <ArrowRight /></a></footer>
  </main>
}

export default LottoDashboard
