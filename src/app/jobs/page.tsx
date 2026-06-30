'use client'
import { useState, useEffect } from 'react'
import JobCard from '@/components/jobs/JobCard'
import FloatingNovaChat from '@/components/FloatingNovaChat'
import DirectHireBoard from '@/components/jobs/DirectHireBoard'
import DirectHireCta from '@/components/jobs/DirectHireCta'
import type { Job } from '@/components/jobs/types'
import {
  AlertCtaButton,
  AutoApplyToggleButton,
  FilterDropdownButton,
  FilterPanelOptionButton,
  HeaderTabButton,
  LocationChipRemoveButton,
  LocationQuickPickButton,
  LocationResetIconButton,
  LocationResultRowButton,
  SearchClearButton,
  SortPanelItemButton,
  TopAvatarButton,
  TogglePillButton,
  UpgradeButton,
  UsageDetailButton
} from '@/components/Buttons'
import {
  BriefcaseBusiness,
  Bot,
  CircleUserRound,
  CreditCard,
  FileUser,
  SlidersHorizontal,
  HandCoins,
  ChartNoAxesColumn,
  Settings,
  LogOut
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
type AppStatus = 'pending' | 'applied'
type AutoApp = {
  id: number; title: string; company: string; companyColor: string
  status: AppStatus; date: string; salary: string
}

// ── Data ───────────────────────────────────────────────────────────
const JOBS: Job[] = [
  { id: 1, match: 64, posted: '1h ago', applicants: 25, title: 'Web Application Developer', company: 'Backd Business Funding', companyColor: '#6366f1', location: 'Austin, TX', workMode: 'On-site', type: 'Full time', level: 'Mid Level', exp: '3+ yrs', salary: '$65k–$70k/yr', appliedDate: null, badges: [], saved: false },
  { id: 2, match: 64, posted: '1h ago', applicants: 25, title: 'Web Application Developer', company: 'Backd Business Funding', companyColor: '#6366f1', location: 'Austin, TX / Milan, Lombardy, Italy', workMode: 'Hybrid', type: 'Full time', level: 'Mid Level', exp: '3+ yrs', salary: '$65k–$70k/yr', appliedDate: 'Nov 26, 2025', badges: ['Referral', 'Auto Applied'], saved: false },
  { id: 3, match: 78, posted: '3h ago', applicants: 41, title: 'Senior Frontend Engineer', company: 'Linear', companyColor: '#5b5bd6', location: 'San Francisco, CA', workMode: 'Hybrid', type: 'Full time', level: 'Senior', exp: '5+ yrs', salary: '$140k–$180k/yr', appliedDate: null, badges: [], saved: true, hot: true },
  { id: 4, match: 93, posted: '1h ago', applicants: 25, title: 'Web Application Developer', company: 'Cursor AI', companyColor: '#09090b', location: 'Lake Mary, FL / Milan, Lombardy, Italy', workMode: 'On-site', type: 'Internship', level: 'Entry–Mid', exp: '3+ yrs', salary: '$22–$25/hr', appliedDate: null, badges: ['Referral'], saved: true },
  { id: 5, match: 96, posted: '30m ago', applicants: 12, title: 'AI Product Designer', company: 'Anthropic', companyColor: '#cc6c24', location: 'San Francisco, CA', workMode: 'Remote', type: 'Full time', level: 'Senior', exp: '4+ yrs', salary: '$160k–$200k/yr', appliedDate: null, badges: [], saved: false, hot: true },
]

const AUTO_APPS: AutoApp[] = [
  { id: 1, title: 'Frontend Engineer', company: 'Vercel', companyColor: '#000000', status: 'pending', date: 'Just now', salary: '$130k–$160k' },
  { id: 2, title: 'Product Designer', company: 'Figma', companyColor: '#a259ff', status: 'pending', date: '3m ago', salary: '$120k–$150k' },
  { id: 3, title: 'React Developer', company: 'Stripe', companyColor: '#635bff', status: 'applied', date: '8m ago', salary: '$140k–$170k' },
  { id: 4, title: 'UI Engineer', company: 'Notion', companyColor: '#000000', status: 'applied', date: '15m ago', salary: '$110k–$140k' },
  { id: 5, title: 'Full Stack Dev', company: 'Railway', companyColor: '#7b2bf9', status: 'applied', date: '22m ago', salary: '$100k–$130k' },
]

// ── Logo assets (same as landing page) ──────────────────────────────
const FIG_LOGO_ICON = '/img/nav/logo_icon.png'
const FIG_LOGO_WORDMARK = '/img/nav/logo_wordmark.png'

// ── Sidebar nav ────────────────────────────────────────────────────
const NAV_MAIN = [
  { label: 'Jobs',           active: true,  icon: <BriefcaseBusiness size={20} strokeWidth={1.9} />, fontClass: 'jb-nav-font-main' },
  { label: 'Auto Apply',     active: false, icon: <Bot size={20} strokeWidth={1.9} />,               fontClass: 'jb-nav-font-main' },
  { label: 'Profile',        active: false, icon: <CircleUserRound size={20} strokeWidth={1.9} />,   fontClass: 'jb-nav-font-main' },
  { label: 'Resume',         active: false, icon: <FileUser size={20} strokeWidth={1.9} />,          fontClass: 'jb-nav-font-main' },
  { label: 'Job Preference', active: false, icon: <SlidersHorizontal size={20} strokeWidth={1.9} />, fontClass: 'jb-nav-font-main' },
]
const NAV_USER_MENU = [
  { label: 'Refer & Affiliate', icon: <HandCoins size={18} strokeWidth={1.9} /> },
  { label: 'Usage',             icon: <ChartNoAxesColumn size={18} strokeWidth={1.9} /> },
  { label: 'Setting',           icon: <Settings size={18} strokeWidth={1.9} /> },
  { label: 'subscribtion',      icon: <CreditCard size={18} strokeWidth={1.9} /> },
  { label: 'Log out',           icon: <LogOut size={18} strokeWidth={1.9} /> },
]

// ── Helpers ────────────────────────────────────────────────────────
function CompanyAvatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('')
  return (
    <div className="jb-co-av" style={{ '--co': color, '--sz': `${size}px` } as React.CSSProperties}>
      {initials}
    </div>
  )
}

const STATUS_META: Record<AppStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'aa-s--pending' },
  applied: { label: 'Applied', cls: 'aa-s--applied' },
}

// ── Auto Apply Settings ────────────────────────────────────────────
type AAJobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
type AASettings = {
  dailyLimit: number
  jobTypes: AAJobType[]
  minSalary: number
  autoCoverLetter: boolean
  notifyOnApply: boolean
  verifiedOnly: boolean
}
const DEFAULT_AA_SETTINGS: AASettings = {
  dailyLimit: 20,
  jobTypes: ['Full-time', 'Contract'],
  minSalary: 80,
  autoCoverLetter: true,
  notifyOnApply: true,
  verifiedOnly: false,
}
const JOB_TYPE_OPTIONS: AAJobType[] = ['Full-time', 'Part-time', 'Contract', 'Internship']

function AutoApplySettingsPanel({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AASettings>(DEFAULT_AA_SETTINGS)

  function toggleJobType(t: AAJobType) {
    setSettings(s => ({
      ...s,
      jobTypes: s.jobTypes.includes(t) ? s.jobTypes.filter(x => x !== t) : [...s.jobTypes, t],
    }))
  }
  function toggleBool(key: keyof AASettings) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  return (
    <div className="aa-settings-overlay">
      <div className="aa-settings-hd">
        <span className="aa-settings-title">Auto Apply Settings</span>
        <button className="aa-settings-close" onClick={onClose} aria-label="Close settings">
          <Settings size={14} strokeWidth={2} />
        </button>
      </div>
      <div className="aa-settings-body">
        {/* Daily limit */}
        <div className="aa-sf">
          <label className="aa-sf-label">Daily apply limit</label>
          <div className="aa-sf-stepper">
            <button className="aa-stepper-btn" onClick={() => setSettings(s => ({ ...s, dailyLimit: Math.max(1, s.dailyLimit - 5) }))}>−</button>
            <span className="aa-stepper-val">{settings.dailyLimit}</span>
            <button className="aa-stepper-btn" onClick={() => setSettings(s => ({ ...s, dailyLimit: Math.min(100, s.dailyLimit + 5) }))}>+</button>
          </div>
        </div>

        {/* Job types */}
        <div className="aa-sf">
          <label className="aa-sf-label">Job type</label>
          <div className="aa-sf-chips">
            {JOB_TYPE_OPTIONS.map(t => (
              <button
                key={t}
                className={`aa-sf-chip${settings.jobTypes.includes(t) ? ' is-on' : ''}`}
                onClick={() => toggleJobType(t)}
              >{t}</button>
            ))}
          </div>
        </div>

        {/* Min salary */}
        <div className="aa-sf">
          <label className="aa-sf-label">Min salary <span className="aa-sf-unit">(K / yr)</span></label>
          <div className="aa-sf-stepper">
            <button className="aa-stepper-btn" onClick={() => setSettings(s => ({ ...s, minSalary: Math.max(0, s.minSalary - 10) }))}>−</button>
            <span className="aa-stepper-val">${settings.minSalary}K</span>
            <button className="aa-stepper-btn" onClick={() => setSettings(s => ({ ...s, minSalary: Math.min(500, s.minSalary + 10) }))}>+</button>
          </div>
        </div>

        {/* Toggles */}
        <div className="aa-sf aa-sf--toggle">
          <label className="aa-sf-label">Auto cover letter</label>
          <button className={`aa-toggle${settings.autoCoverLetter ? ' is-on' : ''}`} onClick={() => toggleBool('autoCoverLetter')} aria-label="Toggle auto cover letter">
            <span className="aa-toggle-knob" />
          </button>
        </div>
        <div className="aa-sf aa-sf--toggle">
          <label className="aa-sf-label">Notify on each apply</label>
          <button className={`aa-toggle${settings.notifyOnApply ? ' is-on' : ''}`} onClick={() => toggleBool('notifyOnApply')} aria-label="Toggle notify on apply">
            <span className="aa-toggle-knob" />
          </button>
        </div>
        <div className="aa-sf aa-sf--toggle">
          <label className="aa-sf-label">Verified listings only</label>
          <button className={`aa-toggle${settings.verifiedOnly ? ' is-on' : ''}`} onClick={() => toggleBool('verifiedOnly')} aria-label="Toggle verified only">
            <span className="aa-toggle-knob" />
          </button>
        </div>
      </div>
      <div className="aa-settings-footer">
        <button className="aa-settings-save" onClick={onClose}>Save</button>
      </div>
    </div>
  )
}

// ── Auto Apply Panel ───────────────────────────────────────────────
function AutoApplyPanel() {
  const [enabled, setEnabled] = useState(true)
  const [activeFlowIndex, setActiveFlowIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const [skipStartReminder, setSkipStartReminder] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('aa_skip_start_reminder')
    if (saved === '1') setSkipStartReminder(true)
  }, [])

  const handleSkipReminderChange = (checked: boolean) => {
    setSkipStartReminder(checked)
    if (checked) {
      window.localStorage.setItem('aa_skip_start_reminder', '1')
    } else {
      window.localStorage.removeItem('aa_skip_start_reminder')
    }
  }

  // 仅在用户从关闭切换到开启时弹窗，避免初始化时打扰
  const handleToggleAutoApply = () => {
    setEnabled(prev => {
      const next = !prev
      if (!prev && next && !skipStartReminder) {
        setShowStartModal(true)
      }
      return next
    })
  }

  useEffect(() => {
    if (!enabled) return
    const timer = window.setInterval(() => {
      setActiveFlowIndex(prev => (prev + 1) % 3)
    }, 900)
    return () => window.clearInterval(timer)
  }, [enabled])

  return (
    <div className="aa-panel">
      {showSettings && <AutoApplySettingsPanel onClose={() => setShowSettings(false)} />}
      {showStartModal && (
        <div className="aa-start-overlay" onClick={() => setShowStartModal(false)}>
          <div className="aa-start-modal" role="dialog" aria-modal="true" aria-label="Auto Apply started" onClick={e => e.stopPropagation()}>
            <button className="aa-start-close" type="button" onClick={() => setShowStartModal(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="aa-start-anim" aria-hidden="true">
              <span className="aa-start-anim-icon-wrap">
                <img
                  className="aa-start-anim-icon"
                  src="/img/resume-portfolio-svgrepo-com%201.svg"
                  alt=""
                />
                <span className="aa-start-upload-badge">⬆</span>
              </span>
            </div>
            <p className="aa-start-title">Auto Apply is now running</p>
            <p className="aa-start-desc">
              Our AI agent is working hard to apply for you, so you can leave and have a coffee.
            </p>
            <button className="aa-start-cta" onClick={() => setShowStartModal(false)}>
              Nice
            </button>
            <label className="aa-start-remind-toggle">
              <input
                type="checkbox"
                checked={skipStartReminder}
                onChange={(e) => handleSkipReminderChange(e.target.checked)}
              />
              <span>Don't remind me again</span>
            </label>
          </div>
        </div>
      )}
      <div className="aa-top-card">
        {/* Header */}
        <div className="aa-hd">
          <div className="aa-hd-left">
            <Bot size={18} strokeWidth={2} />
            <span className="aa-hd-title">Auto Apply</span>
          </div>
          <div className="aa-hd-right">
            <button className="aa-settings-btn" onClick={() => setShowSettings(true)} aria-label="Auto Apply settings">
              <Settings size={15} strokeWidth={1.8} />
            </button>
            <AutoApplyToggleButton enabled={enabled} onToggle={handleToggleAutoApply} />
          </div>
        </div>

        {/* Live status */}
        <div className={`aa-status${enabled ? ' aa-status--on' : ''}`}>
          <div className="aa-status-row">
            <span className={`aa-pulse${enabled ? ' is-live' : ''}`} />
            <span className="aa-status-label">{enabled ? 'Running' : 'Paused'}</span>
          </div>
          <div className="aa-steps">
            {['Scanning', 'Matching', 'Applying'].flatMap((s, i) => {
              const items = []
              if (i > 0) items.push(
                <span
                  key={`arrow-${i}`}
                  className={`aa-step-arrow${enabled && activeFlowIndex === i ? ' is-active' : ''}`}
                >
                  ›
                </span>
              )
              items.push(
                <div key={s} className={`aa-step${enabled && activeFlowIndex === i ? ' is-active' : ''}`}>
                  <span className="aa-step-dot" />
                  {s}
                </div>
              )
              return items
            })}
          </div>
          <div className="aa-today-stats">
            <div className="aa-tstat">
              <strong>12</strong>
              <span>Today</span>
            </div>
            <div className="aa-tstat">
              <strong>315</strong>
              <span>Total</span>
            </div>
            <div className="aa-tstat">
              <strong>3</strong>
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit alerts */}
      <div className="aa-alert aa-alert--error">
        <span className="aa-alert-msg">You are out of credit</span>
        <AlertCtaButton>Upgrade</AlertCtaButton>
      </div>
      <div className="aa-alert aa-alert--warn">
        <span className="aa-alert-msg">You've used 90% of credit</span>
        <AlertCtaButton>Upgrade</AlertCtaButton>
      </div>

      <div className="aa-live-card" id="autoapply">
        {/* Live Workspace */}
        <div className="aa-list-hd">
          <div className="aa-list-hd-left">
            <span className={`aa-pulse${enabled ? ' is-live' : ''}`} style={{ width: 7, height: 7 }} />
            <span className="aa-list-title">Live Workspace</span>
          </div>
          <a href="/jobs#autoapply" className="aa-list-count">View all</a>
        </div>
        <div className="aa-list">
          {AUTO_APPS.map((app, i) => {
            const s = STATUS_META[app.status]
            return (
              <div
                key={app.id}
                className={`aa-item aa-item--${app.status}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`aa-item-av-wrap${app.status === 'applied' ? ' aa-item--applied' : ''}`}>
                  <CompanyAvatar name={app.company} color={app.companyColor} size={32} />
                </div>
                <div className="aa-item-info">
                  <p className="aa-item-title">{app.title}</p>
                  <p className="aa-item-co">{app.company} · {app.date}</p>
                </div>
                <span className={`aa-status-badge ${s.cls}`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Location data ──────────────────────────────────────────────────
const LOC_QUICK = ['United States', 'Canada', 'United Kingdom', 'Europe', 'Asia Pacific']
const LOC_ALL = [
  'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA',
  'Los Angeles, CA', 'Chicago, IL', 'Boston, MA', 'Denver, CO',
  'Atlanta, GA', 'Miami, FL', 'Dallas, TX', 'Portland, OR', 'San Diego, CA',
  'Toronto, ON', 'Vancouver, BC', 'Montreal, QC', 'Calgary, AB',
  'London, UK', 'Manchester, UK', 'Edinburgh, UK', 'Bristol, UK',
  'Berlin, Germany', 'Munich, Germany', 'Hamburg, Germany',
  'Amsterdam, Netherlands', 'Paris, France', 'Stockholm, Sweden',
  'Zurich, Switzerland', 'Dublin, Ireland', 'Barcelona, Spain',
  'Madrid, Spain', 'Milan, Italy', 'Rome, Italy', 'Lisbon, Portugal',
  'Copenhagen, Denmark', 'Oslo, Norway', 'Helsinki, Finland',
  'Warsaw, Poland', 'Prague, Czech Republic', 'Vienna, Austria',
  'Singapore', 'Tokyo, Japan', 'Osaka, Japan',
  'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia',
  'Seoul, South Korea', 'Hong Kong', 'Taipei, Taiwan',
  'Shanghai, China', 'Beijing, China', 'Shenzhen, China',
  'Bangalore, India', 'Mumbai, India', 'Delhi, India', 'Hyderabad, India',
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Tel Aviv, Israel',
  'São Paulo, Brazil', 'Buenos Aires, Argentina', 'Mexico City, Mexico',
  'Bogotá, Colombia', 'Santiago, Chile',
]

// ── Filter label helpers ────────────────────────────────────────────
const WORK_MODE_DISPLAY: Record<string, string> = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }

function fdropLabel(selected: Set<string>, fallback: string, map?: Record<string, string>): React.ReactNode {
  if (selected.size === 0) return fallback
  const first = Array.from(selected)[0]
  const label = map ? (map[first] ?? first) : first
  if (selected.size === 1) return label
  return <>{label}<span className="jb-fdrop-count">+{selected.size - 1}</span></>
}

// ── Page ───────────────────────────────────────────────────────────
export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<'recommend' | 'square'>('recommend')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState(JOBS)
  const [workModes, setWorkModes] = useState<Set<string>>(new Set())
  const [referralOnly, setReferralOnly] = useState(false)
  const [manualOnly, setManualOnly] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [jobTypes, setJobTypes] = useState<Set<string>>(new Set())
  const [levels, setLevels] = useState<Set<string>>(new Set())
  const [locSearch, setLocSearch] = useState('')
  const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set())
  // 有下拉打开时：点击当前下拉「触发器 + 面板」以外任意位置则收起（含筛选项其他区域、列表等）
  useEffect(() => {
    if (openFilter === null) return
    const onPointerDownOutside = (e: PointerEvent) => {
      const root = document.querySelector<HTMLElement>(`[data-jb-filter-drop="${openFilter}"]`)
      if (!root) return
      const t = e.target
      if (!(t instanceof Node)) return
      const path = typeof e.composedPath === 'function' ? e.composedPath() : []
      const inside = path.length > 0 ? path.includes(root) : root.contains(t)
      if (!inside) setOpenFilter(null)
    }
    document.addEventListener('pointerdown', onPointerDownOutside, true)
    return () => document.removeEventListener('pointerdown', onPointerDownOutside, true)
  }, [openFilter])

  const toggleSave = (id: number) => setJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j))
  const toggleMode = (m: string) => setWorkModes(prev => {
    const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next
  })
  const toggleJobType = (t: string) => setJobTypes(prev => {
    const n = new Set(prev); n.has(t) ? n.delete(t) : n.add(t); return n
  })
  const toggleLevel = (l: string) => setLevels(prev => {
    const n = new Set(prev); n.has(l) ? n.delete(l) : n.add(l); return n
  })
  const toggleLocation = (loc: string) => setSelectedLocations(prev => {
    const n = new Set(prev); n.has(loc) ? n.delete(loc) : n.add(loc); return n
  })

  const [sortBy, setSortBy] = useState<'recommended' | 'match' | 'recent'>('recommended')
  const SORT_LABELS: Record<string, string> = { recommended: 'Recommended', match: 'Top matched', recent: 'Most recent' }

  return (
    <div className="jb-layout">

      {/* Sidebar */}
      <aside className="jb-sidebar">
        <a className="jb-brand" href="/">
          <img className="nav-brand-icon" src={FIG_LOGO_ICON} alt="JobNova icon" />
          <img className="nav-brand-wordmark" src={FIG_LOGO_WORDMARK} alt="JobNova" />
        </a>
        <nav className="jb-nav">
          {NAV_MAIN.map(item => (
            <a key={item.label} href="#" className={`jb-nav-item${item.active ? ' is-active' : ''} ${item.fontClass}`}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        {/* Referral card */}
        <div className="jb-refer-card">
          <svg className="jb-refer-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <div className="jb-refer-text">
            <p className="jb-refer-title">Share JobNova with a friend</p>
            <p className="jb-refer-sub">Get 500 credits each</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, color: 'var(--color-text-second-2)' }}><polyline points="9 18 15 12 9 6"/></svg>
        </div>

        {/* User row with dropdown */}
        <div className="jb-user-wrap">
          <div className="jb-user-row" onClick={() => setUserMenuOpen(v => !v)}>
            <div className="jb-user-av">N</div>
            <div><p className="jb-user-name">Nova User</p><p className="jb-user-plan">Pro Plan</p></div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ marginLeft: 'auto', color: 'var(--color-text-second-2)', transition: 'transform 0.2s', transform: userMenuOpen ? 'rotate(90deg)' : 'none' }}><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          {userMenuOpen && (
            <div className="jb-user-menu">
              {NAV_USER_MENU.map(item => item.label === 'Log out' ? (
                <button
                  key={item.label}
                  className="jb-user-menu-item"
                  onClick={() => {
                    setUserMenuOpen(false)
                    window.location.href = '/'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.label === 'subscribtion' ? '/jobs/subscribtion' : '#'}
                  className="jb-user-menu-item"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* 内容区域：共享标题栏 + 下方双栏 */}
      <section className="jb-content">
        {/* 顶部标签栏：横跨列表和右侧栏 */}
        <div className="jb-main-hd">
          <div className="jb-main-hd-inner">
            <div className="jb-main-hd-main">
              <div className="jb-tab-bar">
                <div className="jb-seg">
                  <HeaderTabButton
                    active={activeTab === 'recommend'}
                    onClick={() => setActiveTab('recommend')}
                    label="Recommend Jobs"
                  />
                  <HeaderTabButton
                    active={activeTab === 'square'}
                    onClick={() => setActiveTab('square')}
                    label="Direct hire"
                  />
                </div>
              </div>
            </div>
            <div className="jb-main-hd-side">
              <div className="jb-credit-pill" tabIndex={0} aria-label="Credit balance">
                <svg className="jb-credit-icon" width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6.35343 15.677L11.881 7.19356C12.098 6.86024 12.01 6.40976 11.684 6.1877C11.5677 6.10833 11.431 6.066 11.2912 6.06606H6.94507V0.725344C6.94507 0.324837 6.62782 0 6.23639 0C5.99931 0 5.77814 0.121166 5.64659 0.322951L0.119031 8.80644C-0.0979978 9.13976 -0.00998805 9.59 0.315786 9.8123C0.432163 9.89175 0.568929 9.93416 0.708833 9.93417H5.05494V15.2747C5.05494 15.6752 5.37219 16 5.76362 16C6.0007 16 6.2221 15.8788 6.35343 15.677Z" fill="var(--color-text-default)" />
                </svg>
                <span className="jb-credit-value">230</span>
                <div className="aa-credit-popover">
                  <div className="aa-cp-card">
                    <div className="aa-cp-row aa-cp-plan">
                      <span className="aa-cp-plan-name">Free</span>
                      <UpgradeButton />
                    </div>
                    <div className="aa-cp-divider" />
                    <div className="aa-cp-row aa-cp-credits-row">
                      <div className="aa-cp-credits-label">
                        <svg className="aa-cp-credits-icon" width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path d="M6.35343 15.677L11.881 7.19356C12.098 6.86024 12.01 6.40976 11.684 6.1877C11.5677 6.10833 11.431 6.066 11.2912 6.06606H6.94507V0.725344C6.94507 0.324837 6.62782 0 6.23639 0C5.99931 0 5.77814 0.121166 5.64659 0.322951L0.119031 8.80644C-0.0979978 9.13976 -0.00998805 9.59 0.315786 9.8123C0.432163 9.89175 0.568929 9.93416 0.708833 9.93417H5.05494V15.2747C5.05494 15.6752 5.37219 16 5.76362 16C6.0007 16 6.2221 15.8788 6.35343 15.677Z" fill="var(--color-text-default)" />
                        </svg>
                        <span>Credits</span>
                      </div>
                      <span className="aa-cp-credits-val">230</span>
                    </div>
                    <UsageDetailButton />
                  </div>
                </div>
              </div>
              <TopAvatarButton label="N" />
            </div>
          </div>
        </div>

        <div className="jb-content-body">
          {/* 主列表区域 */}
          <main className="jb-main">
            {/* 固定筛选 + 仅列表滚动 */}
            <div className="jb-list">
          {activeTab === 'recommend' ? (
          <>
          <div className="jb-filters">
            {/* Row 1: Recommend = 搜索+排序；Direct hire = 搜索+Location（原排序位） */}
            <div className="jb-filter-row1">
              <div className={`jb-search${searchQuery ? ' is-filled' : ''}`}>
                <svg className="jb-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input className="jb-search-input" placeholder="Search roles, companies…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && (
                  <SearchClearButton onClick={() => setSearchQuery('')} />
                )}
              </div>
              {activeTab === 'recommend' ? (
                <div className="jb-drop-wrap" data-jb-filter-drop="sort">
                  <FilterDropdownButton
                    open={openFilter === 'sort'}
                    onClick={() => setOpenFilter(f => f === 'sort' ? null : 'sort')}
                    className="jb-fdrop--sort"
                  >
                    {SORT_LABELS[sortBy]}
                  </FilterDropdownButton>
                  {openFilter === 'sort' && (
                    <div className="jb-filter-panel jb-filter-panel--right">
                      {(['recommended', 'match', 'recent'] as const).map(v => (
                        <SortPanelItemButton key={v} selected={sortBy === v} onClick={() => { setSortBy(v); setOpenFilter(null) }}>
                          {SORT_LABELS[v]}
                        </SortPanelItemButton>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="jb-drop-wrap" data-jb-filter-drop="location">
                  <FilterDropdownButton
                    open={openFilter === 'location'}
                    active={selectedLocations.size > 0}
                    onClick={() => setOpenFilter(f => f === 'location' ? null : 'location')}
                    className="jb-fdrop--sort"
                  >
                    {fdropLabel(selectedLocations, 'Location')}
                  </FilterDropdownButton>
                  {openFilter === 'location' && (
                    <div className="jb-filter-panel jb-filter-panel--loc jb-filter-panel--right">
                      <div className="jb-panel-label-row">
                        <p className="jb-panel-label">Quick pick</p>
                        <LocationResetIconButton onClick={() => { setSelectedLocations(new Set()); setLocSearch('') }} />
                      </div>
                      <div className="jb-loc-quick">
                        {LOC_QUICK.map(r => (
                          <LocationQuickPickButton key={r} active={selectedLocations.has(r)} onClick={() => toggleLocation(r)}>
                            {r}
                          </LocationQuickPickButton>
                        ))}
                      </div>
                      <div className="jb-loc-combobox">
                        <div className="jb-loc-input-area">
                          {Array.from(selectedLocations).map(loc => (
                            <span key={loc} className="jb-loc-inline-chip">
                              {loc}
                              <LocationChipRemoveButton onClick={e => { e.stopPropagation(); toggleLocation(loc) }} />
                            </span>
                          ))}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--color-text-second-2)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <input
                            className="jb-loc-text-input"
                            placeholder={selectedLocations.size === 0 ? 'Search city or country…' : ''}
                            value={locSearch}
                            onChange={e => setLocSearch(e.target.value)}
                          />
                          {locSearch && (
                            <SearchClearButton onClick={() => setLocSearch('')} className="jb-loc-searchbox-clear" />
                          )}
                        </div>
                        {locSearch && (
                          <div className="jb-loc-dropdown">
                            {LOC_ALL.filter(c => c.toLowerCase().includes(locSearch.toLowerCase())).map(city => (
                              <LocationResultRowButton key={city} selected={selectedLocations.has(city)} onClick={() => { toggleLocation(city); setLocSearch('') }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {city}
                                {selectedLocations.has(city) && <svg className="jb-loc-check" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </LocationResultRowButton>
                            ))}
                            {LOC_ALL.filter(c => c.toLowerCase().includes(locSearch.toLowerCase())).length === 0 && (
                              <p className="jb-loc-no-results">No cities found</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Row 2: Recommend Jobs — Work Mode / Job Type / Level / Location + pills */}
            {activeTab === 'recommend' && (
              <div className="jb-filter-row2">
                {/* Work Mode dropdown */}
                <div className="jb-drop-wrap" data-jb-filter-drop="workmode">
                  <FilterDropdownButton
                    open={openFilter === 'workmode'}
                    active={workModes.size > 0}
                    onClick={() => setOpenFilter(f => f === 'workmode' ? null : 'workmode')}
                  >
                    {fdropLabel(workModes, 'Work Mode', WORK_MODE_DISPLAY)}
                  </FilterDropdownButton>
                  {openFilter === 'workmode' && (
                    <div className="jb-filter-panel">
                      <p className="jb-panel-label">Work Mode</p>
                      {([['Remote', 'remote'], ['Hybrid', 'hybrid'], ['On-site', 'onsite']] as const).map(([label, key]) => (
                        <FilterPanelOptionButton key={key} selected={workModes.has(key)} onClick={() => toggleMode(key)}>
                          {label}
                        </FilterPanelOptionButton>
                      ))}
                    </div>
                  )}
                </div>
                <div className="jb-filter-sep" />

                {/* Job Type dropdown */}
                <div className="jb-drop-wrap" data-jb-filter-drop="jobtype">
                  <FilterDropdownButton
                    open={openFilter === 'jobtype'}
                    active={jobTypes.size > 0}
                    onClick={() => setOpenFilter(f => f === 'jobtype' ? null : 'jobtype')}
                  >
                    {fdropLabel(jobTypes, 'Job Type')}
                  </FilterDropdownButton>
                  {openFilter === 'jobtype' && (
                    <div className="jb-filter-panel">
                      <p className="jb-panel-label">Job Type</p>
                      {['Full-time', 'Contract', 'Part-time', 'Internship'].map(t => (
                        <FilterPanelOptionButton key={t} selected={jobTypes.has(t)} onClick={() => toggleJobType(t)}>
                          {t}
                        </FilterPanelOptionButton>
                      ))}
                    </div>
                  )}
                </div>

                {/* Level dropdown */}
                <div className="jb-drop-wrap" data-jb-filter-drop="level">
                  <FilterDropdownButton
                    open={openFilter === 'level'}
                    active={levels.size > 0}
                    onClick={() => setOpenFilter(f => f === 'level' ? null : 'level')}
                  >
                    {fdropLabel(levels, 'Level')}
                  </FilterDropdownButton>
                  {openFilter === 'level' && (
                    <div className="jb-filter-panel">
                      <p className="jb-panel-label">Level</p>
                      {['Intern / New Grad', 'Entry-Mid', 'Mid', 'Senior', 'Lead', 'Director+'].map(l => (
                        <FilterPanelOptionButton key={l} selected={levels.has(l)} onClick={() => toggleLevel(l)}>
                          {l}
                        </FilterPanelOptionButton>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location（Recommend 原位：第二行） */}
                <div className="jb-drop-wrap" data-jb-filter-drop="location">
                  <FilterDropdownButton
                    open={openFilter === 'location'}
                    active={selectedLocations.size > 0}
                    onClick={() => setOpenFilter(f => f === 'location' ? null : 'location')}
                  >
                    {fdropLabel(selectedLocations, 'Location')}
                  </FilterDropdownButton>
                  {openFilter === 'location' && (
                    <div className="jb-filter-panel jb-filter-panel--loc jb-filter-panel--right">
                      <div className="jb-panel-label-row">
                        <p className="jb-panel-label">Quick pick</p>
                        <LocationResetIconButton onClick={() => { setSelectedLocations(new Set()); setLocSearch('') }} />
                      </div>
                      <div className="jb-loc-quick">
                        {LOC_QUICK.map(r => (
                          <LocationQuickPickButton key={r} active={selectedLocations.has(r)} onClick={() => toggleLocation(r)}>
                            {r}
                          </LocationQuickPickButton>
                        ))}
                      </div>
                      <div className="jb-loc-combobox">
                        <div className="jb-loc-input-area">
                          {Array.from(selectedLocations).map(loc => (
                            <span key={loc} className="jb-loc-inline-chip">
                              {loc}
                              <LocationChipRemoveButton onClick={e => { e.stopPropagation(); toggleLocation(loc) }} />
                            </span>
                          ))}
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--color-text-second-2)', flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                          <input
                            className="jb-loc-text-input"
                            placeholder={selectedLocations.size === 0 ? 'Search city or country…' : ''}
                            value={locSearch}
                            onChange={e => setLocSearch(e.target.value)}
                          />
                          {locSearch && (
                            <SearchClearButton onClick={() => setLocSearch('')} className="jb-loc-searchbox-clear" />
                          )}
                        </div>
                        {locSearch && (
                          <div className="jb-loc-dropdown">
                            {LOC_ALL.filter(c => c.toLowerCase().includes(locSearch.toLowerCase())).map(city => (
                              <LocationResultRowButton key={city} selected={selectedLocations.has(city)} onClick={() => { toggleLocation(city); setLocSearch('') }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {city}
                                {selectedLocations.has(city) && <svg className="jb-loc-check" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </LocationResultRowButton>
                            ))}
                            {LOC_ALL.filter(c => c.toLowerCase().includes(locSearch.toLowerCase())).length === 0 && (
                              <p className="jb-loc-no-results">No cities found</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <TogglePillButton
                  active={manualOnly}
                  onClick={() => setManualOnly(v => !v)}
                  className="jb-fpill jb-fpill--manual"
                  style={{ marginLeft: 'auto', flexShrink: 0 }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Manual apply
                </TogglePillButton>
                <TogglePillButton active={referralOnly} onClick={() => setReferralOnly(v => !v)} className="jb-fpill jb-fpill--referral" style={{ flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Referral only
                </TogglePillButton>
              </div>
            )}
          </div>

              <div className="jb-list-scroll">
                {jobs.map(job => <JobCard key={job.id} job={job} onSave={toggleSave} />)}
              </div>
              </>
              ) : (
                <DirectHireBoard />
              )}
            </div>
          </main>

          {/* 右侧栏：固定宽度，位于共享标题栏下方 */}
          <aside className="jb-panel">
            {activeTab === 'recommend' ? <AutoApplyPanel /> : <DirectHireCta />}
          </aside>
        </div>
      </section>

      {/* Floating Nova Chat */}
      <FloatingNovaChat />
    </div>
  )
}
