// ── Direct Hire Signals — data model, user context & outreach ────────
//
// A "signal" represents a fresh hiring post crawled from a hiring
// manager's LinkedIn feed. The shape mirrors what the backend crawler
// is expected to return, so swapping mock → real data is a drop-in.
//
// The page is a workflow, not a static board:
//   Connect LinkedIn → Direct Hire Signals → Send Outreach in Bulk

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
  /** Employment type, used by the Role Type filter. */
  positionType: PositionType
  /** Work areas this post belongs to — used by the Work Areas filter. */
  workAreas: WorkArea[]
  /** Seniority bucket — used by the Career Levels filter. */
  careerLevel: CareerLevel
  /** Original LinkedIn post — opened on See More / card / title click. */
  linkedInPostUrl: string
  /** Short preview of the original LinkedIn post — shown as a snippet. */
  postPreview: string
  /** Optional. Only shown when present; hidden entirely otherwise. */
  matchScore?: number
  /** Top-level role categories this post belongs to (used for personalization). */
  categories: string[]
  source: 'LinkedIn'
  /**
   * Fictional preview card shown BEFORE LinkedIn is connected. Preview signals
   * never carry real names, companies, post text, or LinkedIn links — they only
   * illustrate what real results will look like, matched to Job Preferences.
   */
  preview?: boolean
}

// ── Current user / onboarding context ────────────────────────────────
// In production this comes from auth + the Job Preferences onboarding.
export const CURRENT_USER = {
  id: 'user_nova_001',
  name: 'Nova User',
  /** LinkedIn profile shown once the account is connected. */
  linkedInName: 'Nova User',
  linkedInHeadline: 'Product Designer · New York, NY',
  linkedInPhotoUrl: 'https://i.pravatar.cc/120?img=15',
  /** Pre-fills the location filter; the user can still edit it. */
  onboardingLocation: 'New York, NY',
  /** Top-level Job Preference categories — drives which signals are relevant. */
  jobCategories: ['Product Design', 'Engineering', 'AI', 'Product'],
}

// ── Filter option sets ───────────────────────────────────────────────
export type PositionType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'

/**
 * Work Areas filter — multi-select checklist. Empty selection means "All".
 */
export const WORK_AREA_OPTIONS = [
  'Supply Chain',
  'AI',
  'Data',
  'CS',
  'Finance & Business',
  'PM',
  'UX',
  'EE',
  'Operations',
  'Consultant',
  'Sales',
  'Marketing',
  'Customer Service',
  'HR',
  'Admin',
  'Healthcare',
  'Legal',
  'Life Sciences',
] as const
export type WorkArea = (typeof WORK_AREA_OPTIONS)[number]

/** Career Levels filter — multi-select checklist. Empty selection means "All". */
export const CAREER_LEVEL_OPTIONS = [
  'Early career (0–2 years)',
  'Mid-level (3–5 years)',
  'Senior / Manager (6+ years)',
  'Executive/Leadership (10+ years)',
] as const
export type CareerLevel = (typeof CAREER_LEVEL_OPTIONS)[number]

/** Role Type filter — multi-select checklist. Empty selection means "All". */
export const ROLE_TYPE_OPTIONS = ['Full-time', 'Part-time', 'Internship'] as const
export type RoleType = (typeof ROLE_TYPE_OPTIONS)[number]

/** Post Time Range filter. Default is "Past 24 hours". */
export const POST_TIME_OPTIONS: { label: string; days: number }[] = [
  { label: 'Past 24 hours', days: 1 },
  { label: 'Past 3 days', days: 3 },
  { label: 'Past week', days: 7 },
  { label: 'Past month', days: 30 },
]
export const DEFAULT_POST_TIME_DAYS = 1

// ── Mock signals ─────────────────────────────────────────────────────
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
    positionType: 'Full-time',
    workAreas: ['AI', 'CS'],
    careerLevel: 'Senior / Manager (6+ years)',
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
    positionType: 'Full-time',
    workAreas: ['UX', 'PM'],
    careerLevel: 'Senior / Manager (6+ years)',
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
    positionType: 'Full-time',
    workAreas: ['UX'],
    careerLevel: 'Senior / Manager (6+ years)',
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
    positionType: 'Full-time',
    workAreas: ['AI', 'PM'],
    careerLevel: 'Mid-level (3–5 years)',
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
    positionType: 'Full-time',
    workAreas: ['UX'],
    careerLevel: 'Executive/Leadership (10+ years)',
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
    positionType: 'Full-time',
    workAreas: ['CS'],
    careerLevel: 'Senior / Manager (6+ years)',
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
    positionType: 'Full-time',
    workAreas: ['PM'],
    careerLevel: 'Mid-level (3–5 years)',
    linkedInPostUrl: 'https://www.linkedin.com/posts/aisha-patel_product-manager-growth',
    postPreview:
      'Notion is hiring a growth PM to own activation end-to-end. If you’ve scaled a self-serve funnel and love experiments, let’s talk — reach out directly.',
    matchScore: 81,
    categories: ['Product'],
    source: 'LinkedIn',
  },
  {
    id: 'signal_008',
    hiringManagerName: 'Nina Alvarez',
    hiringManagerTitle: 'Design Lead',
    hiringManagerPhotoUrl: 'https://i.pravatar.cc/120?img=20',
    companyName: 'Figma',
    companyInitials: 'F',
    companyColor: '#a21caf',
    jobTitle: 'Product Designer (Contract)',
    location: 'New York, NY',
    postedAt: '2d ago',
    postedDaysAgo: 2,
    positionType: 'Contract',
    workAreas: ['UX'],
    careerLevel: 'Early career (0–2 years)',
    linkedInPostUrl: 'https://www.linkedin.com/posts/nina-alvarez_product-designer',
    postPreview:
      'Looking for a product designer for a 6-month contract on our design systems team. Reach out if you want to work on tools used by every designer.',
    matchScore: 88,
    categories: ['Product Design'],
    source: 'LinkedIn',
  },
]

// ── Preview signals (shown BEFORE LinkedIn is connected) ─────────────
// Fictional, preference-based examples. They look like real results so the
// user understands the feature, but carry NO real names, companies, post
// text, or LinkedIn links — so nobody can find the exact post before
// connecting. Categories mirror the user's Job Preferences.
export const PREVIEW_SIGNALS: DirectHireSignal[] = [
  {
    id: 'preview_001',
    hiringManagerName: 'Hiring Manager',
    hiringManagerTitle: 'Head of Design',
    hiringManagerPhotoUrl: null,
    companyName: 'Design-led Startup',
    companyInitials: 'D',
    companyColor: '#7c3aed',
    jobTitle: 'Senior Product Designer',
    location: 'New York, NY',
    postedAt: 'Today',
    postedDaysAgo: 0,
    positionType: 'Full-time',
    workAreas: ['UX'],
    careerLevel: 'Senior / Manager (6+ years)',
    linkedInPostUrl: '#',
    postPreview:
      'We’re hiring a senior product designer to own our core product experience end-to-end — from research to polished UI. Connect LinkedIn to reveal the real hiring manager and original post.',
    matchScore: 91,
    categories: ['Product Design', 'Product'],
    source: 'LinkedIn',
    preview: true,
  },
  {
    id: 'preview_002',
    hiringManagerName: 'Hiring Manager',
    hiringManagerTitle: 'Engineering Lead',
    hiringManagerPhotoUrl: null,
    companyName: 'Growth-stage SaaS',
    companyInitials: 'G',
    companyColor: '#2563eb',
    jobTitle: 'Senior Frontend Engineer',
    location: 'Remote (US)',
    postedAt: 'Today',
    postedDaysAgo: 0,
    positionType: 'Full-time',
    workAreas: ['CS'],
    careerLevel: 'Senior / Manager (6+ years)',
    linkedInPostUrl: '#',
    postPreview:
      'Looking for a senior frontend engineer who cares about performance and clean component architecture to help scale our app. Connect LinkedIn to see the real role and reach out directly.',
    matchScore: 86,
    categories: ['Engineering'],
    source: 'LinkedIn',
    preview: true,
  },
  {
    id: 'preview_003',
    hiringManagerName: 'Hiring Manager',
    hiringManagerTitle: 'Head of AI',
    hiringManagerPhotoUrl: null,
    companyName: 'Applied AI Lab',
    companyInitials: 'A',
    companyColor: '#4f46e5',
    jobTitle: 'AI Product Engineer',
    location: 'Remote (US)',
    postedAt: '1d ago',
    postedDaysAgo: 1,
    positionType: 'Full-time',
    workAreas: ['AI', 'CS'],
    careerLevel: 'Mid-level (3–5 years)',
    linkedInPostUrl: '#',
    postPreview:
      'Building a new AI product pod and hiring an engineer to ship LLM-powered features from prototype to production. Connect LinkedIn to unlock the real contact and reach out directly.',
    matchScore: 83,
    categories: ['AI', 'Product'],
    source: 'LinkedIn',
    preview: true,
  },
  {
    id: 'preview_004',
    hiringManagerName: 'Hiring Manager',
    hiringManagerTitle: 'VP of Product',
    hiringManagerPhotoUrl: null,
    companyName: 'Product-first Company',
    companyInitials: 'P',
    companyColor: '#db2777',
    jobTitle: 'Product Manager',
    location: 'New York, NY',
    postedAt: '1d ago',
    postedDaysAgo: 1,
    positionType: 'Full-time',
    workAreas: ['PM'],
    careerLevel: 'Mid-level (3–5 years)',
    linkedInPostUrl: '#',
    postPreview:
      'Hiring a product manager to own a 0→1 product line and work closely with design and engineering on what we build next. Connect LinkedIn to see the real post and hiring manager.',
    matchScore: 79,
    categories: ['Product'],
    source: 'LinkedIn',
    preview: true,
  },
]

// ── Filtering ────────────────────────────────────────────────────────
export type SignalFilters = {
  query: string
  location: string
  /** Selected Work Areas. Empty = "All". Multiple selections use OR logic. */
  workAreas: string[]
  /** Selected Career Levels. Empty = "All". Multiple selections use OR logic. */
  careerLevels: string[]
  /** Selected Role Types. Empty = "All". Multiple selections use OR logic. */
  roleTypes: string[]
  postedDays: number
}

/** True if the signal's location satisfies the (editable) location filter. */
function matchesLocation(signalLocation: string, filter: string): boolean {
  const f = filter.trim().toLowerCase()
  if (!f) return true
  const loc = signalLocation.toLowerCase()
  if (loc.includes('remote')) return true // remote roles match any location
  const [city, region] = f.split(',').map(s => s.trim()).filter(Boolean)
  if (city && loc.includes(city)) return true
  if (region && loc.includes(region)) return true
  return false
}

/** Applies personalization + filters, then sorts most-recent first. */
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
    // Work Areas filter — OR within the group; empty = All
    if (filters.workAreas.length > 0 && !s.workAreas.some(w => filters.workAreas.includes(w))) return false
    // Career Levels filter — OR within the group; empty = All
    if (filters.careerLevels.length > 0 && !filters.careerLevels.includes(s.careerLevel)) return false
    // Role Type filter — OR within the group; empty = All
    if (filters.roleTypes.length > 0 && !filters.roleTypes.includes(s.positionType)) return false
    // Location
    if (!matchesLocation(s.location, filters.location)) return false
    // Free-text search across role, company, manager
    if (q) {
      const hay = `${s.jobTitle} ${s.companyName} ${s.hiringManagerName}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  // Freshest signals first.
  result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo)
  return result
}

// ── Personalized outreach ────────────────────────────────────────────
export type OutreachType = 'referral' | 'hiring-manager'

export const OUTREACH_META: Record<OutreachType, { label: string; blurb: string }> = {
  referral: {
    label: 'Referral outreach',
    blurb: 'Ask for a warm intro or referral into the role.',
  },
  'hiring-manager': {
    label: 'Hiring Manager outreach',
    blurb: 'Reach the hiring manager directly about the post.',
  },
}

const firstName = (full: string) => full.split(' ')[0]
const primaryCategory = (s: DirectHireSignal) =>
  s.categories[0] ?? 'this space'

/**
 * Builds a personalized connection request for a signal. Pure templating —
 * no extra LLM call required. Kept short so it fits LinkedIn's note limit.
 */
export function generateRequest(signal: DirectHireSignal, type: OutreachType): string {
  const name = firstName(signal.hiringManagerName)
  const area = primaryCategory(signal)
  if (type === 'referral') {
    return `Hi ${name}, I saw ${signal.companyName} is hiring a ${signal.jobTitle}. I’ve spent the last few years working in ${area} and would love to be considered — would you be open to referring me or pointing me to the right person? Happy to share more.`
  }
  return `Hi ${name}, I saw your post about hiring a ${signal.jobTitle} at ${signal.companyName}. I’ve been working in ${area} for the last few years and this looks like exactly the kind of role I’m after. Would you be open to a quick chat about whether I’d be a fit?`
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
 * Records a Contact/See More click so the app can attribute outreach.
 * Placeholder — wire to the real endpoint when ready:
 *   fetch('/api/track/contact-click', { method: 'POST', body: JSON.stringify(event) })
 */
export function trackContactClick(event: ContactClickEvent): void {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.info('[trackContactClick]', event)
  }
}
