'use client'
import { useState, useEffect, useMemo } from 'react'
import DirectHireSignalCard from './DirectHireSignalCard'
import LinkedInConnectModal from './LinkedInConnectModal'
import { FilterDropdownButton, SortPanelItemButton, FilterPanelOptionButton, SearchClearButton } from '@/components/Buttons'
import {
  CURRENT_USER,
  DIRECT_HIRE_SIGNALS,
  PREVIEW_SIGNALS,
  WORK_AREA_OPTIONS,
  CAREER_LEVEL_OPTIONS,
  ROLE_TYPE_OPTIONS,
  POST_TIME_OPTIONS,
  DEFAULT_POST_TIME_DAYS,
  OUTREACH_META,
  filterSignals,
  generateRequest,
  trackContactClick,
  type DirectHireSignal,
  type OutreachType,
} from './directHireData'

// ── Small shared glyphs ──────────────────────────────────────────────
const LinkedInGlyph = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const CheckIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const BoltIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 2 4.5 13.2c-.4.5-.04 1.3.6 1.3H11l-1 7.5 8.5-11.2c.4-.5.04-1.3-.6-1.3H12l1-7.5z" />
  </svg>
)

/** Small lime premium pill shown beside the page title. */
function PremiumBadge() {
  return (
    <span className="dh-premium-badge">
      <BoltIcon size={11} /> Premium
    </span>
  )
}

/** Compact avatar reused by the review step. */
function ReviewAvatar({ signal, size = 38 }: { signal: DirectHireSignal; size?: number }) {
  const [imgError, setImgError] = useState(false)
  const initials = signal.hiringManagerName.split(' ').slice(0, 2).map(w => w[0]).join('')
  const showPhoto = !!signal.hiringManagerPhotoUrl && !imgError
  return (
    <div className="dh-av" style={{ width: size, height: size }}>
      {showPhoto ? (
        <img className="dh-av-img" style={{ width: size, height: size }} src={signal.hiringManagerPhotoUrl as string} alt={signal.hiringManagerName} loading="lazy" onError={() => setImgError(true)} />
      ) : (
        <div className="dh-av-fallback" style={{ width: size, height: size, background: signal.companyColor }}>{initials}</div>
      )}
      <span className="dh-av-badge"><LinkedInGlyph size={9} /></span>
    </div>
  )
}

// ── Compact workflow stepper ─────────────────────────────────────────
const FLOW_STEPS = ['Connect LinkedIn', 'Direct Hire Signals', 'Send Outreach in Bulk']

function FlowStepper({ step }: { step: number }) {
  return (
    <ol className="dh-flow" aria-label="Direct Hire workflow">
      {FLOW_STEPS.map((label, i) => (
        <li
          key={label}
          className={`dh-flow-step${i === step ? ' is-current' : ''}${i < step ? ' is-done' : ''}`}
        >
          <span className="dh-flow-dot">{i < step ? <CheckIcon size={9} /> : i + 1}</span>
          <span className="dh-flow-label">{label}</span>
          {i < FLOW_STEPS.length - 1 && (
            <svg className="dh-flow-sep" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}

// ── Outreach type chooser (compact dialog, not full-screen) ──────────
function OutreachChooser({
  count,
  onChoose,
  onClose,
}: {
  count: number
  onChoose: (t: OutreachType) => void
  onClose: () => void
}) {
  return (
    <div className="dh-chooser-overlay" onClick={onClose}>
      <div className="dh-chooser" role="dialog" aria-modal="true" aria-label="Choose outreach type" onClick={e => e.stopPropagation()}>
        <button className="dh-chooser-close" onClick={onClose} aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <h3 className="dh-chooser-title">Choose your outreach type</h3>
        <p className="dh-chooser-desc">
          We’ll draft personalized requests for the {count} contact{count === 1 ? '' : 's'} you selected. You’ll review every message before anything is sent.
        </p>
        <div className="dh-chooser-opts">
          {(['referral', 'hiring-manager'] as const).map(t => (
            <button key={t} className="dh-chooser-opt" onClick={() => onChoose(t)}>
              <span className="dh-chooser-opt-title">{OUTREACH_META[t].label}</span>
              <span className="dh-chooser-opt-blurb">{OUTREACH_META[t].blurb}</span>
              <span className="dh-chooser-opt-arrow" aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DirectHireBoard() {
  // ── LinkedIn connection ──
  const [connected, setConnected] = useState(false)
  // The connect modal handles credentials, verification + the success state.
  const [connectOpen, setConnectOpen] = useState(false)

  // ── Workflow view ──
  type View = 'feed' | 'loading' | 'results' | 'review'
  const [view, setView] = useState<View>('feed')

  // ── Filters ──
  // Work Areas, Career Levels and Role Types are multi-select checklists.
  // An empty array means "All" (no constraint) for that group.
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState(CURRENT_USER.onboardingLocation)
  const [workAreas, setWorkAreas] = useState<string[]>([])
  const [careerLevels, setCareerLevels] = useState<string[]>([])
  const [roleTypes, setRoleTypes] = useState<string[]>([])
  const [postedDays, setPostedDays] = useState<number>(DEFAULT_POST_TIME_DAYS)
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  // Toggle a value within one of the multi-select filter groups.
  const toggleIn = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) =>
    setter(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]))

  // ── Results selection + outreach ──
  const [results, setResults] = useState<DirectHireSignal[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [choosingOutreach, setChoosingOutreach] = useState(false)
  const [outreachType, setOutreachType] = useState<OutreachType | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [sent, setSent] = useState<Set<string>>(new Set())

  // Close any open dropdown when clicking outside its trigger/panel.
  useEffect(() => {
    if (openFilter === null) return
    const onDown = (e: PointerEvent) => {
      const root = document.querySelector<HTMLElement>(`[data-dh-filter="${openFilter}"]`)
      if (root && e.target instanceof Node && !root.contains(e.target)) setOpenFilter(null)
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [openFilter])

  const postedLabel = POST_TIME_OPTIONS.find(o => o.days === postedDays)?.label ?? 'Past 24 hours'

  // Summary shown inside a multi-select trigger: placeholder when empty,
  // the single value when one is picked, otherwise "N selected".
  const multiLabel = (selected: string[], placeholder: string) =>
    selected.length === 0 ? placeholder : selected.length === 1 ? selected[0] : `${selected.length} selected`

  // ── Workflow step for the flow indicator ──
  // 0 Connect LinkedIn · 1 Direct Hire Signals · 2 Send Outreach in Bulk
  const flowStep = !connected ? 0 : view === 'review' ? 2 : 1

  // ── Connect / disconnect ──
  // Any locked action (Connect button, a preview card, Contact) opens the modal.
  const openConnect = () => {
    if (connected) return
    setConnectOpen(true)
  }
  // Fired from the modal's success state — flips the page into the connected view.
  const handleConnected = () => {
    setConnectOpen(false)
    setConnected(true)
    // Surface real signals immediately after connecting.
    loadResults()
  }
  const handleDisconnect = () => {
    setConnected(false)
    setView('feed')
    setResults([])
    setSelected(new Set())
  }

  // ── Search ──
  // Runs the loading → results transition against the current filters.
  const loadResults = () => {
    setSelected(new Set())
    setOutreachType(null)
    setView('loading')
    setOpenFilter(null)
    setTimeout(() => {
      const found = filterSignals(
        DIRECT_HIRE_SIGNALS,
        { query, location, workAreas, careerLevels, roleTypes, postedDays },
        CURRENT_USER.jobCategories,
      )
      setResults(found)
      setView('results')
    }, 1400)
  }
  const runSearch = () => {
    if (!connected) {
      openConnect()
      return
    }
    loadResults()
  }

  // ── Selection ──
  const toggleSelect = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  const allSelected = results.length > 0 && selected.size === results.length
  const toggleSelectAll = () =>
    setSelected(allSelected ? new Set() : new Set(results.map(r => r.id)))

  const selectedSignals = useMemo(
    () => results.filter(r => selected.has(r.id)),
    [results, selected],
  )

  // Opens the original LinkedIn post + records the click.
  const contactSignal = (signal: DirectHireSignal) => {
    trackContactClick({
      userId: CURRENT_USER.id,
      signalId: signal.id,
      hiringManagerName: signal.hiringManagerName,
      companyName: signal.companyName,
      linkedInPostUrl: signal.linkedInPostUrl,
      clickedAt: new Date().toISOString(),
    })
    window.open(signal.linkedInPostUrl, '_blank', 'noopener,noreferrer')
  }

  // ── Outreach generation ──
  const buildDrafts = (type: OutreachType) => {
    const next: Record<string, string> = {}
    selectedSignals.forEach(s => { next[s.id] = generateRequest(s, type) })
    setDrafts(next)
  }
  const handleChooseOutreach = (type: OutreachType) => {
    setOutreachType(type)
    buildDrafts(type)
    setSent(new Set())
    setChoosingOutreach(false)
    setView('review')
  }
  const switchOutreachType = (type: OutreachType) => {
    setOutreachType(type)
    buildDrafts(type)
  }
  const sendOne = (id: string) => setSent(prev => new Set(prev).add(id))
  const sendAll = () => setSent(new Set(selectedSignals.map(s => s.id)))
  const backToResults = () => setView('results')

  return (
    <>
      {/* ── Header: title + flow + connection + filters ── */}
      <div className="dh-head">
        <div className="dh-head-titles">
          <div className="dh-title-row">
            <h1 className="dh-title">Direct Hire Signals</h1>
            <PremiumBadge />
          </div>
          <p className="dh-subtitle">
            Find hiring managers posting on LinkedIn and reach them with bulk outreach.
            <span className="dh-subtitle-note"> Available for Premium and Free Trial users.</span>
          </p>
          {/* Workflow indicator + Connect CTA share a row when not connected */}
          <div className="dh-flow-row">
            <FlowStepper step={flowStep} />
            {!connected && (
              <button className="dh-connect-btn" onClick={openConnect}>
                <LinkedInGlyph size={15} /> Connect LinkedIn
              </button>
            )}
          </div>
        </div>

        {/* Connection area — compact connected status (modal handles the rest) */}
        {connected && (
          <div className="dh-connected">
            <img className="dh-connected-av" src={CURRENT_USER.linkedInPhotoUrl} alt={CURRENT_USER.linkedInName} />
            <p className="dh-connected-id">
              <span className="dh-connected-name">{CURRENT_USER.linkedInName}</span>
              <span className="dh-connected-sep" aria-hidden="true">·</span>
              <span className="dh-connected-headline">{CURRENT_USER.linkedInHeadline}</span>
            </p>
            <span className="dh-connected-badge"><span className="dh-dot-live" /> LinkedIn Connected</span>
            <button className="dh-disconnect-btn" onClick={handleDisconnect}>Disconnect</button>
          </div>
        )}

        {/* Filters — only visible after LinkedIn is connected */}
        {connected && (
        <div className="dh-filters">
          <div className="dh-search-row">
            <div className={`jb-search dh-search${query ? ' is-filled' : ''}`}>
              <svg className="jb-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                className="jb-search-input"
                placeholder="Search roles, companies, hiring managers…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') runSearch() }}
              />
              {query && <SearchClearButton onClick={() => setQuery('')} />}
            </div>
            <button className="dh-search-btn" onClick={runSearch}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Search
            </button>
          </div>

          <div className="dh-filter-chips">
            {/* Editable location */}
            <div className="dh-loc-field">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <input
                className="dh-loc-input"
                aria-label="Location"
                placeholder="Anywhere"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
              {location && (
                <button className="dh-loc-clear" aria-label="Clear location" onClick={() => setLocation('')}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
            </div>

            {/* Work areas — multi-select checklist */}
            <div className="jb-drop-wrap" data-dh-filter="work">
              <FilterDropdownButton
                open={openFilter === 'work'}
                active={workAreas.length > 0}
                onClick={() => setOpenFilter(f => (f === 'work' ? null : 'work'))}
              >
                {multiLabel(workAreas, 'Work areas')}
              </FilterDropdownButton>
              {openFilter === 'work' && (
                <div className="jb-filter-panel jb-filter-panel--scroll">
                  {WORK_AREA_OPTIONS.map(w => (
                    <FilterPanelOptionButton key={w} selected={workAreas.includes(w)} onClick={() => toggleIn(setWorkAreas, w)}>
                      {w}
                    </FilterPanelOptionButton>
                  ))}
                </div>
              )}
            </div>

            {/* Career levels — multi-select checklist */}
            <div className="jb-drop-wrap" data-dh-filter="level">
              <FilterDropdownButton
                open={openFilter === 'level'}
                active={careerLevels.length > 0}
                onClick={() => setOpenFilter(f => (f === 'level' ? null : 'level'))}
              >
                {multiLabel(careerLevels, 'Career levels')}
              </FilterDropdownButton>
              {openFilter === 'level' && (
                <div className="jb-filter-panel">
                  {CAREER_LEVEL_OPTIONS.map(c => (
                    <FilterPanelOptionButton key={c} selected={careerLevels.includes(c)} onClick={() => toggleIn(setCareerLevels, c)}>
                      {c}
                    </FilterPanelOptionButton>
                  ))}
                </div>
              )}
            </div>

            {/* Role type — multi-select checklist */}
            <div className="jb-drop-wrap" data-dh-filter="role">
              <FilterDropdownButton
                open={openFilter === 'role'}
                active={roleTypes.length > 0}
                onClick={() => setOpenFilter(f => (f === 'role' ? null : 'role'))}
              >
                {multiLabel(roleTypes, 'Role type')}
              </FilterDropdownButton>
              {openFilter === 'role' && (
                <div className="jb-filter-panel">
                  {ROLE_TYPE_OPTIONS.map(r => (
                    <FilterPanelOptionButton key={r} selected={roleTypes.includes(r)} onClick={() => toggleIn(setRoleTypes, r)}>
                      {r}
                    </FilterPanelOptionButton>
                  ))}
                </div>
              )}
            </div>

            {/* Post Time Range */}
            <div className="jb-drop-wrap" data-dh-filter="posted">
              <FilterDropdownButton
                open={openFilter === 'posted'}
                active={postedDays !== DEFAULT_POST_TIME_DAYS}
                onClick={() => setOpenFilter(f => (f === 'posted' ? null : 'posted'))}
              >
                {postedLabel}
              </FilterDropdownButton>
              {openFilter === 'posted' && (
                <div className="jb-filter-panel">
                  {POST_TIME_OPTIONS.map(o => (
                    <SortPanelItemButton key={o.days} selected={postedDays === o.days} onClick={() => { setPostedDays(o.days); setOpenFilter(null) }}>
                      {o.label}
                    </SortPanelItemButton>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* ── Scrolling body ── */}
      <div className="jb-list-scroll">
        {view === 'review' ? (
          <ReviewStep
            signals={selectedSignals}
            drafts={drafts}
            sent={sent}
            outreachType={outreachType as OutreachType}
            onChangeType={switchOutreachType}
            onEdit={(id, val) => setDrafts(d => ({ ...d, [id]: val }))}
            onSendOne={sendOne}
            onSendAll={sendAll}
            onBack={backToResults}
          />
        ) : view === 'loading' ? (
          <div className="dh-loading">
            <div className="dh-loading-orb" aria-hidden="true">
              <LinkedInGlyph size={22} />
            </div>
            <p className="dh-loading-title">Finding relevant hiring signals for you…</p>
            <p className="dh-loading-sub">Scanning fresh LinkedIn posts that match your filters.</p>
          </div>
        ) : view === 'results' ? (
          results.length > 0 ? (
            <>
              <div className="dh-results-bar">
                <button className={`dh-check dh-check--all${allSelected ? ' is-on' : ''}`} role="checkbox" aria-checked={allSelected} aria-label="Select all" onClick={toggleSelectAll}>
                  {allSelected && <CheckIcon size={12} />}
                </button>
                <span className="dh-results-count">
                  <strong>{results.length}</strong> signal{results.length === 1 ? '' : 's'} found
                </span>
                {selected.size > 0 && <span className="dh-results-sel">{selected.size} selected</span>}
              </div>
              <div className="dh-grid">
                {results.map(s => (
                  <DirectHireSignalCard
                    key={s.id}
                    signal={s}
                    connected={connected}
                    selectable
                    selected={selected.has(s.id)}
                    onToggleSelect={toggleSelect}
                    onContact={contactSignal}
                  />
                ))}
              </div>
              {/* Spacer so the docked action bar never hides the last row */}
              {selected.size > 0 && <div className="dh-bulk-spacer" />}
            </>
          ) : (
            <div className="dh-empty">
              <div className="dh-empty-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="dh-empty-title">No hiring signals found</p>
              <p className="dh-empty-desc">Try widening your location, role type, or post time range.</p>
            </div>
          )
        ) : (
          /* Not-connected feed — fictional, preference-based preview cards */
          <>
            <div className="dh-section-head">
              <span className="dh-section-title">Preview Direct Hire Signals</span>
              <span className="dh-section-hint">
                Connect LinkedIn to unlock real-time hiring signals matched to your job preferences.
              </span>
            </div>
            <div className="dh-grid">
              {PREVIEW_SIGNALS.map(s => (
                <DirectHireSignalCard
                  key={s.id}
                  signal={s}
                  connected={connected}
                  sample
                  onContact={contactSignal}
                  onLocked={openConnect}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Docked bulk action bar ── */}
      {view === 'results' && selected.size > 0 && (
        <div className="dh-bulk-bar">
          <span className="dh-bulk-count">{selected.size} contact{selected.size === 1 ? '' : 's'} selected</span>
          <button className="dh-bulk-btn" onClick={() => setChoosingOutreach(true)}>
            Send Outreach in Bulk
          </button>
        </div>
      )}

      {/* ── Outreach type chooser ── */}
      {choosingOutreach && (
        <OutreachChooser
          count={selected.size}
          onChoose={handleChooseOutreach}
          onClose={() => setChoosingOutreach(false)}
        />
      )}

      {/* ── LinkedIn connection modal ── */}
      {connectOpen && (
        <LinkedInConnectModal
          onClose={() => setConnectOpen(false)}
          onConnected={handleConnected}
        />
      )}
    </>
  )
}

// ── Review step ──────────────────────────────────────────────────────
function ReviewStep({
  signals,
  drafts,
  sent,
  outreachType,
  onChangeType,
  onEdit,
  onSendOne,
  onSendAll,
  onBack,
}: {
  signals: DirectHireSignal[]
  drafts: Record<string, string>
  sent: Set<string>
  outreachType: OutreachType
  onChangeType: (t: OutreachType) => void
  onEdit: (id: string, val: string) => void
  onSendOne: (id: string) => void
  onSendAll: () => void
  onBack: () => void
}) {
  const allSent = signals.length > 0 && signals.every(s => sent.has(s.id))
  const remaining = signals.filter(s => !sent.has(s.id)).length

  return (
    <div className="dh-review">
      <div className="dh-review-head">
        <button className="dh-back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Back to results
        </button>
        <div className="dh-review-titles">
          <h2 className="dh-review-title">Review personalized requests</h2>
          <p className="dh-review-sub">Edit any message before sending. Nothing is sent until you click send.</p>
        </div>
        <div className="dh-type-toggle" role="tablist" aria-label="Outreach type">
          {(['referral', 'hiring-manager'] as const).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={outreachType === t}
              className={`dh-type-tab${outreachType === t ? ' is-on' : ''}`}
              onClick={() => onChangeType(t)}
            >
              {OUTREACH_META[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="dh-review-list">
        {signals.map(s => {
          const isSent = sent.has(s.id)
          const text = drafts[s.id] ?? ''
          return (
            <div key={s.id} className={`dh-review-card${isSent ? ' is-sent' : ''}`}>
              <div className="dh-review-card-top">
                <ReviewAvatar signal={s} size={38} />
                <div className="dh-row-main">
                  <p className="dh-row-name">{s.hiringManagerName}</p>
                  <p className="dh-row-sub">{s.hiringManagerTitle} · {s.companyName}</p>
                </div>
                {isSent ? (
                  <span className="dh-sent-pill"><CheckIcon size={11} /> Sent</span>
                ) : (
                  <button className="dh-send-one" onClick={() => onSendOne(s.id)}>Send</button>
                )}
              </div>
              <textarea
                className="dh-review-text"
                value={text}
                disabled={isSent}
                onChange={e => onEdit(s.id, e.target.value)}
                rows={3}
              />
              <div className="dh-review-card-ft">
                <span className="dh-char-count">{text.length} characters</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dh-review-foot">
        <span className="dh-review-foot-note">
          {allSent
            ? 'All requests sent.'
            : `${remaining} of ${signals.length} ready to send — review before sending.`}
        </span>
        <button className="dh-sendall-btn" onClick={onSendAll} disabled={allSent}>
          {allSent ? 'All sent' : `Send all (${remaining})`}
        </button>
      </div>
    </div>
  )
}
