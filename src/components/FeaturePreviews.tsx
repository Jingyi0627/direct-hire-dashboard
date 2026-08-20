'use client'

import { useEffect, useState } from 'react'

type PreviewProps = {
  active: boolean
}

function usePlayCycle(active: boolean) {
  const [playId, setPlayId] = useState(0)

  useEffect(() => {
    if (active) setPlayId((id) => id + 1)
  }, [active])

  return playId
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function NotificationPreview({ active }: PreviewProps) {
  const playId = usePlayCycle(active)

  return (
    <div className="fp-stage" aria-hidden="true">
      <div key={playId} className={`fp-card fp-notify${playId > 0 ? ' is-playing' : ''}`}>
        <div className="fp-notify-desk">
          <div className="fp-notify-desk-line" />
          <div className="fp-notify-desk-line fp-notify-desk-line--short" />
          <div className="fp-notify-desk-row" />
        </div>

        <div className="fp-toast">
          <div className="fp-toast-icon">
            <span className="fp-toast-pulse" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="fp-toast-copy">
            <p className="fp-toast-kicker">New Job Match</p>
            <p className="fp-toast-title">Staff Product Manager · Stripe</p>
            <p className="fp-toast-meta">Hidden listing · 12 min before public</p>
          </div>
          <span className="fp-match-badge">98% match</span>
        </div>
      </div>
    </div>
  )
}

export function AgentChatPreview({ active }: PreviewProps) {
  const playId = usePlayCycle(active)

  return (
    <div className="fp-stage" aria-hidden="true">
      <div key={playId} className={`fp-card fp-chat${playId > 0 ? ' is-playing' : ''}`}>
        <div className="fp-chat-hd">
          <div className="fp-chat-av">N</div>
          <div className="fp-chat-meta">
            <p className="fp-chat-name">Nova</p>
            <p className="fp-chat-role">Reaching out to hiring managers</p>
          </div>
          <span className="fp-chat-live">
            <span className="fp-chat-live-dot" />
            Online
          </span>
        </div>

        <div className="fp-chat-thread">
          <div className="fp-bubble fp-bubble--ai">
            Drafting a note to Maya Chen, Hiring Manager at Stripe.
          </div>

          <div className="fp-typing">
            <span />
            <span />
            <span />
          </div>

          <div className="fp-bubble fp-bubble--ai fp-bubble--sent">
            Hi Maya — introducing Alex for Staff PM. Strong product sense, shipped 0→1 growth at two series B teams. Open to a 20-min intro this week?
          </div>
        </div>
      </div>
    </div>
  )
}

const ATS_RADIUS = 42
const ATS_CIRCUMFERENCE = 2 * Math.PI * ATS_RADIUS

export function ResumeAtsPreview({ active }: PreviewProps) {
  const playId = usePlayCycle(active)
  const [score, setScore] = useState(65)

  useEffect(() => {
    if (!active) return

    setScore(65)
    let raf = 0
    const start = performance.now()
    const duration = 2000

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setScore(Math.round(65 + 33 * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  const offset = ATS_CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="fp-stage" aria-hidden="true">
      <div key={playId} className={`fp-card fp-resume${playId > 0 ? ' is-playing' : ''}`}>
        <div className="fp-resume-cols">
          <article className="fp-resume-sheet">
            <p className="fp-resume-label">Original</p>
            <h4>Alex Chen</h4>
            <p className="fp-resume-sub">Product Manager</p>
            <p className="fp-kw">roadmap</p>
            <p className="fp-kw">stakeholder updates</p>
            <p className="fp-kw">team of 4</p>
          </article>

          <article className="fp-resume-sheet fp-resume-sheet--tailored">
            <p className="fp-resume-label fp-resume-label--ai">Tailored</p>
            <h4>Alex Chen</h4>
            <p className="fp-resume-sub">Staff Product Manager</p>
            <p className="fp-kw is-hit">0→1 product strategy</p>
            <p className="fp-kw is-hit">ATS · marketplace growth</p>
            <p className="fp-kw is-hit">cross-functional leadership</p>
            <span className="fp-scanner" />
          </article>
        </div>

        <div className="fp-ats">
          <div className="fp-ats-ring">
            <svg viewBox="0 0 108 108" width="108" height="108">
              <circle className="fp-ats-track" cx="54" cy="54" r={ATS_RADIUS} />
              <circle
                className="fp-ats-progress"
                cx="54"
                cy="54"
                r={ATS_RADIUS}
                style={{
                  strokeDasharray: ATS_CIRCUMFERENCE,
                  strokeDashoffset: offset,
                }}
              />
            </svg>
            <div className="fp-ats-value">
              <strong>{score}%</strong>
              <span>ATS</span>
            </div>
          </div>
          <p className={`fp-ats-badge${score >= 96 ? ' is-on' : ''}`}>AI match</p>
        </div>
      </div>
    </div>
  )
}

const PIPELINE_JOBS = [
  { company: 'Notion', role: 'Senior Product Manager' },
  { company: 'Figma', role: 'Product Lead' },
  { company: 'Stripe', role: 'Staff Product Manager' },
]

export function AutoApplyPreview({ active }: PreviewProps) {
  const playId = usePlayCycle(active)
  const [applied, setApplied] = useState(284)

  useEffect(() => {
    if (!active) return
    setApplied(284)
    let raf = 0
    const start = performance.now()
    const duration = 2200

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setApplied(Math.round(284 + 28 * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])

  return (
    <div className="fp-stage" aria-hidden="true">
      <div key={playId} className={`fp-card fp-pipeline${playId > 0 ? ' is-playing' : ''}`}>
        <div className="fp-pipeline-hd">
          <div>
            <p>Auto-apply pipeline</p>
            <span className="fp-pipeline-count">{applied}+ Applied</span>
          </div>
          <span className="fp-pipeline-live">
            <span className="fp-chat-live-dot" />
            Live
          </span>
        </div>

        <ul className="fp-pipeline-list">
          {PIPELINE_JOBS.map((job) => (
            <li key={job.company} className="fp-pipeline-row">
              <div className="fp-pipeline-copy">
                <p className="fp-pipeline-role">{job.role}</p>
                <p className="fp-pipeline-co">{job.company}</p>
              </div>
              <div className="fp-pipeline-status">
                <div className="fp-pipeline-bar">
                  <span />
                </div>
                <span className="fp-pipeline-check">
                  <CheckIcon />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
