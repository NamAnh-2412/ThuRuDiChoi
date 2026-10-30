import { motion } from 'framer-motion'
import Button from '../common/Button'
import ProgressBar from '../common/ProgressBar'

function splitLabel(label) {
  const chars = Array.from(label || '')
  if (chars.length > 1 && /\p{Extended_Pictographic}/u.test(chars[0])) {
    let index = 1
    let icon = chars[0]
    while (index < chars.length && chars[index] === '\uFE0F') {
      icon += chars[index]
      index += 1
    }
    return { icon, text: chars.slice(index).join('').trim() || label }
  }
  return { icon: '✨', text: label }
}

export default function ChoiceGrid({
  steps,
  stepIndex,
  step,
  selectedId,
  onSelect,
  onNext,
  onBack,
}) {
  const last = stepIndex === steps.length - 1
  const chips = step.code === 'time'

  return (
    <motion.div key={step.code} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>
      <ProgressBar steps={steps} current={stepIndex} />
      <h2 className="text-center font-display text-[1.35rem] font-extrabold leading-tight">{step.question}</h2>
      <p className="mb-4 mt-1 text-center text-sm text-[#64748B]">Chọn một cái nha</p>
      <div className={chips ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-3'}>
        {step.choices.map((choice) => {
          const selected = choice.id === selectedId
          const { icon, text } = splitLabel(choice.label)
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => onSelect(choice)}
              className={`rounded-3xl border-2 p-3 text-left shadow-[4px_4px_0_var(--c-ink)] transition active:scale-95 ${
                selected ? 'border-[var(--c-accent-pink)] bg-[var(--c-paper)]' : 'border-[var(--c-ink)] bg-[var(--c-surface)]'
              } ${chips ? 'flex items-center gap-3' : ''}`}
            >
              <span className={`grid place-items-center rounded-2xl bg-[var(--c-paper)] text-3xl ${chips ? 'h-14 w-14 shrink-0' : 'mb-2 aspect-square w-full'}`}>
                {choice.imageUrl ? (
                  <img src={choice.imageUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  icon
                )}
              </span>
              <span className="block flex-1 text-sm font-extrabold leading-snug">{text}</span>
              {selected && <span className="mt-1 block text-xs font-bold text-[#e56b8d]">Đã chọn</span>}
            </button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center gap-3">
        {stepIndex > 0 && (
          <Button tone="white" onClick={onBack}>
            Quay lại
          </Button>
        )}
        <Button className="flex-1" disabled={!selectedId} onClick={onNext}>
          {last ? 'Chốt kèo đi thôi!' : 'Tiếp tục nè'}
        </Button>
      </div>
    </motion.div>
  )
}
