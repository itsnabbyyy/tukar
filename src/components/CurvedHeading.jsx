// src/components/CurvedHeading.jsx
import React, { useId } from 'react'

/**
 * Curved "matchIN" + stacked "Your / Style"
 * - curve: arc depth (px)
 * - font:  base font size
 * - matchLift: negative = lift "matchIN" upward
 * - lineGap: extra vertical space between "Your" and "Style"
 */
export default function CurvedHeading({
  className = '',
  curve = 90,
  font = 250,
  matchLift = -48,   // raised a bit more
  lineGap = 72,      // more space between words
}) {
  const uid = useId().replace(/:/g, '')
  const gradId = `miShimmer-${uid}`
  const arcId  = `miArc-${uid}`
  const glowId = `miGlow-${uid}`
  const haloId = `miHalo-${uid}`

  // Arc geometry
  const leftX = 80
  const rightX = 1120
  const baselineY = 240
  const controlY  = baselineY - curve

  // Line positions
  const yourY  = baselineY + 110
  const styleY = yourY + 120 + lineGap

  return (
    <div className={className}>
      <svg
        viewBox="0 0 1200 560"
        className="mx-auto h-[clamp(150px,28vw,360px)] w-auto"
        style={{ overflow: 'visible' }}
        aria-label="matchIN Your Style"
      >
        <defs>
          {/* animated gradient for "matchIN" */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#fb7232" />
            <stop offset="50%"  stopColor="#ff9a62" />
            <stop offset="100%" stopColor="#ffd3b8" />
          </linearGradient>

          {/* soft glow for the curved word */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="B" />
            <feMerge>
              <feMergeNode in="B" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* bright white halo for "Your/Style" (outline + glow) */}
          <filter id={haloId} x="-50%" y="-50%" width="200%" height="200%">
            
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="1"/>
           
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ffffff" floodOpacity=".75"/>
          </filter>

          {/* arc path for the top word */}
          <path
            id={arcId}
            d={`M ${leftX},${baselineY} C 400,${controlY} 800,${controlY} ${rightX},${baselineY}`}
            fill="none"
          />
        </defs>

        {/* curved "matchIN" (lifted) */}
        <g transform={`translate(0, ${matchLift})`}>
          <text fontWeight="900" fontSize={font} letterSpacing="1" filter={`url(#${glowId})`}>
            <textPath
              href={`#${arcId}`}
              startOffset="50%"
              textAnchor="middle"
              fill={`url(#${gradId})`}
            >
              MatchIN
            </textPath>
          </text>
        </g>

        {/* stacked words with visible white halo/outline */}
        <g filter={`url(#${haloId})`}>

          {/* Outline pass (white stroke behind fill) */}
          <text
            x="600"
            y={yourY}
            textAnchor="middle"
            fontWeight="900"
            fontSize={font}
            fill="#1f1f1f"
            stroke="#ffffff"
            strokeWidth="16"
            paintOrder="stroke"   // draw stroke behind fill
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            Your
          </text>

          <text
            x="600"
            y={styleY}
            textAnchor="middle"
            fontWeight="900"
            fontSize={font}
            fill="#1f1f1f"
            stroke="#ffffff"
            strokeWidth="16"
            paintOrder="stroke"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            Style
          </text>
        </g>

        {/* shimmer animation for the gradient */}
        <style>{`
          @keyframes shimmerPath {
            0%   { stop-color: #fb7232; }
            50%  { stop-color: #ff9a62; }
            100% { stop-color: #fb7232; }
          }
          #${gradId} stop:nth-child(1) { animation: shimmerPath 1.2s ease-in-out 5s infinite }
          #${gradId} stop:nth-child(2) { animation: shimmerPath 1.2s ease-in-out .2s infinite }
          #${gradId} stop:nth-child(3) { animation: shimmerPath 2.2s ease-in-out .4s infinite }
        `}</style>
      </svg>
    </div>
  )
}
