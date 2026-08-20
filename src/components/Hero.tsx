const HERO_BADGE_ICON = '/img/hero/badge_icon.svg'
const HERO_MAIN_IMAGE = '/img/hero/main_image.png'
const HERO_TREND_1 = '/img/hero/trend_1.svg'
const HERO_TREND_2 = '/img/hero/trend_2.svg'
const HERO_CHIP_NOTIFICATION = '/img/hero/chip_notification.svg'
const HERO_CHIP_AI_ACTIONS = '/img/hero/chip_ai_actions.svg'
const HERO_CHIP_AUTO_APPLY = '/img/hero/chip_auto_apply.svg'
const HERO_STAR_L = '/img/hero/star_l.svg'
const HERO_STAR_S = '/img/hero/star_s.svg'
const HERO_DOT = '/img/hero/dot.svg'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-card">

        {/* Left Content */}
        <div className="hero-left fade-up">
          <div className="hero-text-group">
            <div className="hero-pill">
              <img src={HERO_BADGE_ICON} alt="" width={20} height={20} />
              <span>We apply. You interview.</span>
            </div>

            <h1 className="hero-heading">
              The New Way Talent Meets{' '}
              <span className="hero-heading-accent">Opportunity</span>{' '}
              in the AI Era.
            </h1>

            <div className="hero-subtext-group">
              <p className="hero-subtext">
                We work for your career — even while you sleep.
              </p>
              <p className="hero-subtext hero-subtext--muted">
                Discover opportunities · Optimize your resume · Auto-apply 24/7
              </p>
            </div>
          </div>

          <a href="#" className="cta-btn cta-btn--hero">Start for Free</a>
        </div>

        {/* Right Visual */}
        <div className="hero-right">
          <div className="hero-glow" />

          <img
            className="hero-img"
            src={HERO_MAIN_IMAGE}
            alt="Professional with AI job matching interface"
          />

          {/* Trend icons */}
          <div className="hero-deco hero-trend t1">
            <img src={HERO_TREND_1} alt="" width={58} height={58} />
          </div>
          <div className="hero-deco hero-trend t2">
            <img src={HERO_TREND_2} alt="" width={72} height={72} />
          </div>

          {/* Feature chips */}
          <div className="hero-chip chip-notification">
            <img src={HERO_CHIP_NOTIFICATION} alt="" width={20} height={20} />
            Instant Notification
          </div>
          <div className="hero-chip chip-ai-actions">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
            </svg>
            Hidden Opportunity
          </div>
          <div className="hero-chip chip-auto-apply">
            <img src={HERO_CHIP_AUTO_APPLY} alt="" width={20} height={20} />
            Auto Apply
          </div>

          {/* Star decorations */}
          <div className="hero-deco hero-star s1"><img src={HERO_STAR_L} alt="" width={45} height={45} /></div>
          <div className="hero-deco hero-star s2"><img src={HERO_STAR_S} alt="" width={25} height={25} /></div>
          <div className="hero-deco hero-star s3"><img src={HERO_STAR_S} alt="" width={25} height={25} /></div>

          {/* Dot decorations */}
          <div className="hero-deco hero-dot d1"><img src={HERO_DOT} alt="" width={23} height={23} /></div>
          <div className="hero-deco hero-dot d2"><img src={HERO_DOT} alt="" width={23} height={23} /></div>
        </div>

      </div>
    </section>
  )
}
