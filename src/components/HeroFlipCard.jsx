// src/components/HeroFlipCard.jsx
import { useId } from 'react'

export default function HeroFlipCard({ before, after, size = 180, className = '' }) {
  const id = useId()
  const wh = { width: size, height: size }

  return (
    <div
      className={`group relative [perspective:1000px] ${className}`}
      style={wh}
      aria-labelledby={id}
    >
      <div className="absolute inset-0 rounded-2xl bg-white/80 shadow-soft" />
      <div className="absolute inset-[6px] overflow-hidden rounded-xl">
        <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* front */}
          <img
            src={before}
            alt=""
            className="absolute inset-0 h-full w-full rounded-xl object-cover [backface-visibility:hidden]"
          />
          {/* back (try-on) */}
          <img
            src={after}
            alt=""
            className="absolute inset-0 h-full w-full rounded-xl object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
          />
        </div>
      </div>
    </div>
  )
}
