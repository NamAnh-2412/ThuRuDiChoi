import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, errorMessage } from '../../api/client'
import { SeasonProvider } from '../../theme/SeasonProvider'

export default function InviteGate() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    let ignore = false
    api
      .get(`/invite/${code}`)
      .then(({ data }) => {
        if (ignore) return
        if (data.submitted || !data.hasPin) {
          if (!data.hasPin) sessionStorage.setItem(`gate:${code}`, 'open')
          navigate(`/invite/${code}/letter`, { replace: true })
          return
        }
        navigate(`/invite/${code}/pin`, { replace: true })
      })
      .catch((error) => {
        if (!ignore) setErrorText(errorMessage(error, 'Không mở được thư'))
      })
    return () => {
      ignore = true
    }
  }, [code, navigate])

  return (
    <SeasonProvider season="default">
      <main className="grid min-h-dvh place-items-center bg-gradient-to-b from-[var(--c-bg-from)] to-[var(--c-bg-to)] px-4">
        <p className="text-center font-display text-2xl font-extrabold">{errorText || 'Đang mở hộp thư...'}</p>
      </main>
    </SeasonProvider>
  )
}
