'use client'
import { useState, useEffect, useMemo } from 'react'
import DirectHireSignalCard from './DirectHireSignalCard'
import { FilterDropdownButton, SortPanelItemButton, SearchClearButton } from '@/components/Buttons'
import {
  CURRENT_USER,
  DIRECT_HIRE_SIGNALS,
  CATEGORY_OPTIONS,
  POSTED_OPTIONS,
  SORT_LABELS,
  filterSignals,
  trackContactClick,
  type DirectHireSignal,
  type SortKey,
} from './directHireData'

function SignalCardSkeleton() {
  return (
    <div className="dh-card dh-skel" aria-hidden="true">
      <div className="dh-card-top">
        <div className="dh-skel-av" />
        <div className="dh-skel-lines">
          <span className="dh-skel-line dh-skel-line--60" />
          <span className="dh-skel-line dh-skel-line--40" />
        </div>
        <span className="dh-skel-ring" />
      </div>
      <div className="dh-card-body">
        <span className="dh-skel-line dh-skel-line--title" />
        <span className="dh-skel-line dh-skel-line--30" />
      </div>
      <div className="dh-skel-preview">
        <span className="dh-skel-line dh-skel-line--full" />
        <span className="dh-skel-line dh-skel-line--60" />
      </div>
      <div className="dh-chips">
        <span className="dh-skel-pill" />
        <span className="dh-skel-pill" />
      </div>
      <div className="dh-card-ft">
        <span className="dh-skel-btn" />
      </div>
    </div>
  )
}

export default function DirectHireBoard() {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  // Location is pre-filled from onboarding but fully editable.
  const [location, setLocation] = useState(CURRENT_USER.onboardingLocation)
  const [category, setCategory] = useState<string>('All categories')
  const [postedDays, setPostedDays] = useState<number>(3) // default: last 3 days
  const [sort, setSort] = useState<SortKey>('best')
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  // Simulate the initial crawl/fetch so skeletons are visible.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100)
    return () => clearTimeout(t)
  }, [])

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

  const results = useMemo(
    () =>
      filterSignals(
        DIRECT_HIRE_SIGNALS,
        { query, location, category, postedDays, sort },
        CURRENT_USER.jobCategories,
      ),
    [query, location, category, postedDays, sort],
  )

  const postedLabel = POSTED_OPTIONS.find(o => o.days === postedDays)?.label ?? 'Last 3 days'

  // Context line, e.g. "Showing Product Design, Engineering roles near New York"
  const shownCategories =
    category === 'All categories' ? CURRENT_USER.jobCategories.slice(0, 2).join(', ') : category
  const locShort = location.split(',')[0].trim() || 'anywhere'

  const handleContact = (signal: DirectHireSignal) => {
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

  return (
    <>
      {/* Fixed header + filter row */}
      <div className="dh-head">
        <div className="dh-head-titles">
          <h1 className="dh-title">Direct Hire Signals</h1>
          <p className="dh-subtitle">
            Fresh hiring posts from hiring managers, matched to your preferences.
          </p>
          <p className="dh-stats">
            <strong>{loading ? '—' : results.length}</strong> signal{results.length === 1 ? '' : 's'} found
            <span className="dh-stats-dot" />
            Updated 2h ago
            <span className="dh-stats-dot" />
            Showing <span className="dh-stats-em">{shownCategories}</span> roles near{' '}
            <span className="dh-stats-em">{locShort}</span>
          </p>
        </div>

        {/* Filter row */}
        <div className="dh-filters">
          <div className={`jb-search dh-search${query ? ' is-filled' : ''}`}>
            <svg className="jb-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              className="jb-search-input"
              placeholder="Search roles, companies, hiring managers…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && <SearchClearButton onClick={() => setQuery('')} />}
          </div>

          {/* Filter chips — one row beneath the search bar */}
          <div className="dh-filter-chips">
          {/* Editable location (pre-filled from onboarding) */}
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

          {/* Category */}
          <div className="jb-drop-wrap" data-dh-filter="category">
            <FilterDropdownButton
              open={openFilter === 'category'}
              active={category !== 'All categories'}
              onClick={() => setOpenFilter(f => (f === 'category' ? null : 'category'))}
            >
              {category}
            </FilterDropdownButton>
            {openFilter === 'category' && (
              <div className="jb-filter-panel">
                {CATEGORY_OPTIONS.map(c => (
                  <SortPanelItemButton key={c} selected={category === c} onClick={() => { setCategory(c); setOpenFilter(null) }}>
                    {c}
                  </SortPanelItemButton>
                ))}
              </div>
            )}
          </div>

          {/* Posted date */}
          <div className="jb-drop-wrap" data-dh-filter="posted">
            <FilterDropdownButton
              open={openFilter === 'posted'}
              active={postedDays !== 3}
              onClick={() => setOpenFilter(f => (f === 'posted' ? null : 'posted'))}
            >
              {postedLabel}
            </FilterDropdownButton>
            {openFilter === 'posted' && (
              <div className="jb-filter-panel">
                {POSTED_OPTIONS.map(o => (
                  <SortPanelItemButton key={o.days} selected={postedDays === o.days} onClick={() => { setPostedDays(o.days); setOpenFilter(null) }}>
                    {o.label}
                  </SortPanelItemButton>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="jb-drop-wrap" data-dh-filter="sort">
            <FilterDropdownButton
              open={openFilter === 'sort'}
              onClick={() => setOpenFilter(f => (f === 'sort' ? null : 'sort'))}
              className="jb-fdrop--sort"
            >
              {SORT_LABELS[sort]}
            </FilterDropdownButton>
            {openFilter === 'sort' && (
              <div className="jb-filter-panel jb-filter-panel--right">
                {(['best', 'recent'] as const).map(v => (
                  <SortPanelItemButton key={v} selected={sort === v} onClick={() => { setSort(v); setOpenFilter(null) }}>
                    {SORT_LABELS[v]}
                  </SortPanelItemButton>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Scrolling results */}
      <div className="jb-list-scroll">
        {loading ? (
          <div className="dh-grid">
            {Array.from({ length: 6 }).map((_, i) => <SignalCardSkeleton key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <div className="dh-grid">
            {results.map(s => (
              <DirectHireSignalCard key={s.id} signal={s} onContact={handleContact} />
            ))}
          </div>
        ) : (
          <div className="dh-empty">
            <div className="dh-empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <p className="dh-empty-title">No direct hire signals found yet</p>
            <p className="dh-empty-desc">Try adjusting your location, job category, or posted date filters.</p>
            <a className="dh-empty-btn" href="#">Update Job Preferences</a>
          </div>
        )}
      </div>
    </>
  )
}
