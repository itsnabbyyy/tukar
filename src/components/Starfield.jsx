// src/components/Starfield.jsx
import { useEffect, useRef } from 'react'

export default function Starfield({ theme = 'light', withBlobs = false }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    let stars = []
    let raf = 0
    let t = 0

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.max(180, Math.min(420, Math.floor(w * h * 0.00045)))
      stars = Array.from({ length: count }).map(() => {
        const big = Math.random() < 0.15
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: big ? 1.8 : 1,
          p: Math.random() * Math.PI * 2,
          s: 0.6 + Math.random() * 1.3,
          dx: (Math.random() - 0.5) * 0.08,
          dy: (Math.random() - 0.5) * 0.08,
        }
      })
    }

    function draw() {
      t += 0.016
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      // very faint vignette (light theme → soft grey; dark theme → navy)
      const col = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(2,6,23,0.28)'
      const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)*0.7)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, col)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      for (const st of stars) {
        st.x += st.dx; st.y += st.dy
        if (st.x < -5) st.x = w + 5
        if (st.x > w + 5) st.x = -5
        if (st.y < -5) st.y = h + 5
        if (st.y > h + 5) st.y = -5

        const a = 0.4 + (Math.sin(st.p + t * st.s * 2) + 1) * 0.3
        const huePick = Math.sin(st.p * 2 + t) * 0.5 + 0.5
        const color =
          theme === 'light'
            ? (huePick < 0.5 ? `rgba(0,0,0,${a * 0.35})` : `rgba(0,0,0,${a * 0.2})`)
            : (huePick < 0.33 ? `rgba(232,121,249,${a})` : huePick < 0.66 ? `rgba(129,140,248,${a})` : `rgba(255,255,255,${a})`)

        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [theme])

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={canvasRef} className="h-full w-full" />
      {withBlobs && theme === 'light' && (
        <>
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-black/5 blur-3xl" />
        </>
      )}
    </div>
  )
}
