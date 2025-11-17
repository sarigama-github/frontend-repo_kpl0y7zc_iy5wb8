import React, { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import { motion, useScroll, useTransform } from 'framer-motion'
import './index.css'

const API = import.meta.env.VITE_BACKEND_URL || ''

function useFetch(url, initial = null) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let mounted = true
    async function run() {
      try {
        const res = await fetch(url)
        const json = await res.json()
        if (mounted) setData(json)
      } catch (e) {
        if (mounted) setError(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (url) run()
    return () => { mounted = false }
  }, [url])
  return { data, loading, error }
}

function Section({ id, children }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center relative snap-start">
      <div className="max-w-6xl w-full px-6 md:px-10">
        {children}
      </div>
    </section>
  )
}

function NeonTitle({ label, title }) {
  return (
    <div className="mb-8">
      <div className="text-cyan-300 uppercase tracking-[0.35em] text-xs md:text-sm mb-3 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        {label}
      </div>
      <h2 className="text-3xl md:text-5xl font-semibold text-white">
        {title}
      </h2>
    </div>
  )
}

function Hero({ profile }) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 pointer-events-none" />
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-200 text-xs md:text-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_1px_rgba(34,211,238,0.8)]" />
            Futuristisches Portfolio
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">
            {profile?.name || 'Elektroniker & IT-Techniker'}
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-cyan-100/90">{profile?.title || 'Elektronik • IT • Automation'}</p>
          <p className="mt-6 max-w-2xl text-cyan-100/80">{profile?.bio || 'Ich verbinde Hardware, Software und UX – robust, effizient und ästhetisch.'}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#kontakt" className="px-5 py-2 rounded-full bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors shadow-[0_0_25px_rgba(34,211,238,0.35)]">Kontakt</a>
            <a href="#projekte" className="px-5 py-2 rounded-full border border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10 transition-colors">Projekte</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Tunnel() {
  // Scroll-linked 3D tunnel illusion using layered radial gradients
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ container: ref })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2.5])
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 0.9])

  return (
    <div ref={ref} className="fixed inset-0 -z-0 pointer-events-none" aria-hidden>
      <motion.div
        style={{ rotate, scale, opacity }}
        className="absolute inset-0"
      >
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.25), transparent 35%),
                            radial-gradient(circle at 20% 30%, rgba(168,85,247,0.22), transparent 30%),
                            radial-gradient(circle at 80% 70%, rgba(34,211,238,0.24), transparent 25%),
                            repeating-conic-gradient(from 0deg, rgba(0,0,0,0.0) 0 15deg, rgba(0,0,0,0.35) 15deg 30deg)`,
          filter: 'blur(0px)'
        }} />
      </motion.div>
    </div>
  )
}

function Slide({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative bg-black/40 border border-white/5 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_10px_60px_-10px_rgba(34,211,238,0.2)]"
    >
      {children}
    </motion.div>
  )
}

function Skills({ items }) {
  const groups = items?.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || []
    acc[s.category].push(s)
    return acc
  }, {}) || {}
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {Object.entries(groups).map(([cat, list]) => (
        <div key={cat} className="bg-gradient-to-b from-cyan-500/5 to-violet-500/5 rounded-xl p-6 border border-white/5">
          <div className="text-cyan-200 mb-3 tracking-widest uppercase text-xs">{cat}</div>
          <ul className="space-y-3">
            {list.map((s, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="text-white/90">{s.name}</span>
                {s.level && (
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx} className={`w-2.5 h-2.5 rounded-full ${idx < s.level ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Projects({ items }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(items || []).map((p, i) => (
        <a key={i} href={p.link || '#'} className="group block">
          <div className="aspect-video rounded-xl overflow-hidden border border-white/5 bg-gradient-to-br from-slate-900 to-black relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(34,211,238,0.15), transparent 30%), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.15), transparent 30%)'
            }} />
          </div>
          <div className="mt-3">
            <div className="text-white font-medium">{p.title}</div>
            <div className="text-white/70 text-sm">{p.description}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(p.tags || []).map((t, j) => (
                <span key={j} className="text-[11px] px-2 py-0.5 rounded-full border border-cyan-400/30 text-cyan-200/90 bg-cyan-400/10">{t}</span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

function Timeline({ items }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400/60 via-white/10 to-violet-400/60" />
      <div className="space-y-6">
        {(items || []).map((e, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-white font-medium">{e.company || e.school}</div>
              <div className="text-white/70 text-sm">{e.role || e.degree}</div>
              <div className="text-white/50 text-xs">{e.start} – {e.end || 'Heute'}</div>
              {e.summary && <div className="mt-2 text-white/80 text-sm">{e.summary}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Contact() {
  const [state, setState] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  async function onSubmit(e) {
    e.preventDefault()
    const res = await fetch(`${API}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) })
    if (res.ok) setSent(true)
  }
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
      <input aria-label="Name" placeholder="Name" className="input" value={state.name} onChange={e=>setState(s=>({...s, name:e.target.value}))} required />
      <input aria-label="E-Mail" placeholder="E-Mail" className="input" type="email" value={state.email} onChange={e=>setState(s=>({...s, email:e.target.value}))} required />
      <input aria-label="Betreff" placeholder="Betreff" className="input md:col-span-2" value={state.subject} onChange={e=>setState(s=>({...s, subject:e.target.value}))} />
      <textarea aria-label="Nachricht" placeholder="Nachricht" className="input md:col-span-2 h-40" value={state.message} onChange={e=>setState(s=>({...s, message:e.target.value}))} required />
      <div className="md:col-span-2 flex items-center gap-3">
        <button className="px-5 py-2 rounded-full bg-violet-500 hover:bg-violet-400 text-black font-medium shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-colors">Senden</button>
        {sent && <span className="text-cyan-300">Danke! Nachricht gesendet.</span>}
      </div>
    </form>
  )
}

export default function App() {
  const { data: profile } = useFetch(`${API}/profile`, null)
  const { data: skills } = useFetch(`${API}/skills`, [])
  const { data: projects } = useFetch(`${API}/projects`, [])
  const { data: experience } = useFetch(`${API}/experience`, [])
  const { data: education } = useFetch(`${API}/education`, [])

  useEffect(() => {
    // attempt seed on first load (no-op if already seeded)
    fetch(`${API}/seed`, { method: 'POST' }).catch(()=>{})
  }, [])

  return (
    <div className="min-h-screen bg-black text-white snap-y snap-mandatory overflow-y-auto">
      <Tunnel />

      <Hero profile={profile} />

      <Section id="ueber-mich">
        <Slide>
          <NeonTitle label="Über mich" title="Elektronik + IT. Präzision + UX." />
          <p className="text-white/80 max-w-3xl">
            {profile?.bio || 'Ich konzipiere, baue und betreue Systeme, die zuverlässig funktionieren – von Leiterplatten über Embedded-Software bis hin zu Cloud-Services und modernen UIs.'}
          </p>
        </Slide>
      </Section>

      <Section id="skills">
        <Slide>
          <NeonTitle label="Skills" title="Werkzeuge & Stärken" />
          <Skills items={skills || []} />
        </Slide>
      </Section>

      <Section id="projekte">
        <Slide>
          <NeonTitle label="Projekte" title="Ausgewählte Arbeiten" />
          <Projects items={projects || []} />
        </Slide>
      </Section>

      <Section id="erfahrung">
        <Slide>
          <NeonTitle label="Ausbildung & Erfahrung" title="Timeline" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-cyan-200 mb-3 tracking-widest uppercase text-xs">Erfahrung</div>
              <Timeline items={experience || []} />
            </div>
            <div>
              <div className="text-cyan-200 mb-3 tracking-widest uppercase text-xs">Ausbildung</div>
              <Timeline items={education || []} />
            </div>
          </div>
        </Slide>
      </Section>

      <Section id="kontakt">
        <Slide>
          <NeonTitle label="Kontakt" title="Lass uns sprechen" />
          <Contact />
        </Slide>
      </Section>

      <footer className="py-10 text-center text-white/50">
        © {new Date().getFullYear()} – Elektroniker & IT-Techniker Portfolio
      </footer>
    </div>
  )
}
