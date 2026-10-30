export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-surface)] shadow-[4px_4px_0_var(--c-ink)] ${className}`}>
      {children}
    </div>
  )
}
