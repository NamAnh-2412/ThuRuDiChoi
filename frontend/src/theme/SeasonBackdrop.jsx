import { useReducedMotion } from 'framer-motion'
import { seasonOf } from './seasons'

const PIECES = [6, 18, 31, 44, 57, 69, 80, 92]

export default function SeasonBackdrop({ season }) {
  const reduce = useReducedMotion()
  const item = seasonOf(season)
  if (!item.particle || reduce) return null
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PIECES.map((left, index) => (
        <span
          key={`${item.key}-${left}`}
          className="season-particle"
          style={{
            left: `${left}%`,
            animationDuration: `${9 + (index % 4) * 2}s`,
            animationDelay: `${index * -1.3}s`,
            fontSize: index % 2 === 0 ? '1.35rem' : '1.05rem',
          }}
        >
          {item.particle}
        </span>
      ))}
    </div>
  )
}
