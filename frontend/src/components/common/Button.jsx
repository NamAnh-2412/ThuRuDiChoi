const tones = {
  pink: 'bg-[var(--c-accent)]',
  white: 'bg-white',
  mint: 'bg-[#B7E4C7]',
  sky: 'bg-[#8EC5FC]',
  peach: 'bg-[#FFD1BA]',
}

export default function Button({ children, tone = 'pink', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-[var(--c-ink)] px-5 py-3 font-display text-base font-extrabold text-[var(--c-ink)] shadow-[4px_4px_0_var(--c-ink)] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--c-ink)] disabled:cursor-not-allowed disabled:opacity-45 ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
