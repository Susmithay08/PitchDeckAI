import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/index.js'
import {
  ChevronLeft, ChevronRight, RotateCcw, Zap, TrendingUp, Users,
  DollarSign, Layers, Target, Award, BarChart2, Download, FileText,
  Palette, SlidersHorizontal, Check
} from 'lucide-react'

const INDUSTRIES = ['Technology', 'Healthcare', 'Fintech', 'EdTech', 'E-Commerce', 'SaaS', 'Consumer', 'Climate', 'Real Estate', 'Media']
const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth']

// ─── THEME SWATCH ─────────────────────────────────────────────────────────────
function ThemeSwatch({ themeObj, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
      borderRadius: 8, cursor: 'pointer', textAlign: 'left', width: '100%',
      background: active ? 'var(--cream2)' : 'transparent',
      border: active ? '2px solid var(--orange)' : '1.5px solid transparent',
      transition: 'all 0.12s', fontFamily: 'var(--font-body)'
    }}>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {[themeObj.colors.bg_dark, themeObj.colors.accent, themeObj.colors.bg_light].map((c, i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: active ? 600 : 400, flex: 1 }}>{themeObj.name}</span>
      {active && <Check size={12} color="var(--orange)" />}
    </button>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { generate, loading, themes, fetchThemes, theme, setTheme, error } = useStore()
  const [idea, setIdea] = useState('')
  const [industry, setIndustry] = useState('Technology')
  const [stage, setStage] = useState('Seed')
  const [slideCount, setSlideCount] = useState(10)
  const [showThemePicker, setShowThemePicker] = useState(false)

  useEffect(() => { fetchThemes() }, [])

  const submit = () => { if (idea.trim()) generate(idea.trim(), industry, stage, slideCount) }
  const activeTheme = themes.find(t => t.key === theme)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, right: -20, fontSize: '40vw', fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--cream2)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', zIndex: 0 }}>P</div>
      <div style={{ height: 5, background: 'var(--orange)' }} />

      <nav style={{ padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--orange)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>PitchDeck AI</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', letterSpacing: '0.12em' }}></div>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', maxWidth: 720, width: '100%' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--orange)', color: '#fff', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 28, letterSpacing: '0.08em' }}>
            <Zap size={12} fill="#fff" /> AI-POWERED PITCH DECKS
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(46px,7vw,88px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Your idea,<br />
            <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>investor-ready</span><br />
            in seconds.
          </h1>

          <p style={{ fontSize: 17, color: 'var(--ink3)', lineHeight: 1.6, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Describe your startup. Pick your slide count, choose a theme, and download as editable PPTX or PDF.
          </p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 8px 60px rgba(26,15,0,0.1)', border: '1px solid var(--border)', maxWidth: 660, margin: '0 auto', textAlign: 'left' }}>

            <label style={{ display: 'block', fontWeight: 600, fontSize: 11, color: 'var(--ink2)', marginBottom: 6, letterSpacing: '0.06em' }}>DESCRIBE YOUR STARTUP IDEA</label>
            <textarea value={idea} onChange={e => setIdea(e.target.value)}
              placeholder="e.g. An AI platform that helps restaurants reduce food waste by predicting demand..."
              rows={3}
              style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 10, padding: '11px 14px', fontSize: 14, color: 'var(--ink)', background: 'var(--cream)', resize: 'none', outline: 'none', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = 'var(--orange)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />

            {/* Industry + Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              {[['INDUSTRY', INDUSTRIES, industry, setIndustry], ['STAGE', STAGES, stage, setStage]].map(([lbl, opts, val, set]) => (
                <div key={lbl}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: 10, color: 'var(--ink3)', marginBottom: 5, letterSpacing: '0.08em' }}>{lbl}</label>
                  <select value={val} onChange={e => set(e.target.value)}
                    style={{ width: '100%', border: '1.5px solid var(--border)', borderRadius: 8, padding: '9px 10px', fontSize: 13, color: 'var(--ink)', background: 'var(--cream)', outline: 'none' }}>
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            {/* Slide count */}
            <div style={{ marginTop: 14 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 10, color: 'var(--ink3)', marginBottom: 8, letterSpacing: '0.08em' }}>
                <SlidersHorizontal size={11} /> NUMBER OF SLIDES
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="range" min={4} max={10} value={slideCount} onChange={e => setSlideCount(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--orange)', cursor: 'pointer' }} />
                <div style={{ display: 'flex', gap: 3 }}>
                  {[4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button key={n} onClick={() => setSlideCount(n)}
                      style={{
                        width: 26, height: 26, borderRadius: 5, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                        background: slideCount === n ? 'var(--orange)' : 'var(--cream2)',
                        color: slideCount === n ? '#fff' : 'var(--ink3)'
                      }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme picker */}
            <div style={{ marginTop: 14, position: 'relative' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 10, color: 'var(--ink3)', marginBottom: 5, letterSpacing: '0.08em' }}>
                <Palette size={11} /> EXPORT THEME
              </label>
              <button onClick={() => setShowThemePicker(v => !v)}
                style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 8, padding: '9px 12px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink)', fontFamily: 'var(--font-body)', textAlign: 'left' }}>
                {activeTheme ? (
                  <>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[activeTheme.colors.bg_dark, activeTheme.colors.accent, activeTheme.colors.bg_light].map((c, i) => (
                        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: '1px solid rgba(0,0,0,0.1)' }} />
                      ))}
                    </div>
                    <span style={{ flex: 1 }}>{activeTheme.name}</span>
                  </>
                ) : <span style={{ flex: 1, color: 'var(--ink3)' }}>Select theme...</span>}
                <Palette size={12} color="var(--ink3)" />
              </button>
              <p style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 5, fontStyle: 'italic' }}>
                ↑ This theme will be applied to your downloaded PPTX &amp; PDF
              </p>

              <AnimatePresence>
                {showThemePicker && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    style={{ position: 'absolute', top: 'calc(100% - 8px)', left: 0, right: 0, zIndex: 20, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', marginTop: 4 }}>
                    {themes.map(t => (
                      <ThemeSwatch key={t.key} themeObj={t} active={theme === t.key}
                        onClick={() => { setTheme(t.key); setShowThemePicker(false) }} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button onClick={submit} disabled={loading || !idea.trim()}
              style={{ width: '100%', marginTop: 20, background: loading ? 'var(--ink3)' : 'var(--orange)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 24px', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: !idea.trim() ? 'not-allowed' : 'pointer', opacity: !idea.trim() ? 0.6 : 1 }}>
              {loading
                ? <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Zap size={17} /></motion.div> Generating {slideCount}-slide deck...</>
                : <><Zap size={17} fill="#fff" /> Generate {slideCount}-Slide Pitch Deck</>}
            </button>

            {error && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 10, textAlign: 'center' }}>Error: {error}</p>}
          </motion.div>
        </motion.div>
      </div>

      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', background: 'var(--ink)', padding: '11px 0' }}>
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap', color: 'var(--cream2)', fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          {Array(6).fill(['PROBLEM SLIDE', 'MARKET OPPORTUNITY', 'TRACTION METRICS', 'BUSINESS MODEL', 'COMPETITIVE ANALYSIS', 'FUNDING ASK']).flat().map((t, i) => (
            <span key={i} style={{ flexShrink: 0 }}>◆ {t}</span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// ─── SLIDE RENDERERS ─────────────────────────────────────────────────────────
const slideIcons = { cover: Zap, problem: Target, solution: Zap, market: TrendingUp, product: Layers, traction: BarChart2, business_model: DollarSign, competition: Award, team: Users, ask: DollarSign }

function SlideHeader({ title, color }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ width: 36, height: 4, background: color, borderRadius: 2, marginBottom: 10 }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: 'var(--ink)', lineHeight: 1 }}>{title}</h2>
    </div>
  )
}

function CoverSlide({ s, name, tagline }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, right: -40, width: 400, height: 400, borderRadius: '50%', background: 'var(--orange)', opacity: 0.06 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', padding: '5px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, marginBottom: 20, letterSpacing: '0.1em' }}>PITCH DECK</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,6vw,70px)', fontWeight: 900, lineHeight: 1, marginBottom: 14, color: 'var(--ink)' }}>{name}</h1>
        <p style={{ fontSize: 20, color: 'var(--orange)', fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 24 }}>{tagline}</p>
        <p style={{ fontSize: 14, color: 'var(--ink3)', maxWidth: 480, lineHeight: 1.6 }}>{s.body}</p>
      </div>
    </div>
  )
}

function ProblemSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="var(--orange)" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
        <div>
          <div style={{ background: 'var(--ink)', borderRadius: 14, padding: '18px 22px', marginBottom: 18 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#aaa', marginBottom: 5 }}>MARKET PAIN</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: 'var(--orange)' }}>{s.stat}</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7 }}>{s.body}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {s.bullets?.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--cream2)', borderRadius: 10, padding: '11px 13px', borderLeft: '3px solid var(--orange)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--orange)', fontWeight: 700, marginTop: 1 }}>0{i + 1}</span>
              <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SolutionSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#4A7C59" />
      <p style={{ fontSize: 14, color: 'var(--ink2)', lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>{s.body}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {s.bullets?.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#fff', borderRadius: 10, padding: '12px 16px', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: '#4A7C59', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Check size={14} color="#fff" />
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#2B6CB0" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 20 }}>
        {[['TAM', s.tam, 'Total Addressable', '#2B6CB0'], ['SAM', s.sam, 'Serviceable Addressable', '#4A7C59'], ['SOM', s.som, 'Serviceable Obtainable', 'var(--orange)']].map(([lbl, val, desc, color]) => (
          <div key={lbl} style={{ background: '#fff', borderRadius: 12, padding: '18px 14px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', marginBottom: 5, letterSpacing: '0.1em' }}>{lbl}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color, marginBottom: 5 }}>{val}</div>
            <div style={{ fontSize: 10, color: 'var(--ink3)', lineHeight: 1.4 }}>{desc}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7 }}>{s.body}</p>
    </div>
  )
}

function ProductSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#C9860A" />
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
        {s.steps?.map((step, i) => (
          <div key={i} style={{ flex: 1, background: i === 0 ? 'var(--ink)' : i === 1 ? 'var(--cream2)' : '#fff', border: '1px solid var(--border)', padding: '22px 18px', borderRadius: i === 0 ? '12px 0 0 12px' : i === s.steps.length - 1 ? '0 12px 12px 0' : 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 900, lineHeight: 1, color: i === 0 ? 'var(--orange)' : '#C9860A', marginBottom: 8 }}>{step.step}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: i === 0 ? '#fff' : 'var(--ink)' }}>{step.title}</div>
            <div style={{ fontSize: 11, lineHeight: 1.6, color: i === 0 ? 'var(--cream2)' : 'var(--ink3)' }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TractionSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="var(--orange)" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
        {s.metrics?.map((m, i) => (
          <div key={i} style={{ background: i % 2 === 0 ? 'var(--ink)' : '#fff', borderRadius: 12, padding: '18px', border: '1px solid var(--border)', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: i % 2 === 0 ? 'var(--orange)' : 'var(--ink)', marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: i % 2 === 0 ? '#aaa' : 'var(--ink3)' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.6 }}>{s.body}</p>
    </div>
  )
}

function BusinessModelSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#4A7C59" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {s.revenue_streams?.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 65px', gap: 12, alignItems: 'center', background: '#fff', borderRadius: 10, padding: '13px 16px', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--ink)' }}>{r.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink3)', lineHeight: 1.5 }}>{r.desc}</div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#4A7C59' }}>{r.pct}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompetitionSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#2B6CB0" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--ink2)', lineHeight: 1.7 }}>{s.body}</p>
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--ink3)', marginBottom: 10, letterSpacing: '0.08em' }}>OUR ADVANTAGES</div>
          {s.advantages?.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 9 }}>
              <div style={{ width: 20, height: 20, background: '#2B6CB0', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <span style={{ color: '#fff', fontSize: 10 }}>★</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--ink2)', lineHeight: 1.5 }}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamSlide({ s }) {
  const colors = ['var(--orange)', '#4A7C59', '#2B6CB0']
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="#C9860A" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {s.members?.map((m, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '18px 14px', border: '1px solid var(--border)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: colors[i % 3], marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900, color: '#fff' }}>{m.name.charAt(0)}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{m.name}</div>
            <div style={{ fontSize: 10, color: colors[i % 3], fontWeight: 600, marginBottom: 7, letterSpacing: '0.05em' }}>{m.role}</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', lineHeight: 1.5 }}>{m.background}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AskSlide({ s }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SlideHeader title={s.title} color="var(--orange)" />
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: 'var(--orange)', lineHeight: 1 }}>{s.amount}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)', marginTop: 4, letterSpacing: '0.1em' }}>{s.round} ROUND</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 10, color: 'var(--ink3)', marginBottom: 12, letterSpacing: '0.08em' }}>USE OF FUNDS</div>
          {s.use_of_funds?.map((f, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{f.category}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--orange)' }}>{f.pct}%</span>
              </div>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 3 }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${f.pct}%` }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'var(--orange)', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 2 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
      {s.vision && (
        <div style={{ marginTop: 20, background: 'var(--ink)', borderRadius: 10, padding: '13px 17px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.5 }}>"{s.vision}"</p>
        </div>
      )}
    </div>
  )
}

function renderSlide(s, pitch) {
  if (!s) return null
  switch (s.id) {
    case 'cover': return <CoverSlide s={s} name={pitch.startup_name} tagline={pitch.tagline} />
    case 'problem': return <ProblemSlide s={s} />
    case 'solution': return <SolutionSlide s={s} />
    case 'market': return <MarketSlide s={s} />
    case 'product': return <ProductSlide s={s} />
    case 'traction': return <TractionSlide s={s} />
    case 'business_model': return <BusinessModelSlide s={s} />
    case 'competition': return <CompetitionSlide s={s} />
    case 'team': return <TeamSlide s={s} />
    case 'ask': return <AskSlide s={s} />
    default: return <div style={{ padding: 20 }}><h3>{s.title}</h3></div>
  }
}

// ─── DECK VIEWER ─────────────────────────────────────────────────────────────
function DeckViewer({ pitch }) {
  const { currentSlide, setSlide, reset, theme, themes, setTheme, exportDeck, exporting } = useStore()
  const [showThemePanel, setShowThemePanel] = useState(false)

  // Safety guard
  if (!pitch || !pitch.slides || pitch.slides.length === 0) return null

  const slides = pitch.slides
  const slide = slides[currentSlide] || slides[0]
  const activeTheme = themes.find(t => t.key === theme)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' }}>
      <div style={{ height: 4, background: 'var(--orange)' }} />

      {/* Top bar */}
      <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: '#fff', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: 'var(--orange)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>{pitch.startup_name}</div>
            <div style={{ fontSize: 10, color: 'var(--ink3)', fontFamily: 'var(--font-mono)' }}>{pitch.tagline}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Theme picker */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowThemePanel(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, padding: '7px 11px', fontSize: 12, color: 'var(--ink2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {activeTheme && (
                <div style={{ display: 'flex', gap: 2 }}>
                  {[activeTheme.colors.bg_dark, activeTheme.colors.accent].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                </div>
              )}
              <Palette size={12} /> Theme
            </button>

            <AnimatePresence>
              {showThemePanel && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: 230 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--ink3)', padding: '3px 8px 6px', letterSpacing: '0.1em' }}>CHOOSE EXPORT THEME</div>
                  {themes.map(t => (
                    <ThemeSwatch key={t.key} themeObj={t} active={theme === t.key}
                      onClick={() => { setTheme(t.key); setShowThemePanel(false) }} />
                  ))}
                  <p style={{ fontSize: 10, color: 'var(--ink3)', padding: '6px 8px 2px', fontStyle: 'italic', borderTop: '1px solid var(--border)', marginTop: 4 }}>Applied to PPTX &amp; PDF download</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Download PPTX */}
          <button onClick={() => exportDeck('pptx')} disabled={!!exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--ink)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: exporting === 'pptx' ? 0.6 : 1 }}>
            {exporting === 'pptx'
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><Download size={12} /></motion.div>
              : <Download size={12} />}
            .pptx
          </button>

          {/* Download PDF */}
          <button onClick={() => exportDeck('pdf')} disabled={!!exporting}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--orange)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 13px', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: exporting === 'pdf' ? 0.6 : 1 }}>
            {exporting === 'pdf'
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}><FileText size={12} /></motion.div>
              : <FileText size={12} />}
            .pdf
          </button>

          {/* New pitch */}
          <button onClick={() => reset()}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, padding: '7px 11px', fontSize: 12, color: 'var(--ink2)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            <RotateCcw size={12} /> New
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '204px 1fr', overflow: 'hidden' }}>
        {/* Slide nav sidebar */}
        <div style={{ borderRight: '1px solid var(--border)', padding: '14px 0', overflowY: 'auto', background: '#fff' }}>
          {slides.map((s, i) => {
            const SIcon = slideIcons[s.id] || Zap
            const active = i === currentSlide
            return (
              <button key={i} onClick={() => setSlide(i)}
                style={{ width: '100%', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8, background: active ? 'var(--cream)' : 'none', border: 'none', borderLeft: active ? '3px solid var(--orange)' : '3px solid transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s', fontFamily: 'var(--font-body)' }}>
                <div style={{ width: 24, height: 24, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'var(--orange)' : 'var(--cream2)', flexShrink: 0 }}>
                  <SIcon size={11} color={active ? '#fff' : 'var(--ink3)'} />
                </div>
                <div>
                  <div style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'var(--ink3)', letterSpacing: '0.08em' }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? 'var(--ink)' : 'var(--ink2)', lineHeight: 1.3 }}>{s.title}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main slide */}
        <div style={{ padding: '28px 44px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide}
              initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              style={{ background: '#fff', borderRadius: 18, padding: '40px 48px', minHeight: 420, boxShadow: '0 8px 40px rgba(26,15,0,0.07)', border: '1px solid var(--border)' }}>
              {renderSlide(slide, pitch)}
            </motion.div>
          </AnimatePresence>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <button onClick={() => setSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px solid var(--border)', borderRadius: 8, padding: '8px 13px', fontSize: 12, color: 'var(--ink2)', cursor: currentSlide === 0 ? 'not-allowed' : 'pointer', opacity: currentSlide === 0 ? 0.3 : 1, fontFamily: 'var(--font-body)' }}>
              <ChevronLeft size={13} /> Previous
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink3)' }}>{currentSlide + 1} / {slides.length}</span>
            <button onClick={() => setSlide(Math.min(slides.length - 1, currentSlide + 1))} disabled={currentSlide === slides.length - 1}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--orange)', border: 'none', borderRadius: 8, padding: '8px 13px', fontSize: 12, color: '#fff', cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer', opacity: currentSlide === slides.length - 1 ? 0.3 : 1, fontWeight: 600 }}>
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { pitch } = useStore()
  return pitch
    ? <DeckViewer pitch={pitch} />
    : <Hero />
}
