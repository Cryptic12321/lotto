'use client'

export function LottoPoolSplit() {
  return <section className="how-lotto-works" aria-labelledby="how-lotto-works-title">
    <div className="section-heading"><h2 id="how-lotto-works-title">HOW THE LOTTO WORKS</h2><span>TRANSPARENT POOL ALLOCATION</span></div>
    <p className="pool-split-intro">The total LOTTO earnings allocation is split between two separate draw systems. This describes how the pool is allocated; it does not guarantee winnings or profits.</p>
    <div className="pool-split-bar" role="img" aria-label="25 percent allocated to hourly draws and 75 percent allocated to the daily draw"><span className="pool-split-hourly">25%</span><span className="pool-split-daily">75%</span></div>
    <div className="pool-split-grid">
      <article><span className="pool-split-icon" aria-hidden="true">⚡</span><div><h3>HOURLY LOTTO — 25%</h3><p>25% of total LOTTO earnings goes toward hourly draws. A new draw happens every hour, exactly on the hour.</p></div></article>
      <article><span className="pool-split-icon" aria-hidden="true">🎰</span><div><h3>DAILY LOTTO — 75%</h3><p>75% of total LOTTO earnings goes toward the main featured draw at 6:00 PM ET.</p></div></article>
    </div>
  </section>
}

export default LottoPoolSplit
