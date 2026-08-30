'use client'

import { ExternalLink } from 'lucide-react'

const socials = [
  { label: 'LOTTO on X', name: 'X', href: 'https://x.com/LottoOnChain', icon: '𝕏' },
  { label: 'LOTTO on TikTok', name: 'TikTok', href: 'https://www.tiktok.com/@lotto_onchain', icon: '♪' },
]

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'social-links social-links-compact' : 'social-links'} aria-label="LOTTO social media"><span className="socials-label">SOCIALS</span>{socials.map((social) => <a key={social.href} className="social-link" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}><span className="social-icon" aria-hidden="true">{social.icon}</span>{!compact && <span>{social.name}</span>}<ExternalLink aria-hidden="true" /></a>)}</div>
}
