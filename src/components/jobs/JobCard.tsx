import type React from 'react'
import type { Job } from './types'

function CompanyAvatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div className="jb-co-av" style={{ '--co': color, '--sz': `${size}px` } as React.CSSProperties}>
      {initials}
    </div>
  )
}

export type JobCardMatchTier = 'low' | 'mid' | 'high' | 'elite'

export function getJobCardMatchTier(match: number): JobCardMatchTier {
  if (match >= 80) return 'elite'
  if (match >= 65) return 'high'
  if (match >= 50) return 'mid'
  return 'low'
}

export function MatchRing({ pct, tier, compact = false }: { pct: number; tier: JobCardMatchTier; compact?: boolean }) {
  const radius = compact ? 20 : 28
  const stroke = compact ? 6 : 8
  const size = radius * 2 + stroke
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - pct / 100)

  return (
    <div className={`jb-ring${compact ? ' jb-ring--compact' : ''}`}>
      <svg className="jb-ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className={`jb-ring-track jb-ring-track--${tier}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className={`jb-ring-progress jb-ring-progress--${tier}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ '--ring-start-offset': `${circumference}`, '--ring-target-offset': `${dashOffset}` } as React.CSSProperties}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="jb-ring-inner">
        <span className="jb-ring-pct">{pct}<span className="jb-ring-pc">%</span></span>
        <span className="jb-ring-lbl">match</span>
      </div>
    </div>
  )
}

function WorkModeBadge({ mode }: { mode: Job['workMode'] }) {
  const cls = { Remote: 'jb-wm--remote', Hybrid: 'jb-wm--hybrid', 'On-site': 'jb-wm--onsite' }[mode]
  return <span className={`jb-wm ${cls}`}>{mode}</span>
}

type JobCardProps = {
  job: Job
  onSave: (id: number) => void
}

export default function JobCard({ job, onSave }: JobCardProps) {
  const isApplied = !!job.appliedDate
  const isSaved = job.saved
  const matchTier = getJobCardMatchTier(job.match)
  const applicantsText = job.applicants < 10 ? 'Be an early applicant' : `${job.applicants} applicants`

  return (
    <article className="jb-card" data-match-tier={matchTier}>
      {/* Top row: time · applicants + save / link icons */}
      <div className="jb-card-top">
        <div className="jb-card-top-meta">
          <span className="jb-mt">{job.posted}</span>
          <span className="jb-mtsep" />
          <span className="jb-mt">{applicantsText}</span>
        </div>
        <div className="jb-card-top-actions">
          <button
            className={`jb-ico${isSaved ? ' is-saved' : ''}`}
            onClick={() => onSave(job.id)}
            aria-label="Save job"
            aria-pressed={isSaved}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round"
              fill={isSaved ? 'var(--color-main-default)' : 'none'}
              stroke={isSaved ? 'var(--color-main-default)' : 'currentColor'}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <a className="jb-ico" href="#" aria-label="Open original listing">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Header: company avatar + name/title | match ring */}
      <div className="jb-card-hd">
        <div className="jb-card-hd-left">
          <CompanyAvatar name={job.company} color={job.companyColor} size={46} />
          <div className="jb-card-hd-info">
            <p className="jb-co">{job.company}</p>
            <h3 className="jb-title">{job.title}</h3>
            <div className="jb-card-title-meta">
              <div className="jb-loc-row">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="jb-loc">{job.location}</span>
              </div>

              <div className="jb-card-tags">
                <WorkModeBadge mode={job.workMode} />
                <span className="jb-tag">{job.type}</span>
                <span className="jb-tag">{job.level}</span>
                <span className="jb-tag">{job.exp} exp</span>
                <span className="jb-tag jb-tag--salary">{job.salary}</span>
              </div>
            </div>
          </div>
        </div>
        <MatchRing pct={job.match} tier={matchTier} />
      </div>

      {/* Footer: primary actions */}
      <div className="jb-card-ft">
        <div className="jb-ft-actions">
          <button className="jb-ref-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Referral
          </button>
          {isApplied ? (
            <span className="jb-applied-btn">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Applied {job.appliedDate}
              {job.badges.includes('Auto Applied') && <span className="jb-applied-auto">· Auto</span>}
            </span>
          ) : (
            <button className="jb-apply-btn">
              Apply Now
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
