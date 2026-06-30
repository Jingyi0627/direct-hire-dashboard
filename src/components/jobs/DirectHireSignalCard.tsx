'use client'
import { useState } from 'react'
import type { DirectHireSignal } from './directHireData'
import { MatchRing, getJobCardMatchTier } from './JobCard'

const LinkedInGlyph = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const CheckGlyph = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/** LinkedIn profile photo with initials fallback + a small LinkedIn source badge. */
function SignalAvatar({ signal }: { signal: DirectHireSignal }) {
  const [imgError, setImgError] = useState(false)
  const initials = signal.hiringManagerName
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
  const showPhoto = !!signal.hiringManagerPhotoUrl && !imgError

  return (
    <div className="dh-av">
      {showPhoto ? (
        <img
          className="dh-av-img"
          src={signal.hiringManagerPhotoUrl as string}
          alt={signal.hiringManagerName}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="dh-av-fallback" style={{ background: signal.companyColor }}>
          {initials}
        </div>
      )}
      <span className="dh-av-badge" title="Sourced from LinkedIn" aria-label="Sourced from LinkedIn">
        <LinkedInGlyph size={9} />
      </span>
    </div>
  )
}

type Props = {
  signal: DirectHireSignal
  /** When false, Contact / card click opens the LinkedIn connect prompt instead. */
  connected: boolean
  /** Results view: show a selection checkbox and toggle selection on card click. */
  selectable?: boolean
  selected?: boolean
  onToggleSelect?: (id: string) => void
  /** Pre-search sample card: adds a "We're hiring" headline + "See More" button. */
  sample?: boolean
  /** Opens the original post (and records the click). Connected state only. */
  onContact: (signal: DirectHireSignal) => void
  /** Called for any locked action while LinkedIn is not connected. */
  onLocked?: () => void
}

export default function DirectHireSignalCard({
  signal,
  connected,
  selectable = false,
  selected = false,
  onToggleSelect,
  sample = false,
  onContact,
  onLocked,
}: Props) {
  const openPost = () => {
    if (!connected) {
      onLocked?.()
      return
    }
    onContact(signal)
  }

  // Card body click: select (results view) → connect prompt (locked) → open post.
  const handleCardClick = () => {
    if (selectable) onToggleSelect?.(signal.id)
    else openPost()
  }

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation() // don't double-trigger the card's click handler
    openPost()
  }

  // Always show the match ring whenever a score exists — no threshold, low scores included.
  const showMatch = typeof signal.matchScore === 'number'

  // Show at most 2 category chips; collapse any extras into a "+N" chip.
  const categoryChips = signal.categories.slice(0, 2)
  const overflowCount = signal.categories.length - categoryChips.length

  return (
    <article
      className={`dh-card${selectable ? ' dh-card--selectable' : ''}${selected ? ' is-selected' : ''}`}
      role={selectable ? 'checkbox' : 'link'}
      aria-checked={selectable ? selected : undefined}
      tabIndex={0}
      aria-label={
        selectable
          ? `Select ${signal.hiringManagerName} — ${signal.jobTitle} at ${signal.companyName}`
          : `Open LinkedIn post for ${signal.jobTitle} at ${signal.companyName}`
      }
      onClick={handleCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Subtle preview banner — only on pre-connection example cards */}
      {sample && (
        <p className="dh-preview-tag">
          <span className="dh-preview-dot" /> Curated based on Job Preference
        </p>
      )}

      {/* Top row — selection checkbox (results) + hiring manager + match ring */}
      <div className="dh-card-top">
        {selectable && (
          <span className={`dh-check${selected ? ' is-on' : ''}`} aria-hidden="true">
            {selected && <CheckGlyph size={12} />}
          </span>
        )}
        <SignalAvatar signal={signal} />
        <div className="dh-mgr">
          <p className="dh-mgr-name">{signal.hiringManagerName}</p>
          <p className="dh-mgr-title">
            {signal.hiringManagerTitle} · {signal.companyName}
          </p>
        </div>
        {showMatch && (
          <MatchRing pct={signal.matchScore as number} tier={getJobCardMatchTier(signal.matchScore as number)} compact />
        )}
      </div>

      {/* Role + meta (location · time posted) */}
      <div className="dh-card-body">
        {sample && <p className="dh-hiring-eyebrow">We’re hiring</p>}
        <h3
          className="dh-role"
          onClick={e => {
            e.stopPropagation()
            openPost()
          }}
        >
          {signal.jobTitle}
        </h3>
        <div className="dh-meta-row">
          <span className="dh-meta-item">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="dh-loc">{signal.location}</span>
          </span>
          <span className="dh-meta-dot" />
          <span className="dh-posted">{signal.postedAt}</span>
        </div>
      </div>

      {/* Original LinkedIn post — 2-line snippet for context */}
      <p className="dh-preview">{signal.postPreview}</p>

      {/* Category chips (if any) */}
      {categoryChips.length > 0 && (
        <div className="dh-chips">
          {categoryChips.map(c => (
            <span key={c} className="dh-tag">
              {c}
            </span>
          ))}
          {overflowCount > 0 && <span className="dh-tag dh-tag--more">+{overflowCount}</span>}
        </div>
      )}

      {/* Footer — full-width LinkedIn-style action (Contact / See More) */}
      <div className="dh-card-ft">
        <button className="dh-contact-btn" onClick={handleContact}>
          <LinkedInGlyph size={12} />
          Contact
        </button>
      </div>
    </article>
  )
}
