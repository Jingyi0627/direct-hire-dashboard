'use client'

const PROOF_STATS = [
  { value: '2.4K+', label: 'active candidates' },
  { value: '$0', label: 'recruiter fees' },
  { value: '~5 min', label: 'to go live' },
  { value: 'Direct', label: 'candidate contact' },
]

const CHECKLIST = ['Talk to candidates directly', 'AI-matched to your role', 'Cancel anytime']

// Right-sidebar employer CTA — a permanent, full "Post your opening" panel:
// headline + CTA, a 2×2 value grid, a checklist, and a secondary link.
export default function DirectHireCta() {
  return (
    <div className="dh-cta-panel">
      <div className="dh-cta-card">
        <div className="dh-cta-head">
          <span className="dh-cta-eyebrow">For employers</span>
          <h3 className="dh-cta-title">Post your opening</h3>
          <p className="dh-cta-desc">Reach active candidates directly — no middleman.</p>

          <button className="dh-cta-btn">
            Post a Job
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <p className="dh-cta-support">
            Get in front of candidates already browsing direct hire opportunities.
          </p>
        </div>

        {/* Value / proof — small dark stat cards (2×2) */}
        <div className="dh-cta-stats">
          {PROOF_STATS.map(s => (
            <div key={s.label} className="dh-cta-stat">
              <strong className="dh-cta-stat-val">{s.value}</strong>
              <span className="dh-cta-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Footer group — checklist + secondary link, anchored to the bottom */}
        <div className="dh-cta-foot">
          <div className="dh-cta-points">
            {CHECKLIST.map(p => (
              <div key={p} className="dh-cta-point">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{p}</span>
              </div>
            ))}
          </div>

          <a className="dh-cta-link" href="#">
            See how direct hiring works
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
