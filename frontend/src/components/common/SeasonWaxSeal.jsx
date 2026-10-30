import { seasonOf } from '../../theme/seasons'

export default function SeasonWaxSeal({ season = 'default', className = '' }) {
  const item = seasonOf(season)
  return (
    <div className={`relative flex h-14 w-14 items-center justify-center ${className}`}>
      <svg viewBox="0 0 60 60" className="absolute inset-0 h-full w-full drop-shadow-[2px_3px_0_var(--c-ink)]">
        <path
          d="M30 4 C39 3, 46 8, 50 15 C55 21, 57 28, 56 36 C54 44, 48 51, 40 54 C32 57, 24 56, 17 52 C10 47, 4 41, 4 32 C3 24, 8 16, 14 10 C20 4, 25 4, 30 4 Z"
          fill={item.sealColor}
          stroke="var(--c-ink)"
          strokeWidth="2"
        />
        <circle cx="30" cy="30" r="19" fill={item.sealInner} stroke="var(--c-ink)" strokeWidth="1.5" />
      </svg>
      <span className="relative z-10 text-xl">{item.sealEmoji}</span>
    </div>
  )
}
