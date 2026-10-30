import { seasonOf } from '../../theme/seasons'

export default function SeasonStamp({ season = 'default', className = '' }) {
  const item = seasonOf(season)
  return (
    <div className={`flex flex-col items-center rounded-sm border-2 border-dashed border-[var(--c-ink)] bg-white px-2 py-1 shadow-sm rotate-3 ${className}`}>
      <span className="text-[0.62rem] font-extrabold tracking-widest" style={{ color: item.stampInk }}>
        {item.stampText}
      </span>
      <div className="my-0.5 text-lg leading-none">{item.stampIcon}</div>
      <span className="text-[0.55rem] font-bold text-[var(--c-ink)]">{item.stampPrice}</span>
    </div>
  )
}
