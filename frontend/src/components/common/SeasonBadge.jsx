import { seasonOf } from '../../theme/seasons'

export default function SeasonBadge({ season }) {
  const item = seasonOf(season)
  if (item.key === 'default') return null
  return (
    <div className="mb-4 flex items-center gap-3 rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-surface)] px-4 py-3 shadow-[4px_4px_0_var(--c-ink)]">
      <span className="text-3xl">{item.mascot}</span>
      <div>
        <p className="font-display text-lg font-extrabold">{item.mascotName}</p>
        <p className="text-sm font-bold">{item.accentText}</p>
      </div>
    </div>
  )
}
