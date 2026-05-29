import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from 'framer-motion'

/* ══════════════════════════════════════════════════════════════════
   CINEMATIC INTRO — dark, scroll-driven, premium motion experience
   Login → This page → "Get Started" → Search Stores
   ══════════════════════════════════════════════════════════════════ */

/* ── Load premium serif font ── */
if (typeof document !== 'undefined' && !document.getElementById('intro-serif')) {
  const lk = document.createElement('link')
  lk.id = 'intro-serif'
  lk.rel = 'stylesheet'
  lk.href =
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap'
  document.head.appendChild(lk)
}

const serif = { fontFamily: "'Playfair Display', serif" }
const ease = [0.16, 1, 0.3, 1]

/* ═══════════════════════ ANIMATION PRIMITIVES ═══════════════════════ */

/** Character-by-character cinematic reveal */
function CharReveal({ text, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          style={serif}
          initial={{ y: '120%', opacity: 0 }}
          animate={inView ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration: 1, ease, delay: delay + i * 0.035 }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </span>
  )
}

/** Smooth fade-up block */
function FadeUp({ children, className = '', delay = 0, y = 50 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

/** Horizontal line reveal */
function LineReveal({ delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })
  return (
    <motion.div
      ref={ref}
      className="h-px bg-white/10 w-full"
      style={{ transformOrigin: 'left' }}
      initial={{ scaleX: 0 }}
      animate={inView ? { scaleX: 1 } : {}}
      transition={{ duration: 1.5, ease, delay }}
    />
  )
}

/** Magnetic hover CTA button */
function MagneticButton({ children, onClick }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 14 })
  const sy = useSpring(my, { stiffness: 120, damping: 14 })

  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * 0.35)
    my.set((e.clientY - r.top - r.height / 2) * 0.35)
  }
  const leave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      className="
        relative group w-52 h-52 md:w-64 md:h-64 rounded-full cursor-pointer
        bg-gradient-to-br from-cyan-500 to-cyan-600
        text-black font-black text-base md:text-lg tracking-[0.15em] uppercase
        flex items-center justify-center
        shadow-[0_0_60px_rgba(6,182,212,0.12)]
        hover:shadow-[0_0_120px_rgba(6,182,212,0.35)]
        transition-shadow duration-700
      "
    >
      {/* Glow rings */}
      <span className="absolute inset-[-5px] rounded-full border border-cyan-400/15 group-hover:border-cyan-400/50 transition-all duration-700" />
      <span className="absolute inset-[-12px] rounded-full border border-cyan-400/5 group-hover:border-cyan-400/20 transition-all duration-700" />
      <span className="absolute inset-[-22px] rounded-full border border-cyan-400/0 group-hover:border-cyan-400/10 transition-all duration-1000" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '2s' }} />
      {children}
    </motion.button>
  )
}

/** Ambient floating orb */
function Orb({ size, color, x, y, dur = 9, d = 0 }) {
  return (
    <motion.div
      className="fixed rounded-full pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        background: color,
        left: x,
        top: y,
        filter: 'blur(110px)',
      }}
      animate={{
        y: [0, -30, 0, 25, 0],
        x: [0, 18, 0, -14, 0],
        scale: [1, 1.08, 1, 0.94, 1],
      }}
      transition={{ duration: dur, ease: 'easeInOut', repeat: Infinity, delay: d }}
    />
  )
}

/** Noise texture overlay */
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  )
}

/* ═══════════════════════ SECTION COMPONENTS ═══════════════════════ */

/** Section 1 — Hero: multiverse */
function HeroSection({ heroY, heroOp }) {
  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10 overflow-hidden"
      style={{ y: heroY, opacity: heroOp }}
    >
      {/* Radial spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(ellipse,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none" />

      <FadeUp delay={0.5}>
        <p className="text-[10px] tracking-[0.6em] uppercase text-white/20 font-medium mb-10 text-center">
          Welcome to the
        </p>
      </FadeUp>

      <div className="overflow-hidden">
        <h1 className="text-[16vw] md:text-[12vw] lg:text-[9vw] font-black italic leading-[0.85] tracking-[-0.03em] text-center">
          <CharReveal text="multiverse" delay={0.8} />
        </h1>
      </div>

      <FadeUp delay={2} className="mt-10">
        <p className="text-white/20 text-xs md:text-sm tracking-[0.3em] uppercase font-light text-center max-w-md">
          Your universe of local commerce
        </p>
      </FadeUp>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-14 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-[8px] tracking-[0.5em] uppercase text-white/15">
            Scroll
          </p>
          <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

/** Section 2 — deliverse */
function DeliverSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10">
      <div className="max-w-7xl mx-auto w-full">
        <LineReveal delay={0.1} />

        <div className="py-24 md:py-32">
          <FadeUp delay={0.1}>
            <p className="text-[10px] tracking-[0.5em] uppercase text-cyan-500/40 font-medium mb-8">
              01 — Discover
            </p>
          </FadeUp>

          <div className="overflow-hidden">
            <h2 className="text-[15vw] md:text-[11vw] lg:text-[8vw] font-black leading-[0.85] tracking-[-0.04em]">
              <CharReveal text="deliverse" delay={0.15} />
            </h2>
          </div>

          <FadeUp delay={0.7} className="mt-10 max-w-lg">
            <p className="text-white/20 text-sm md:text-base leading-[1.9] font-light">
              Premium products curated from local artisans and trusted
              neighborhood vendors, delivered with care to your doorstep.
            </p>
          </FadeUp>
        </div>

        <LineReveal delay={0.3} />
      </div>
    </section>
  )
}

/** Section 3 — distributor verse (left-aligned, stats) */
function DistributorSection1() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10">
      <div className="max-w-7xl mx-auto w-full">
        <FadeUp delay={0.1}>
          <p className="text-[10px] tracking-[0.5em] uppercase text-purple-400/40 font-medium mb-8">
            02 — Connect
          </p>
        </FadeUp>

        <div className="overflow-hidden">
          <h2 className="text-[12vw] md:text-[9vw] lg:text-[7vw] font-black italic leading-[0.88] tracking-[-0.03em]">
            <CharReveal text="distributor" delay={0.15} />
          </h2>
        </div>
        <div className="overflow-hidden ml-[5vw]">
          <h2 className="text-[12vw] md:text-[9vw] lg:text-[7vw] font-black leading-[0.88] tracking-[-0.03em]">
            <CharReveal text="verse" delay={0.55} />
          </h2>
        </div>

        <FadeUp delay={0.95} className="mt-12 max-w-lg">
          <p className="text-white/20 text-sm md:text-base leading-[1.9] font-light">
            Bridging the gap between passionate makers and curious seekers.
            Every purchase supports a local business and tells a story.
          </p>
        </FadeUp>

        <FadeUp delay={1.15} className="mt-12">
          <div className="flex items-center gap-10 flex-wrap">
            {[
              { val: '500+', label: 'Local Vendors', grad: 'from-cyan-400 to-cyan-200' },
              { val: '10k+', label: 'Products', grad: 'from-purple-400 to-purple-200' },
              { val: '24h', label: 'Delivery', grad: 'from-pink-400 to-pink-200' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-10">
                <div>
                  <p
                    className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${s.grad} bg-clip-text text-transparent`}
                    style={serif}
                  >
                    {s.val}
                  </p>
                  <p className="text-[9px] tracking-[0.4em] uppercase text-white/15 mt-2">
                    {s.label}
                  </p>
                </div>
                {i < 2 && <div className="w-px h-14 bg-white/6" />}
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/** Section 4 — distributor verse (centered, outlined variant) */
function DistributorSection2() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center z-10 overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none" />

      <FadeUp delay={0.1}>
        <p className="text-[10px] tracking-[0.5em] uppercase text-pink-400/40 font-medium mb-8">
          03 — Experience
        </p>
      </FadeUp>

      {/* Filled text */}
      <div className="overflow-hidden">
        <h2 className="text-[13vw] md:text-[10vw] lg:text-[7.5vw] font-black leading-[0.85] tracking-[-0.04em]">
          <CharReveal text="distributor" delay={0.15} />
        </h2>
      </div>

      {/* Outlined text */}
      <motion.h2
        className="text-[13vw] md:text-[10vw] lg:text-[7.5vw] font-black italic leading-[0.85] tracking-[-0.04em]"
        style={{
          ...serif,
          WebkitTextStroke: '1.5px rgba(255,255,255,0.15)',
          color: 'transparent',
        }}
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease, delay: 0.5 }}
      >
        verse
      </motion.h2>

      <FadeUp delay={0.9} className="mt-10 max-w-md">
        <p className="text-white/20 text-sm md:text-base leading-[1.9] font-light">
          A seamless shopping experience that brings the charm of
          neighborhood stores into the digital age.
        </p>
      </FadeUp>

      {/* Floating horizontal rule with glow */}
      <FadeUp delay={1.2} className="mt-14 w-full max-w-xs">
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </FadeUp>
    </section>
  )
}

/** Section 5 — CTA: Get Started */
function CTASection({ onStart }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 z-10">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vh] bg-[radial-gradient(ellipse,rgba(6,182,212,0.04)_0%,transparent_60%)] pointer-events-none" />

      <FadeUp delay={0.2}>
        <p className="text-[10px] tracking-[0.5em] uppercase text-white/15 font-medium mb-16 text-center">
          Ready to explore?
        </p>
      </FadeUp>

      <FadeUp delay={0.45}>
        <MagneticButton onClick={onStart}>
          <span className="relative z-10 flex flex-col items-center">
            <span className="text-sm md:text-base tracking-[0.2em]">
              Get Started
            </span>
            <span className="text-[8px] tracking-[0.35em] mt-1.5 opacity-50 font-medium normal-case">
              Enter marketplace
            </span>
          </span>
        </MagneticButton>
      </FadeUp>

      <FadeUp delay={0.9} className="mt-24">
        <p className="text-[9px] tracking-[0.4em] uppercase text-white/8">
          CustomerVerse · {new Date().getFullYear()}
        </p>
      </FadeUp>
    </section>
  )
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function IntroPage() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()

  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -140])
  const heroOp = useTransform(scrollYProgress, [0, 0.14], [1, 0])

  const [ready, setReady] = useState(false)
  useEffect(() => {
    // Wait for font + initial paint
    const t = setTimeout(() => setReady(true), 500)
    document.fonts?.ready?.then(() => setReady(true))
    return () => clearTimeout(t)
  }, [])

  const handleGetStarted = () => {
    navigate('/search-stores', { replace: true })
  }

  if (!ready) {
    return (
      <div className="w-full min-h-screen bg-[#060608] flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#060608] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Noise texture */}
      <NoiseOverlay />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-50 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"
        style={{ width: progressW }}
      />

      {/* Ambient orbs */}
      <Orb size="550px" color="rgba(6,182,212,0.04)" x="-8%" y="2%" dur={10} d={0} />
      <Orb size="420px" color="rgba(139,92,246,0.035)" x="72%" y="22%" dur={12} d={2} />
      <Orb size="480px" color="rgba(236,72,153,0.025)" x="-4%" y="50%" dur={11} d={3.5} />
      <Orb size="380px" color="rgba(6,182,212,0.03)" x="68%" y="72%" dur={9} d={1} />

      {/* Skip link */}
      <motion.button
        onClick={handleGetStarted}
        className="fixed top-7 right-8 z-50 text-[9px] tracking-[0.35em] uppercase text-white/15 hover:text-white/50 transition-colors duration-500 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 1 }}
      >
        Skip →
      </motion.button>

      {/* ── Sections ── */}
      <HeroSection heroY={heroY} heroOp={heroOp} />
      <DeliverSection />
      <DistributorSection1 />
      <DistributorSection2 />
      <CTASection onStart={handleGetStarted} />
    </div>
  )
}
