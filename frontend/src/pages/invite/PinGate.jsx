import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../../api/client'
import SeasonWaxSeal from '../../components/common/SeasonWaxSeal'
import { SeasonProvider } from '../../theme/SeasonProvider'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫']

export default function PinGate() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [invite, setInvite] = useState(null)
  const [digits, setDigits] = useState('')
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(false)
  const [errorText, setErrorText] = useState('')
  const busy = useRef(false)

  useEffect(() => {
    api
      .get(`/invite/${code}`)
      .then(({ data }) => {
        if (data.submitted) {
          navigate(`/invite/${code}/letter`, { replace: true })
          return
        }
        if (!data.hasPin) {
          sessionStorage.setItem(`gate:${code}`, 'open')
          navigate(`/invite/${code}/letter`, { replace: true })
          return
        }
        setInvite(data)
      })
      .catch((error) => setErrorText(errorMessage(error, 'Không mở được thư')))
  }, [code, navigate])

  useEffect(() => {
    if (digits.length < 4 || busy.current) return undefined
    let ignore = false
    busy.current = true
    setChecking(true)
    setMessage('')
    api
      .post(`/invite/${code}/verify-pin`, { pin: digits })
      .then(({ data }) => {
        if (ignore) return
        if (data.mode === 'SPECIAL' && data.specialToken) {
          sessionStorage.setItem(`special:${code}`, data.specialToken)
          sessionStorage.removeItem(`picks:${code}`)
          navigate(`/invite/${code}/special/step/1`, { replace: true })
          return
        }
        sessionStorage.setItem(`gate:${code}`, 'open')
        navigate(`/invite/${code}/letter`, { replace: true })
      })
      .catch((error) => {
        if (ignore) return
        busy.current = false
        if (error.response?.status === 429) {
          setMessage(error.response.data?.message || 'Thử lại sau ít phút nha')
          setDigits('')
          return
        }
        setMessage(errorMessage(error, 'Chưa kiểm tra được, thử lại nha'))
        setDigits('')
      })
      .finally(() => {
        if (!ignore) setChecking(false)
      })
    return () => {
      ignore = true
    }
  }, [digits, code, navigate])

  function press(key) {
    if (checking) return
    setMessage('')
    if (key === '⌫') {
      setDigits((current) => current.slice(0, -1))
      return
    }
    setDigits((current) => (current.length >= 4 ? current : current + key))
  }

  return (
    <SeasonProvider season={invite?.themeSeason}>
      <main className="screen-stage bg-gradient-to-b from-[var(--c-bg-from)] to-[var(--c-bg-to)]">
        <div className="letter-frame rounded-3xl border-2 border-[var(--c-ink)] bg-[var(--c-paper)] px-5 py-6 text-center shadow-[4px_4px_0_var(--c-ink)]">
          {errorText ? (
            <p className="font-display text-2xl font-extrabold">{errorText}</p>
          ) : (
            <>
              <div className="mb-3 flex justify-center">
                <SeasonWaxSeal season={invite?.themeSeason} />
              </div>
              <h1 className="font-display text-2xl font-extrabold">Thư này có khóa nhỏ</h1>
              <p className="mt-1 text-sm font-bold">Nhập 4 số để mở</p>
              <div className="mt-5 flex justify-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <span
                    key={index}
                    className="grid h-12 w-12 place-items-center rounded-2xl border-2 border-[var(--c-ink)] bg-white font-display text-2xl font-extrabold"
                  >
                    {digits[index] ? '•' : ''}
                  </span>
                ))}
              </div>
              {message && <p className="mt-4 text-sm font-extrabold">{message}</p>}
              <div className="mx-auto mt-5 grid w-full max-w-[18rem] grid-cols-3 gap-3">
                {KEYS.map((key, index) =>
                  key === '' ? (
                    <span key={index} />
                  ) : (
                    <button
                      key={key}
                      type="button"
                      onClick={() => press(key)}
                      className="grid h-16 place-items-center rounded-2xl border-2 border-[var(--c-ink)] bg-white font-display text-2xl font-extrabold shadow-[3px_3px_0_var(--c-ink)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                      {key}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </SeasonProvider>
  )
}
