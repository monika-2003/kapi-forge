const LAYERS = 6
const LAYER_GAP = 38
const THICKNESS = 14

/** Abstract stack of printed layers. Decorative only: no meaning, no data. */
export function HeroArt() {
  return (
    <svg viewBox="0 0 400 420" className="h-auto w-full" aria-hidden focusable="false">
      {Array.from({ length: LAYERS }, (_, i) => {
        // Draw bottom layer first so upper layers overlap it.
        const level = LAYERS - 1 - i
        const y = 40 + level * LAYER_GAP
        const isTop = level === 0
        return (
          <g key={level} className="animate-rise" style={{ animationDelay: `${300 + i * 110}ms` }}>
            <polygon
              points={`40,${y + 80} 200,${y + 160} 200,${y + 160 + THICKNESS} 40,${y + 80 + THICKNESS}`}
              className="fill-ink/25"
            />
            <polygon
              points={`360,${y + 80} 200,${y + 160} 200,${y + 160 + THICKNESS} 360,${y + 80 + THICKNESS}`}
              className="fill-ink/45"
            />
            <polygon
              points={`200,${y} 360,${y + 80} 200,${y + 160} 40,${y + 80}`}
              className={isTop ? 'fill-brand' : 'fill-card stroke-ink/15'}
              strokeWidth="1"
            />
          </g>
        )
      })}
    </svg>
  )
}
