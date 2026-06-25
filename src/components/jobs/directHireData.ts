// ── Direct Hire Signals — data model, user context & tracking ────────
//
// A "signal" represents a fresh hiring post crawled from a hiring
// manager's LinkedIn feed. The shape mirrors what the backend crawler
// is expected to return, so swapping mock → real data is a drop-in.

export type DirectHireSignal = {
  id: string
  hiringManagerName: string
  hiringManagerTitle: string
  /** LinkedIn profile photo. May be null/absent → card falls back to initials. */
  hiringManagerPhotoUrl?: string | null
  companyName: string
  companyInitials: string
  companyColor: string
  jobTitle: string
  /** Display format matches the rest of the app: "City, ST" / "Remote". */
  location: string
  /** Human label, e.g. "2d ago". */
  postedAt: string
  /** Numeric age in days — used for the "posted within N days" filter. */
  postedDaysAgo: number
  /** Original LinkedIn post — opened on Contact / card / title click. */
  linkedInPostUrl: string
  /** Short preview of the original LinkedIn post — shown as a 2-line snippet. */
  postPreview: string
  /** Optional. Only shown to Pro users when present; hidden entirely otherwise. */
  matchScore?: number
  /** Top-level categories this role belongs to (used for personalization). */
  categories: string[]
  source: 'LinkedIn'
}

// ── Current user / onboarding context ────────────────────────────────
// In production this comes from auth + the Job Preferences onboarding.
export const CURRENT_USER = {
  id: 'user_nova_001',
  isPro: true,
  /** Pre-fills the location filter; the user can still edit it. */
  onboardingLocation: 'New York, NY',
  /** Top-level Job Preference categories — drives which signals are relevant. */
  jobCategories: ['Product Design', 'Engineering', 'AI', 'Product'],
}

/** Options for the category filter dropdown. */
export const CATEGORY_OPTIONS = ['All categories', ...CURRENT_USER.jobCategories]

/** Options for the "posted within" filter. Default is 3 days. */
export const POSTED_OPTIONS: { label: string; days: number }[] = [
  { label: 'Last 24 hours', days: 1 },
  { label: 'Last 3 days', days: 3 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 14 days', days: 14 },
]

export type SortKey = 'best' | 'recent'
export const SORT_LABELS: Record<SortKey, string> = {
  best: 'Best Match',
  recent: 'Most Recent',
}

// ── Contact-click tracking ───────────────────────────────────────────
export type ContactClickEvent = {
  userId: string
  signalId: string
  hiringManagerName: string
  companyName: string
  linkedInPostUrl: string
  clickedAt: string
}

/**
 * Records a Contact click so the app can count contacts per user.
 * Placeholder implementation — wire to the real endpoint when ready:
 *   fetch('/api/track/contact-click', { method: 'POST', body: JSON.stringify(event) })
 */
export function trackContactClick(event: ContactClickEvent): void {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.info('[trackContactClick]', event)
  }
}

// ── Mock signals ─────────────────────────────────────────────────────
// Structured to exercise the real filtering rules:
//  • most are within the last 3 days (default window)
//  • categories map to the user's Job Preferences (a "Data" role is
//    intentionally off-list to show personalization)
//  • locations are NY-metro / Remote, with SF + an old post to show
//    location + recency filtering in action.
export const DIRECT_HIRE_SIGNALS: DirectHireSignal[] = [
  {
    id: 'signal_001',
    hiringManagerName: 'Sarah Chen',
    hiringManagerTitle: 'Head of Engineering',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=47',
    companyName: 'Agency AI',
    companyInitials: 'A',
    companyColor: '#7c3aed',
    jobTitle: 'Founding AI Engineer',
    location: 'Remote (US)',
    postedAt: 'Today',
    postedDaysAgo: 0,
    linkedInPostUrl: 'https://www.linkedin.com/posts/sarah-chen_founding-ai-engineer',
    postPreview:
      'Sarah posted that Agency AI is hiring a founding engineer to help build early-stage AI products from zero to one. Looking for someone who ships fast and owns the full stack.',
    matchScore: 87,
    categories: ['Engineering', 'AI'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_002',
    hiringManagerName: 'Marcus Lee',
    hiringManagerTitle: 'VP of Product',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=12',
    companyName: 'Glide',
    companyInitials: 'G',
    companyColor: '#2563eb',
    jobTitle: 'Senior Product Designer',
    location: 'New York, NY',
    postedAt: '1d ago',
    postedDaysAgo: 1,
    linkedInPostUrl: 'https://www.linkedin.com/posts/marcus-lee_senior-product-designer',
    postPreview:
      'We’re growing the design team at Glide and I’m personally hiring a senior product designer to lead our core workflows. DM me — no recruiters, talking to candidates directly.',
    matchScore: 92,
    categories: ['Product Design', 'Product'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_003',
    hiringManagerName: 'Priya Sharma',
    hiringManagerTitle: 'Director of Design',
    hiringManagerPhotoUrl: null,
    companyName: 'Ramp',
    companyInitials: 'R',
    companyColor: '#16a34a',
    jobTitle: 'Lead Product Designer',
    location: 'New York, NY',
    postedAt: '2d ago',
    postedDaysAgo: 2,
    linkedInPostUrl: 'https://www.linkedin.com/posts/priya-sharma_lead-product-designer',
    postPreview:
      'Ramp is looking for a lead product designer to shape how thousands of finance teams work. Reach out if you love turning complex flows into something effortless.',
    matchScore: 78,
    categories: ['Product Design'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_004',
    hiringManagerName: 'David Kim',
    hiringManagerTitle: 'Head of AI',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=33',
    companyName: 'Cohere',
    companyInitials: 'C',
    companyColor: '#4f46e5',
    jobTitle: 'AI Product Manager',
    location: 'Remote (US)',
    postedAt: '1d ago',
    postedDaysAgo: 1,
    linkedInPostUrl: 'https://www.linkedin.com/posts/david-kim_ai-product-manager',
    postPreview:
      'Building a new AI product pod and need a PM who can sit between research and customers. Early-stage mandate, lots of ownership. Open to remote.',
    matchScore: 64,
    categories: ['AI', 'Product'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_005',
    hiringManagerName: 'Elena Rodriguez',
    hiringManagerTitle: 'Co-founder & CPO',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=45',
    companyName: 'Lumen',
    companyInitials: 'L',
    companyColor: '#db2777',
    jobTitle: 'Founding Product Designer',
    location: 'New York, NY',
    postedAt: '3d ago',
    postedDaysAgo: 3,
    linkedInPostUrl: 'https://www.linkedin.com/posts/elena-rodriguez_founding-designer',
    postPreview:
      'First design hire at Lumen. You’ll own product + brand and define the craft bar for the whole company. Equity is meaningful. I’m reading every message myself.',
    matchScore: 84,
    categories: ['Product Design', 'Product'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_006',
    hiringManagerName: 'James Wilson',
    hiringManagerTitle: 'Engineering Manager',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=68',
    companyName: 'Vercel',
    companyInitials: 'V',
    companyColor: '#171717',
    jobTitle: 'Senior Frontend Engineer',
    location: 'Brooklyn, NY',
    postedAt: '2d ago',
    postedDaysAgo: 2,
    linkedInPostUrl: 'https://www.linkedin.com/posts/james-wilson_senior-frontend-engineer',
    postPreview:
      'My team is hiring a senior frontend engineer who cares about DX and performance. We move fast and ship to millions. Happy to chat directly about the role.',
    matchScore: 73,
    categories: ['Engineering'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_007',
    hiringManagerName: 'Aisha Patel',
    hiringManagerTitle: 'Head of Product',
    hiringManagerPhotoUrl: null,
    companyName: 'Notion',
    companyInitials: 'N',
    companyColor: '#0f172a',
    jobTitle: 'Product Manager, Growth',
    location: 'New York, NY',
    postedAt: 'Today',
    postedDaysAgo: 0,
    linkedInPostUrl: 'https://www.linkedin.com/posts/aisha-patel_product-manager-growth',
    postPreview:
      'Notion is hiring a growth PM to own activation end-to-end. If you’ve scaled a self-serve funnel and love experiments, let’s talk — reach out directly.',
    matchScore: 81,
    categories: ['Product'],
    source: 'LinkedIn',
  },
  // ── The following are filtered out of the default view, on purpose ──
  {
    // Off-category (Data not in user's Job Preferences) → personalization filter
    id: 'signal_008',
    hiringManagerName: 'Tom Becker',
    hiringManagerTitle: 'Head of Data',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=51',
    companyName: 'Snowflake',
    companyInitials: 'S',
    companyColor: '#0ea5e9',
    jobTitle: 'Senior Data Scientist',
    location: 'New York, NY',
    postedAt: '1d ago',
    postedDaysAgo: 1,
    linkedInPostUrl: 'https://www.linkedin.com/posts/tom-becker_senior-data-scientist',
    postPreview:
      'Hiring a senior data scientist to build our experimentation platform. Strong stats + causal inference background ideal.',
    matchScore: 69,
    categories: ['Data'],
    source: 'LinkedIn',
  },
  {
    // Different location (SF) → location filter
    id: 'signal_009',
    hiringManagerName: 'Nina Alvarez',
    hiringManagerTitle: 'Design Lead',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=20',
    companyName: 'Figma',
    companyInitials: 'F',
    companyColor: '#a21caf',
    jobTitle: 'UX Designer',
    location: 'San Francisco, CA',
    postedAt: '2d ago',
    postedDaysAgo: 2,
    linkedInPostUrl: 'https://www.linkedin.com/posts/nina-alvarez_ux-designer',
    postPreview:
      'Looking for a UX designer to join my team in SF. Hybrid, 3 days in office. Reach out if you want to work on tools used by every designer.',
    matchScore: 88,
    categories: ['Product Design'],
    source: 'LinkedIn',
  },
  {
    // Too old (6 days) → recency filter
    id: 'signal_010',
    hiringManagerName: 'Robert Tan',
    hiringManagerTitle: 'CTO',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=14',
    companyName: 'Stripe',
    companyInitials: 'S',
    companyColor: '#635bff',
    jobTitle: 'Staff Engineer',
    location: 'New York, NY',
    postedAt: '6d ago',
    postedDaysAgo: 6,
    linkedInPostUrl: 'https://www.linkedin.com/posts/robert-tan_staff-engineer',
    postPreview:
      'We’re hiring a staff engineer for our payments core. Deep distributed systems experience required.',
    matchScore: 90,
    categories: ['Engineering'],
    source: 'LinkedIn',
  },
]

// ── Filtering ────────────────────────────────────────────────────────
export type SignalFilters = {
  query: string
  location: string
  category: string // one of CATEGORY_OPTIONS
  postedDays: number
  sort: SortKey
}

/** True if the signal's location satisfies the (editable) location filter. */
function matchesLocation(signalLocation: string, filter: string): boolean {
  const f = filter.trim().toLowerCase()
  if (!f) return true
  const loc = signalLocation.toLowerCase()
  if (loc.includes('remote')) return true // remote roles match any location
  // Match on the city token and the region/state token, e.g. "New York, NY".
  const [city, region] = f.split(',').map(s => s.trim()).filter(Boolean)
  if (city && loc.includes(city)) return true
  if (region && loc.includes(region)) return true
  return false
}

/** Applies personalization + filters + sort. */
export function filterSignals(
  signals: DirectHireSignal[],
  filters: SignalFilters,
  userCategories: string[],
): DirectHireSignal[] {
  const q = filters.query.trim().toLowerCase()

  const result = signals.filter(s => {
    // Recency window
    if (s.postedDaysAgo > filters.postedDays) return false
    // Personalization: only roles in the user's top-level categories
    if (!s.categories.some(c => userCategories.includes(c))) return false
    // Explicit category filter
    if (filters.category !== 'All categories' && !s.categories.includes(filters.category)) return false
    // Location
    if (!matchesLocation(s.location, filters.location)) return false
    // Free-text search across role, company, manager
    if (q) {
      const hay = `${s.jobTitle} ${s.companyName} ${s.hiringManagerName}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  result.sort((a, b) => {
    if (filters.sort === 'recent') return a.postedDaysAgo - b.postedDaysAgo
    // Best match: higher score first; signals without a score sink to the bottom
    return (b.matchScore ?? -1) - (a.matchScore ?? -1)
  })

  return result
}
