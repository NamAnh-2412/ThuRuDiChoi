import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../../api/client'
import ProgressBar from '../../components/common/ProgressBar'
import ChoiceGrid from '../../components/invite/ChoiceGrid'
import FourSeasonTicket from '../../components/special/FourSeasonTicket'
import SpecialStepLayout from '../../components/special/SpecialStepLayout'
import { SPECIAL_STEPS } from '../../theme/seasons'

function picksKey(code) {
  return `picks:${code}`
}

function readPicks(code) {
  try {
    return JSON.parse(sessionStorage.getItem(picksKey(code)) || '{}')
  } catch {
    return {}
  }
}

export default function SpecialFlow() {
  const { code, n } = useParams()
  const navigate = useNavigate()
  const token = sessionStorage.getItem(`special:${code}`)
  const stepNumber = Number(n)
  const onTicket = !n
  const [steps, setSteps] = useState([])
  const [picks, setPicks] = useState(() => readPicks(code))
  const [note, setNote] = useState('')
  const [errorText, setErrorText] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [receiver, setReceiver] = useState('')

  useEffect(() => {
    if (!token) return undefined
    api.get(`/invite/${code}`).then(({ data }) => {
      setReceiver(data.receiver || '')
      if (data.submitted) navigate(`/invite/${code}/letter`, { replace: true })
    })
    api
      .get(`/invite/${code}/steps`, {
        params: { mode: 'SPECIAL' },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setSteps(data))
      .catch((error) => {
        if (error.response?.status === 403) {
          sessionStorage.removeItem(`special:${code}`)
          navigate(`/invite/${code}/pin`, { replace: true })
          return
        }
        setErrorText(errorMessage(error, 'Chưa mở được hành trình 4 mùa'))
      })
    return undefined
  }, [code, token, navigate])

  if (!token) return <Navigate to={`/invite/${code}/pin`} replace />

  const merged = SPECIAL_STEPS.map((copy) => {
    const remote = steps.find((step) => step.code === copy.code)
    return { ...copy, id: remote?.id, choices: remote?.choices || [] }
  })
  const index = onTicket ? 3 : Math.min(Math.max(stepNumber, 1), 4) - 1
  const current = merged[index]
  const missingEarlier = merged.slice(0, index).some((step) => !picks[step.code])

  function remember(next) {
    setPicks(next)
    sessionStorage.setItem(picksKey(code), JSON.stringify(next))
  }

  function selectChoice(choice) {
    remember({ ...picks, [current.code]: choice })
  }

  function nextStep() {
    if (index < 3) {
      navigate(`/invite/${code}/special/step/${index + 2}`)
      return
    }
    navigate(`/invite/${code}/special/done`)
  }

  async function submit() {
    setSending(true)
    setErrorText('')
    try {
      const answers = merged.map((step) => ({ stepCode: step.code, choiceId: picks[step.code].id }))
      await api.post(
        `/invite/${code}/submit`,
        { note, answers },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      sessionStorage.removeItem(`special:${code}`)
      sessionStorage.removeItem(picksKey(code))
      setSent(true)
    } catch (error) {
      setErrorText(errorMessage(error, 'Gửi chưa được, thử lại nha'))
    } finally {
      setSending(false)
    }
  }

  if (!onTicket && (stepNumber < 1 || stepNumber > 4)) {
    return <Navigate to={`/invite/${code}/special/step/1`} replace />
  }
  if (steps.length > 0 && missingEarlier) {
    const firstGap = merged.findIndex((step) => !picks[step.code])
    return <Navigate to={`/invite/${code}/special/step/${firstGap + 1}`} replace />
  }
  if (onTicket && steps.length > 0 && merged.some((step) => !picks[step.code])) {
    const firstGap = merged.findIndex((step) => !picks[step.code])
    return <Navigate to={`/invite/${code}/special/step/${Math.max(firstGap, 0) + 1}`} replace />
  }

  const rows = merged.map((step) => ({ stepName: step.name, label: picks[step.code]?.label || '' }))

  return (
    <SpecialStepLayout season={onTicket ? 'winter' : current.season}>
      {errorText && !steps.length ? (
        <p className="rounded-3xl border-2 border-[var(--c-ink)] bg-white p-6 text-center font-display text-xl font-extrabold">
          {errorText}
        </p>
      ) : onTicket ? (
        <>
        <ProgressBar steps={merged} current={4} />
        <FourSeasonTicket
          receiver={receiver}
          code={code}
          rows={rows}
          note={note}
          onNote={setNote}
          onSubmit={submit}
          sending={sending}
          sent={sent}
          readOnly={sent}
        />
        </>
      ) : (
        <ChoiceGrid
          steps={merged}
          stepIndex={index}
          step={{ ...current, question: current.question }}
          selectedId={picks[current.code]?.id}
          onSelect={selectChoice}
          onNext={nextStep}
          onBack={() => index > 0 && navigate(`/invite/${code}/special/step/${index}`)}
        />
      )}
      {errorText && steps.length > 0 && <p className="mt-4 text-center text-sm font-bold">{errorText}</p>}
    </SpecialStepLayout>
  )
}
