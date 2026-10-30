import { motion } from 'framer-motion'
import Button from '../common/Button'
import Card from '../common/Card'

export default function QuestionLetter({ receiver, refuseCount, onAgree, onRefuse }) {
  const agreeScale = Math.min(1.45, 1 + refuseCount * 0.1)
  const refuseScale = Math.max(0.72, 1 - refuseCount * 0.08)
  const dodge = refuseCount >= 3

  return (
    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
      <Card className="relative bg-[var(--c-paper)] px-5 py-7">
        <span className="absolute -left-2 -top-3 rotate-[-18deg] rounded-sm border-2 border-[var(--c-ink)] bg-[var(--c-tape)] px-2 py-3" />
        <p className="font-display text-2xl font-extrabold">Hello {receiver || 'bạn'}!</p>
        <p className="mt-3 text-[0.95rem] leading-relaxed">
          Cuối tuần này
          <br />
          bạn có rảnh hông?
        </p>
        <p className="mt-4 font-display text-xl font-extrabold leading-tight">
          Bạn có muốn
          <br />
          đi chơi với mình?
        </p>
      </Card>
      <div className="mt-6 flex items-end justify-center gap-3">
        <motion.div animate={{ scale: agreeScale }} className="origin-bottom">
          <Button onClick={onAgree}>ĐỒNG Ý LIỀN</Button>
        </motion.div>
        <motion.div
          animate={{
            scale: refuseScale,
            x: dodge ? ((refuseCount * 23) % 70) - 20 : 0,
            y: dodge ? (refuseCount % 2 === 0 ? -18 : 12) : 0,
          }}
          className="origin-bottom"
        >
          <Button tone="white" onClick={onRefuse}>
            Hổng đi
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
