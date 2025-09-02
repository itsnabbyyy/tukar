// src/pages/Landing.jsx
import React, { useEffect, useRef } from 'react'
import { useStore } from '../store'
import Starfield from '../components/Starfield'
import FeaturesSection from '../components/features/FeaturesSection'
import CurvedHeading from '../components/CurvedHeading.jsx'

// --- Local assets for hero flip-cards ---
import nabila2 from '../assets/nabila2.jpeg'
import nabby2  from '../assets/nabby2.png'
import nabila1 from '../assets/nabila1.jpeg'
import nabby1  from '../assets/nabby1.png'
import j1      from '../assets/j1.jpeg'
import jacob1  from '../assets/jacob1.png'
import male    from '../assets/male.jpg'
import male2   from '../assets/male2.png'
import oppa    from '../assets/oppa.jpg'
import oppa2   from '../assets/oppa2.png'
import gong    from '../assets/gong.jpg'
import gong2   from '../assets/gong2.png'

/* ---------------- Flip Card ---------------- */
function FlipCard({ front, back, className = '', delay = 0, duration = 10 }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
        animation: `floatXY ${duration}s ease-in-out ${delay}ms infinite`,
        willChange: 'transform',
      }}
    >
      <div
        className="
          relative rounded-2xl border border-black/10 bg-white
          shadow-[0_18px_50px_rgba(0,0,0,.18)]
          h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56
          transition-transform duration-700
          [transform-style:preserve-3d] [transform:rotateY(0deg)]
          hover:[transform:rotateY(180deg)]
        "
      >
        <img
          src={front}
          alt="Before virtual try-on"
          className="absolute inset-0 h-full w-full rounded-2xl object-cover [backface-visibility:hidden]"
        />
        <img
          src={back}
          alt="After virtual try-on"
          className="absolute inset-0 h-full w-full rounded-2xl object-cover [transform:rotateY(180deg)] [backface-visibility:hidden]"
        />
      </div>
    </div>
  )
}

/* --------------- Mission Story (scroll reveal) --------------- */
function MissionStory() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && el.classList.add('is-visible')),
      { threshold: 0.25 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const lines = [
    'We make the joy of trying-on available in online shopping.',
    'With MatchIN, you see outfits on you before they ever hit the cart.',
    'Because great style shouldn’t be a gamble, it should feel like finding the perfect mirror.',
  ]

  return (
    <section id="mission" className="relative mx-auto max-w-6xl px-6 py-24 md:py-32" ref={ref}>
      {/* soft spotlight behind text */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[70%] -translate-y-1/2 rounded-[48px] opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(244,243,241,0.6) 55%, rgba(244,243,241,0) 100%)',
        }}
      />
      <div className="text-center font-medium leading-tight tracking-tight" style={{ color: '#1f1f1f' }}>
        {lines.map((t, i) => (
          <span
            key={i}
            className="line block translate-y-7 opacity-0 will-change-transform"
            style={{
              fontSize: 'clamp(20px, 3.2vw, 44px)',
              marginBottom: '0.6em',
              animationDelay: `${i * 220}ms`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <style>{`
        .is-visible .line { animation: riseIn 1.05s cubic-bezier(.21,.8,.35,1) forwards; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(24px); filter: blur(5px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);  }
        }
      `}</style>
    </section>
  )
}

/* ------------------- Page ------------------- */
export default function Landing() {
  const openAuth = useStore((s) => s.openAuth)

  const pairs = [
    { front: nabila2, back: nabby2 },
    { front: nabila1, back: nabby1 },
    { front: j1,      back: jacob1 },
    { front: oppa,    back: oppa2 },
    { front: gong,    back: gong2 },
    { front: male,    back: male2 },
  ]

  // 3 left / 3 right – slightly spread out
  const slots = [
    'left-[0%]  top-[10%]  -rotate-[7deg]  hidden md:block',
    'left-[4%]  top-[48%]   rotate-[4deg]  hidden md:block',
    'left-[19%] top-[82%]  -rotate-[3deg]  hidden md:block',
    'right-[0%]  top-[10%]  rotate-[7deg]  hidden md:block',
    'right-[4%]  top-[49%] -rotate-[4deg]  hidden md:block',
    'right-[19%] top-[83%]  rotate-[3deg]  hidden md:block',
  ]

  // start offsets for the explode-in animation (relative to center)
  const explodeVectors = [
    { x: '18vw',  y: '12vh' },
    { x: '16vw',  y: '0vh'  },
    { x: '18vw',  y: '-12vh'},
    { x: '-18vw', y: '12vh' },
    { x: '-16vw', y: '0vh'  },
    { x: '-18vw', y: '-12vh'},
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f4f3f1', color: '#1f1f1f' }}>
      <Starfield withBlobs={false} />

      {/* HERO */}
      <section className="relative mx-auto flex min-h-[92svh] max-w-7xl items-center justify-center px-6">
        {/* floating flip cards with explode-in reveal */}
        {pairs.map((p, i) => {
          const v = explodeVectors[i] || { x: '0', y: '0' }
          // Pair left/right to explode simultaneously:
          // indices 0 & 3 together, 1 & 4 together, 2 & 5 together
          const pairStep = i % 3
          const explodeDelay = pairStep * 440 // ms
          const floatDelay   = pairStep * 280 // keep subtle desync, but left/right matched

          return (
            <div key={i} className={`absolute ${slots[i]} z-[1]`}>
              <div
                className="explode-card"
                style={{
                  '--from-x': v.x,
                  '--from-y': v.y,
                  '--delay': `${explodeDelay}ms`,
                }}
              >
                <FlipCard
                  front={p.front}
                  back={p.back}
                  delay={floatDelay}
                  duration={9 + (pairStep % 3) * 1.3}
                />
              </div>
            </div>
          )
        })}

        {/* centered title + copy */}
        <div className="relative z-[2] text-center">
          <CurvedHeading className="mb-2" curve={90} font={250} />
          <p className="mx-auto mt-10 max-w-xl text-base md:text-lg" style={{ color: '#8a8988' }}>
            Discover your perfect style with nano banana. Curated looks, personalized recommendations, effortlessly. 
          </p>
          <button
            onClick={() => openAuth('signup')}
            className="mt-7 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold shadow-[0_12px_34px_rgba(251,114,50,.35)] transition hover:opacity-95"
            style={{ background: '#fb7232', color: '#ffe1d4' }}
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Mission */}
      <MissionStory />

      {/* Features */}
      <FeaturesSection />

      {/* local animations */}
      <style>{`
        @keyframes floatXY {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(-8px, -26px) rotate(1.8deg); }
          50%  { transform: translate(0, -14px) rotate(0.6deg); }
          75%  { transform: translate(8px, -26px) rotate(-1.6deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
