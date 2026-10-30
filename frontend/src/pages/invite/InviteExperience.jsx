import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toPng } from 'html-to-image'
import { api, errorMessage } from '../../api/client'
import { burstHearts } from '../../components/common/HeartConfetti'
import ChoiceGrid from '../../components/invite/ChoiceGrid'
import DateTicket from '../../components/invite/DateTicket'
import Envelope from '../../components/invite/Envelope'
import QuestionLetter from '../../components/invite/QuestionLetter'
import StickerReaction from '../../components/invite/StickerReaction'
import FourSeasonTicket from '../../components/special/FourSeasonTicket'
import { SeasonProvider } from '../../theme/SeasonProvider'
import { stickerForCount } from './stickers'

export default function InviteExperience() {
  const { code } = useParams()
  const navigate = useNavigate()
  const ticketRef = useRef(null)
  const [invite, setInvite] = useState(null)
  const [phase, setPhase] = useState('loading')
  const [opening, setOpening] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [picks, setPicks] = useState({})
  const [refuseCount, setRefuseCount] = useState(0)
  const [sticker, setSticker] = useState(null)
  const [note, setNote] = useState('')
  const [errorText, setErrorText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let ignore = false
    api
      .get(`/invite/${code}`)
      .then(({ data }) => {
        if (ignore) return
        if (!data.submitted && data.hasPin && sessionStorage.getItem(`gate:${code}`) !== 'open') {
          navigate(`/invite/${code}/pin`, { replace: true })
          return
        }
        setInvite(data)
        setRefuseCount(data.refuseCount || 0)
        setNote(data.note || '')
        setSent(data.submitted)
        setPhase(data.submitted ? 'done' : 'envelope')
      })
      .catch((error) => {
        if (ignore) return
        setErrorText(errorMessage(error, 'Không mở được thư'))
        setPhase('error')
      })
    return () => {
      ignore = true
    }
  }, [code, navigate])

  async function refuse() {
    try {
      const { data } = await api.post(`/invite/${code}/refuse`)
      setRefuseCount(data.refuseCount)
      setSticker(stickerForCount(data.refuseCount))
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa ghi nhận được lần từ chối'))
    }
  }

  function agree() {
    burstHearts()
    setSticker(null)
    setPhase('choosing')
  }

  function selectChoice(choice) {
    const step = invite.steps[stepIndex]
    setPicks((current) => ({ ...current, [step.code]: choice }))
  }

  function nextStep() {
    if (stepIndex < invite.steps.length - 1) {
      setStepIndex((index) => index + 1)
      return
    }
    setPhase('ticket')
  }

  async function submit() {
    setSending(true)
    setErrorText('')
    try {
      const answers = invite.steps.map((step) => ({
        stepCode: step.code,
        choiceId: picks[step.code].id,
      }))
      const { data } = await api.post(`/invite/${code}/submit`, { note, answers })
      setInvite(data)
      setSent(true)
      setPhase('done')
    } catch (error) {
      setErrorText(errorMessage(error, 'Gửi chưa được, thử lại nha'))
    } finally {
      setSending(false)
    }
  }

  async function saveTicket() {
    if (!ticketRef.current) return
    try {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#FFF9F0' })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `ve-hen-ho-${code}.png`
      link.click()
    } catch {
      setErrorText('Máy này chưa lưu được ảnh vé')
    }
  }

  const rows = ticketRows(invite, picks)

  const Ticket = invite?.mode === 'SPECIAL' ? FourSeasonTicket : DateTicket

  return (
    <SeasonProvider season={invite?.themeSeason}>
    <main className="screen-stage bg-gradient-to-b from-[var(--c-bg-from)] to-[var(--c-bg-to)]">
      <div className="letter-frame">
        {phase === 'loading' && <p className="text-center font-display text-2xl font-extrabold">Đang mở hộp thư...</p>}
        {phase === 'error' && (
          <p className="rounded-3xl border-2 border-[#2B3A67] bg-white p-6 text-center font-display text-xl font-extrabold shadow-[4px_4px_0_#2B3A67]">
            {errorText}
          </p>
        )}
        {phase === 'envelope' && (
          <Envelope
            receiver={invite.receiver}
            opening={opening}
            onOpen={() => setOpening(true)}
            onOpened={() => setPhase('question')}
          />
        )}
        {phase === 'question' && (
          <QuestionLetter
            receiver={invite.receiver}
            refuseCount={refuseCount}
            onAgree={agree}
            onRefuse={refuse}
          />
        )}
        {phase === 'choosing' && (
          <ChoiceGrid
            steps={invite.steps}
            stepIndex={stepIndex}
            step={invite.steps[stepIndex]}
            selectedId={picks[invite.steps[stepIndex].code]?.id}
            onSelect={selectChoice}
            onNext={nextStep}
            onBack={() => setStepIndex((index) => index - 1)}
          />
        )}
        {(phase === 'ticket' || phase === 'done') && (
          <Ticket
            ticketRef={ticketRef}
            receiver={invite.receiver}
            code={invite.code}
            rows={rows}
            note={note}
            onNote={setNote}
            onSubmit={submit}
            onSave={saveTicket}
            sending={sending}
            sent={sent}
            readOnly={phase === 'done' && invite.submitted}
          />
        )}
        {errorText && phase !== 'error' && <p className="mt-4 text-center text-sm font-bold">{errorText}</p>}
      </div>
      {sticker && <StickerReaction sticker={sticker} onClose={() => setSticker(null)} />}
    </main>
    </SeasonProvider>
  )
}

function ticketRows(invite, picks) {
  if (!invite) return []
  if (invite.submitted && invite.answers?.length) {
    return invite.answers.map((answer) => ({ stepName: answer.stepName, label: answer.choiceLabel }))
  }
  return invite.steps.map((step) => ({
    stepName: step.name,
    label: picks[step.code]?.label || '',
  }))
}
