import { motion } from 'framer-motion'
import Button from '../common/Button'

const faces = {
  cat: { ears: true, mood: 'please' },
  bear: { ears: 'round', mood: 'cry' },
  dog: { ears: 'floppy', mood: 'hug' },
  meme: { ears: false, mood: 'mad' },
}

export default function StickerReaction({ sticker, onClose }) {
  const face = faces[sticker.kind] || faces.cat
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#2B3A67]/35 px-4">
      <motion.div
        initial={{ scale: 0.6, rotate: -8, y: 30 }}
        animate={{ scale: 1, rotate: 2, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 16 }}
        className="pop-card rounded-3xl border-2 border-[#2B3A67] bg-white p-5 text-center shadow-[6px_6px_0_#2B3A67]"
      >
        <Creature face={face} />
        <p className="mt-3 font-display text-xl font-extrabold">{sticker.title}</p>
        <p className="mt-1 text-sm">{sticker.line}</p>
        <Button onClick={onClose} tone="peach" className="mt-4 w-full">
          Thôi để mình nghĩ lại
        </Button>
      </motion.div>
    </div>
  )
}

function Creature({ face }) {
  return (
    <svg viewBox="0 0 120 110" className="mx-auto h-28 w-28" aria-hidden="true">
      {face.ears === true && (
        <>
          <polygon points="28,48 18,16 46,36" fill="#FFB6C9" stroke="#2B3A67" strokeWidth="3" />
          <polygon points="92,48 102,16 74,36" fill="#FFB6C9" stroke="#2B3A67" strokeWidth="3" />
        </>
      )}
      {face.ears === 'round' && (
        <>
          <circle cx="30" cy="34" r="16" fill="#FFD1BA" stroke="#2B3A67" strokeWidth="3" />
          <circle cx="90" cy="34" r="16" fill="#FFD1BA" stroke="#2B3A67" strokeWidth="3" />
        </>
      )}
      {face.ears === 'floppy' && (
        <>
          <ellipse cx="22" cy="58" rx="14" ry="22" fill="#B7E4C7" stroke="#2B3A67" strokeWidth="3" />
          <ellipse cx="98" cy="58" rx="14" ry="22" fill="#B7E4C7" stroke="#2B3A67" strokeWidth="3" />
        </>
      )}
      <circle cx="60" cy="62" r="36" fill="#FFF9F0" stroke="#2B3A67" strokeWidth="3" />
      <circle cx="46" cy="58" r="4" fill="#2B3A67" />
      <circle cx="74" cy="58" r="4" fill="#2B3A67" />
      {face.mood === 'cry' && (
        <>
          <path d="M40 70 Q46 78 52 70" fill="none" stroke="#8EC5FC" strokeWidth="3" />
          <path d="M68 70 Q74 78 80 70" fill="none" stroke="#8EC5FC" strokeWidth="3" />
          <path d="M48 78 Q60 70 72 78" fill="none" stroke="#2B3A67" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {face.mood === 'please' && (
        <path d="M46 76 Q60 88 74 76" fill="none" stroke="#2B3A67" strokeWidth="3" strokeLinecap="round" />
      )}
      {face.mood === 'hug' && (
        <path d="M44 74 Q60 90 76 74" fill="none" stroke="#e56b8d" strokeWidth="3" strokeLinecap="round" />
      )}
      {face.mood === 'mad' && (
        <>
          <path d="M38 48 L52 54" stroke="#2B3A67" strokeWidth="3" strokeLinecap="round" />
          <path d="M82 48 L68 54" stroke="#2B3A67" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 80 Q60 72 72 80" fill="none" stroke="#2B3A67" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}
