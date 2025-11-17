import { useEffect, useMemo, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Spline from '@splinetool/react-spline'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useFetch(path, initial = []) {
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const res = await fetch(`${API}${path}`)
        const json = await res.json()
        if (active) setData(json)
      } catch (e) {
        if (active) setError(String(e))
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => { active = false }
  }, [path])
  return { data, loading, error }
}

function Tunnel() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 6])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 0.9, 0.5, 0.3])
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 -z-10 bg-black"
      style={{}}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(34,211,238,0.35), transparent 60%)'
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          scale,
          opacity,
          background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.35), transparent 40%)'
        }}
      />
      <div className="absolute inset-0 mix-blend-screen opacity-70" style={{background:'conic-gradient(from 0deg at 50% 50%, rgba(31,182,255,0.2), rgba(168,85,247,0.1), rgba(34,197,94,0.05), rgba(31,182,255,0.2))'}} />
    </motion.div>
  )
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.65)]">
          {title}
        </h2>
        <div className="mt-6 text-neutral-200/90">
          {children}
        </div>
      </div>
    </section>
  )
}

function Hero() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center">
      <div className="absolute inset-0 opacity-70">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" aria-hidden />
      </div>
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-cyan-200 drop-shadow-[0_0_16px_rgba(34,211,238,0.6)]">
          Elektronik & IT Technik
        </h1>
        <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
          Hardware trifft Software: PCB-Design, Embedded, Netzwerke und Automatisierung – futuristisch und zugänglich.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <a href="#about" className="px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40 hover:bg-cyan-500/30 transition">Mehr erfahren</a>
          <a href="#contact" className="px-5 py-2 rounded-lg bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/40 hover:bg-violet-500/30 transition">Kontakt</a>
        </div>
      </div>
    </div>
  )
}

function Skills({ items }) {
  const byCat = useMemo(() => {
    const map = {}
    for (const s of items) {
      map[s.category] = map[s.category] || []
      map[s.category].push(s)
    }
    return map
  }, [items])
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {Object.entries(byCat).map(([cat, arr]) => (
        <div key={cat} className="rounded-xl border border-cyan-400/20 bg-white/5 backdrop-blur-md p-4">
          <div className="text-cyan-300 font-semibold">{cat}</div>
          <ul className="mt-3 space-y-2">
            {arr.map((s, i) => (
              <li key={i} className="flex items-center justify-between text-neutral-200">
                <span>{s.name}</span>
                <span className="text-xs text-neutral-400">{s.level}</span>
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
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      {items.map((p, i) => (
        <a href={p.demo || p.repo || '#'} key={i} className="group rounded-xl border border-violet-400/20 bg-white/5 backdrop-blur-md p-5 block hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition">
          <div className="text-violet-300 font-semibold">{p.name}</div>
          <p className="text-neutral-300 mt-2">{p.description}</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            {p.tags?.map((t, j) => (
              <span key={j} className="text-xs px-2 py-1 rounded bg-violet-500/20 text-violet-200 ring-1 ring-violet-400/30">{t}</span>
            ))}
          </div>
        </a>
      ))}
    </div>
  )
}

function Timeline({ items }) {
  return (
    <ol className="relative border-l border-cyan-400/20 ml-2 mt-6">
      {items.map((e, i) => (
        <li key={i} className="mb-8 ml-4">
          <div className="absolute w-3 h-3 bg-cyan-400 rounded-full -left-1.5 mt-1.5" />
          <h3 className="text-cyan-300 font-semibold">{e.role || e.degree} • <span className="text-neutral-400">{e.company || e.school}</span></h3>
          <time className="text-xs text-neutral-400">{e.start} – {e.end}</time>
          {e.summary || e.details ? (
            <p className="text-neutral-300 mt-2">{e.summary || e.details}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

function Contact() {
  const [state, setState] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) })
      if (!res.ok) throw new Error('Fehler beim Senden')
      setSent(true)
    } catch (err) {
      setError(String(err))
    }
  }
  if (sent) return <p className="text-green-300">Danke! Deine Nachricht wurde gesendet.</p>
  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3 max-w-xl">
      <input aria-label="Name" placeholder="Name" className="px-3 py-2 rounded bg-neutral-900/60 border border-neutral-700 text-neutral-100" value={state.name} onChange={e=>setState(s=>({...s,name:e.target.value}))} required />
      <input type="email" aria-label="Email" placeholder="Email" className="px-3 py-2 rounded bg-neutral-900/60 border border-neutral-700 text-neutral-100" value={state.email} onChange={e=>setState(s=>({...s,email:e.target.value}))} required />
      <input aria-label="Betreff" placeholder="Betreff" className="px-3 py-2 rounded bg-neutral-900/60 border border-neutral-700 text-neutral-100" value={state.subject} onChange={e=>setState(s=>({...s,subject:e.target.value}))} />
      <textarea aria-label="Nachricht" placeholder="Nachricht" rows="4" className="px-3 py-2 rounded bg-neutral-900/60 border border-neutral-700 text-neutral-100" value={state.message} onChange={e=>setState(s=>({...s,message:e.target.value}))} required />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button className="mt-2 px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/40 hover:bg-cyan-500/30 transition">Senden</button>
    </form>
  )
}

function App() {
  const [seeded, setSeeded] = useState(false)
  useEffect(() => {
    const run = async () => {
      try { await fetch(`${API}/seed`, { method: 'POST' }) } catch {}
      setSeeded(true)
    }
    run()
  }, [])

  const { data: profile } = useFetch('/profile', [])
  const { data: skills } = useFetch('/skills', [])
  const { data: projects } = useFetch('/projects', [])
  const { data: exp } = useFetch('/experience', [])
  const { data: edu } = useFetch('/education', [])

  return (
    <div className="min-h-screen bg-black text-neutral-100">
      <Tunnel />
      <header className="sticky top-0 z-20 backdrop-blur-md bg-black/30 border-b border-white/5">
        <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6 text-sm text-neutral-300">
          <a href="#about" className="hover:text-cyan-300">Über mich</a>
          <a href="#skills" className="hover:text-cyan-300">Skills</a>
          <a href="#projects" className="hover:text-cyan-300">Projekte</a>
          <a href="#timeline" className="hover:text-cyan-300">Werdegang</a>
          <a href="#contact" className="hover:text-cyan-300">Kontakt</a>
        </nav>
      </header>

      <Hero />

      <Section id="about" title="Über mich">
        <p>
          {profile?.[0]?.bio || 'Elektronik & IT – ich baue robuste Systeme von der Platine bis zur Cloud.'}
        </p>
      </Section>

      <Section id="skills" title="Skills">
        <Skills items={skills} />
      </Section>

      <Section id="projects" title="Projekte">
        <Projects items={projects} />
      </Section>

      <Section id="timeline" title="Ausbildung & Erfahrung">
        <Timeline items={[...exp, ...edu]} />
      </Section>

      <Section id="contact" title="Kontakt">
        <Contact />
      </Section>

      <footer className="py-10 text-center text-neutral-500">© {new Date().getFullYear()} – Elektronik & IT Portfolio</footer>
    </div>
  )
}

export default App
