'use client'
import { useState } from 'react'

// ── Glyphs ───────────────────────────────────────────────────────────
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

const SignalIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
    <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
)

const OutreachIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M12 7v5M9.5 9.5h5" />
  </svg>
)

const LockIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const AuthIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="2" width="14" height="20" rx="2.5" />
    <path d="M9.5 13.5l1.7 1.7 3.3-3.4" />
  </svg>
)

const ChevronIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const BackIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
)

const CloseIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const Spinner = () => <span className="dh-spinner" aria-hidden="true" />

// ── Static content ───────────────────────────────────────────────────
const MINI_CARDS = [
  { Icon: SignalIcon, title: 'Real-time signals', text: 'Find hiring managers posting relevant roles.' },
  { Icon: LockIcon, title: 'Safe connection', text: 'Your LinkedIn connection stays secure.' },
  { Icon: OutreachIcon, title: 'Personalized outreach in bulk', text: 'Send outreach in bulk after review.' },
]

const TRUST_CHIPS = [
  'Secure connection',
  'You approve outreach',
  'Disconnect anytime',
]

// Compact arrow flow shown when "Can't find your 2FA key?" is expanded.
const SECRET_KEY_STEPS = [
  'LinkedIn Settings & Privacy',
  'Sign in & Security',
  'Two-Step Verification',
  'Turn it off',
  'Turn it back on',
  'Save the new secret key somewhere secure',
]

const CONVERSATION_OPTIONS = [
  'Do not import conversations',
  'Import only new outreach conversations',
  'Import all LinkedIn conversations',
]

const COUNTRY_OPTIONS = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'India',
  'Other',
]

type Method = '2fa' | 'credentials'
type Step = 'login' | 'verify' | 'connecting' | 'success'

export default function LinkedInConnectModal({
  onClose,
  onConnected,
}: {
  /** Dismiss the modal without connecting. */
  onClose: () => void
  /** Fired from the success state — flips the page into the connected view. */
  onConnected: () => void
}) {
  const [step, setStep] = useState<Step>('login')
  const [method, setMethod] = useState<Method>('2fa')
  const [busy, setBusy] = useState(false)
  const [topOpen, setTopOpen] = useState(true)

  // Shared credentials + options
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [conversations, setConversations] = useState(CONVERSATION_OPTIONS[0])
  const [country, setCountry] = useState('United States')

  // 2FA + verification
  const [twoFaSecret, setTwoFaSecret] = useState('')
  const [confirmAuthApp, setConfirmAuthApp] = useState(false)
  const [confirmHasKey, setConfirmHasKey] = useState(false)
  const [secretHelpOpen, setSecretHelpOpen] = useState(false)
  const [code, setCode] = useState('')

  // ── Validation ──
  const baseFilled = email.trim().length > 0 && password.trim().length > 0
  // In 2FA mode the user must confirm both checklist items before filling the form.
  const twoFaConfirmed = confirmAuthApp && confirmHasKey
  const fieldsLocked = method === '2fa' && !twoFaConfirmed
  const twoFaReady = baseFilled && twoFaSecret.trim().length > 0 && twoFaConfirmed
  const canContinue = method === '2fa' ? twoFaReady : baseFilled
  const canVerify = code.trim().length === 6

  // ── Transitions ──
  const runBusy = (next: Step, ms = 900) => {
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setStep(next)
    }, ms)
  }
  // Show the "connecting" stage, then reveal success only once it completes.
  const goConnecting = () => {
    setStep('connecting')
    setTimeout(() => setStep('success'), 1800)
  }
  const handleContinue = () => {
    if (!canContinue || busy) return
    // 2FA collects the secret key up front; credentials confirm via a follow-up code.
    if (method === '2fa') goConnecting()
    else runBusy('verify')
  }
  const handleVerify = () => {
    if (!canVerify || busy) return
    goConnecting()
  }

  const digitsOnly = (v: string) => v.replace(/\D/g, '').slice(0, 6)

  return (
    <div className="dh-modal-overlay" onClick={onClose}>
      <div
        className="dh-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Connect LinkedIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dh-modal-head">
          {step === 'verify' ? (
            <button className="dh-modal-back" onClick={() => setStep('login')} aria-label="Back">
              <BackIcon size={16} />
            </button>
          ) : (
            <span className="dh-modal-head-icon"><LinkedInGlyph size={16} /></span>
          )}
          <div className="dh-modal-head-titles">
            <h2 className="dh-modal-head-title">Connect LinkedIn</h2>
            {step === 'login' && (
              <p className="dh-modal-head-sub">
                Securely connect your LinkedIn account to unlock Direct Hire Signals.
              </p>
            )}
          </div>
          <button className="dh-modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="dh-modal-body">
          {/* ── One-page login ── */}
          {step === 'login' && (
            <>
              {/* Supportive benefits + trust (collapsible) */}
              <div className={`dh-disclose${topOpen ? ' is-open' : ''}`}>
                <button
                  className="dh-disclose-toggle"
                  onClick={() => setTopOpen(o => !o)}
                  aria-expanded={topOpen}
                >
                  <span>Benefits &amp; Security</span>
                  <span className="dh-disclose-chevron"><ChevronIcon size={15} /></span>
                </button>
                {topOpen && (
                  <div className="dh-disclose-body">
                    <div className="dh-mini-cards">
                      {MINI_CARDS.map(({ Icon, title, text }) => (
                        <div key={title} className="dh-mini-card">
                          <span className="dh-mini-card-icon"><Icon size={16} /></span>
                          <p className="dh-mini-card-title">{title}</p>
                          <p className="dh-mini-card-text">{text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="dh-trustbar">
                      <p className="dh-trustbar-text">
                        Your LinkedIn connection is secure. JobNova only uses it to find relevant hiring
                        signals and prepare outreach you approve.
                      </p>
                      <ul className="dh-trust-chips">
                        {TRUST_CHIPS.map(c => (
                          <li key={c} className="dh-trust-chip">
                            <CheckIcon size={9} /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Method selector */}
              <div className="dh-seg" role="tablist" aria-label="Connection method">
                <button
                  role="tab"
                  aria-selected={method === '2fa'}
                  className={`dh-seg-btn${method === '2fa' ? ' is-on' : ''}`}
                  onClick={() => setMethod('2fa')}
                >
                  <AuthIcon size={14} /> 2FA / Authenticator
                </button>
                <button
                  role="tab"
                  aria-selected={method === 'credentials'}
                  className={`dh-seg-btn${method === 'credentials' ? ' is-on' : ''}`}
                  onClick={() => setMethod('credentials')}
                >
                  <LockIcon size={14} /> Credentials Login
                </button>
              </div>

              {/* Login form */}
              <div className="dh-modal-form">
                {method === '2fa' && (
                  <div className="dh-confirm">
                    <label className="dh-confirm-item">
                      <input type="checkbox" checked={confirmAuthApp} onChange={e => setConfirmAuthApp(e.target.checked)} />
                      <span className="dh-confirm-text">
                        <span className="dh-confirm-label">Yes, I confirm I used an Authenticator app</span>
                        <span className="dh-confirm-help">
                          To use this method, your LinkedIn 2FA should be enabled through an
                          authenticator app, not only SMS.
                        </span>
                      </span>
                    </label>
                    <label className="dh-confirm-item">
                      <input type="checkbox" checked={confirmHasKey} onChange={e => setConfirmHasKey(e.target.checked)} />
                      <span className="dh-confirm-text">
                        <span className="dh-confirm-label">Yes, I have my 2FA secret key or verification code</span>
                        <span className="dh-confirm-help">
                          Your 2FA secret key or verification code comes from LinkedIn or your
                          authenticator app. Keep in mind that LinkedIn may only show the secret key
                          during setup.
                        </span>
                      </span>
                    </label>
                  </div>
                )}

                <label className="dh-field">
                  <span className="dh-field-label">LinkedIn email or username</span>
                  <input
                    className="dh-input"
                    type="text"
                    autoComplete="username"
                    placeholder="you@email.com"
                    value={email}
                    disabled={fieldsLocked}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>

                <label className="dh-field">
                  <span className="dh-field-label">LinkedIn password</span>
                  <input
                    className="dh-input"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    disabled={fieldsLocked}
                    onChange={e => setPassword(e.target.value)}
                  />
                </label>

                {method === '2fa' && (
                  <>
                    <label className="dh-field">
                      <span className="dh-field-label">2FA secret key</span>
                      <input
                        className="dh-input"
                        type="text"
                        autoComplete="off"
                        placeholder="Your 2FA secret key"
                        value={twoFaSecret}
                        disabled={fieldsLocked}
                        onChange={e => setTwoFaSecret(e.target.value)}
                      />
                      <span className="dh-field-help">
                        Your 2FA secret key comes from LinkedIn when setting up app-based Two-Step
                        Verification. This is different from the 6-digit code shown in your
                        Authenticator app.
                      </span>
                      <div className="dh-field-linkrow">
                        <button
                          type="button"
                          className="dh-link"
                          onClick={() => setSecretHelpOpen(o => !o)}
                          aria-expanded={secretHelpOpen}
                        >
                          Can’t find your 2FA key?
                        </button>
                      </div>
                      {secretHelpOpen && (
                        <div className="dh-2fa-help">
                          {SECRET_KEY_STEPS.map((s, i) => (
                            <span key={s} className="dh-2fa-help-step">
                              {i > 0 && <span className="dh-2fa-help-arrow" aria-hidden="true">→</span>}
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </label>
                  </>
                )}

                <label className="dh-field">
                  <span className="dh-field-label">Select which LinkedIn conversations to load</span>
                  <div className="dh-select-wrap">
                    <select className="dh-select" value={conversations} disabled={fieldsLocked} onChange={e => setConversations(e.target.value)}>
                      {CONVERSATION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronIcon size={15} />
                  </div>
                  <span className="dh-field-help">
                    You can change this later. JobNova only uses conversation access for outreach
                    actions you approve.
                  </span>
                </label>

                <label className="dh-field">
                  <span className="dh-field-label">Select your country</span>
                  <div className="dh-select-wrap">
                    <select className="dh-select" value={country} disabled={fieldsLocked} onChange={e => setCountry(e.target.value)}>
                      {COUNTRY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronIcon size={15} />
                  </div>
                </label>
              </div>

              <button className="dh-modal-cta" onClick={handleContinue} disabled={!canContinue || busy}>
                {busy ? <><Spinner /> Connecting…</> : 'Continue'}
              </button>
            </>
          )}

          {/* ── Lightweight verification follow-up (credentials) ── */}
          {step === 'verify' && (
            <>
              <div className="dh-verify-orb"><LinkedInGlyph size={20} /></div>
              <div className="dh-modal-intro dh-modal-intro--center">
                <h3 className="dh-modal-intro-title">LinkedIn verification</h3>
                <p className="dh-modal-intro-desc">
                  LinkedIn may send a verification code by SMS, email, or authenticator app. Enter the
                  code below to finish connecting your account.
                </p>
              </div>

              <div className="dh-field dh-field--center">
                <span className="dh-field-label">6-digit verification code</span>
                <input
                  className="dh-input dh-input--code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={code}
                  onChange={e => setCode(digitsOnly(e.target.value))}
                  autoFocus
                />
                <span className="dh-field-help">
                  This code comes from LinkedIn or your authenticator app. JobNova uses it only to
                  complete the connection process.
                </span>
              </div>

              <button className="dh-modal-cta" onClick={handleVerify} disabled={!canVerify || busy}>
                {busy ? <><Spinner /> Verifying…</> : 'Verify and Connect'}
              </button>
            </>
          )}

          {/* ── Connecting / syncing ── */}
          {step === 'connecting' && (
            <div className="dh-connecting">
              <span className="dh-connecting-spinner" aria-hidden="true" />
              <h3 className="dh-connecting-title">Please wait</h3>
              <p className="dh-connecting-copy">
                We are connecting your LinkedIn account and setting everything up.
              </p>
            </div>
          )}

          {/* ── Success ── */}
          {step === 'success' && (
            <div className="dh-success">
              <div className="dh-success-orb"><CheckIcon size={26} /></div>
              <h3 className="dh-success-title">LinkedIn connected successfully</h3>
              <p className="dh-success-copy">
                You can now view real Direct Hire Signals matched to your job preferences and send
                outreach in bulk after review.
              </p>
              <button className="dh-modal-cta" onClick={onConnected}>View Direct Hire Signals</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
