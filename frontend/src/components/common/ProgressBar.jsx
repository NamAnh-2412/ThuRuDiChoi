export default function ProgressBar({ steps, current }) {
  return (
    <ol className="mb-5 flex items-start">
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step.code} className="flex min-w-0 flex-1 items-start">
            <div className="flex w-14 shrink-0 flex-col items-center gap-1">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--c-ink)] text-sm font-extrabold ${
                  done ? 'bg-[var(--c-accent)]' : active ? 'animate-pulse bg-white' : 'bg-[#eef2f8] text-[#64748B]'
                }`}
              >
                {done ? '♥' : index + 1}
              </span>
              <span className={`text-center text-[0.7rem] font-extrabold leading-tight ${active ? '' : 'text-[#64748B]'}`}>
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className={`mt-4 h-0 flex-1 border-t-2 border-dashed ${done ? 'border-[var(--c-accent-pink)]' : 'border-[var(--c-ink)]/25'}`} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
