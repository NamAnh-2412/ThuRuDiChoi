import { useState } from 'react'
import { api, errorMessage } from '../../api/client'
import Button from '../common/Button'
import { SEASONS } from '../../theme/seasons'

const SEASON_CHOICES = [
  { id: '', name: 'Mặc định', from: '#C5E0FF', to: '#FFD0DE' },
  { id: 'spring', name: 'Xuân', from: '#FFE3EC', to: '#E8F8EE' },
  { id: 'summer', name: 'Hạ', from: '#8EDCF5', to: '#FFF5D1' },
  { id: 'autumn', name: 'Thu', from: '#FFD9B0', to: '#FFF0D9' },
  { id: 'winter', name: 'Đông', from: '#D6E8FF', to: '#FDE8F0' },
]

export default function CreateInviteModal({ onClose, onCreated }) {
  const [receiver, setReceiver] = useState('')
  const [title, setTitle] = useState('')
  const [themeSeason, setThemeSeason] = useState('')
  const [pin, setPin] = useState('')
  const [errorText, setErrorText] = useState('')
  const [created, setCreated] = useState(null)
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setErrorText('')
    try {
      const { data } = await api.post('/admin/invitations', {
        receiver,
        title,
        themeSeason: themeSeason || null,
        pin: pin || null,
      })
      setCreated(data)
      onCreated(data)
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa tạo được thư'))
    } finally {
      setSaving(false)
    }
  }

  const link = created ? `${window.location.origin}/invite/${created.code}` : ''

  async function copy() {
    await navigator.clipboard.writeText(link)
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-[#2B3A67]/40 px-4 py-[max(1rem,env(safe-area-inset-top))]">
      <form onSubmit={submit} className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-[#2B3A67] bg-white p-5 shadow-[6px_6px_0_#2B3A67]">
        <h2 className="font-display text-2xl font-extrabold">Tạo thư mới</h2>
        {created ? (
          <div className="mt-4">
            <p className="text-sm">Gửi link này cho {created.receiver}</p>
            <p className="mt-2 break-all rounded-2xl bg-[#FFF9F0] p-3 text-sm font-bold">{link}</p>
            {created.revealedPin && (
              <div className="mt-3 rounded-2xl bg-[#fff1f5] p-3">
                <p className="font-display text-3xl font-extrabold tracking-[0.3em]">{created.revealedPin}</p>
                <p className="mt-1 text-sm font-bold">Mã chỉ hiển thị một lần. Hãy sao chép ngay.</p>
              </div>
            )}
            {created.themeSeason && (
              <p className="mt-2 text-sm font-bold">Mùa: {SEASONS[created.themeSeason]?.name}</p>
            )}
            <div className="mt-4 flex gap-2">
              <Button type="button" onClick={copy}>
                Sao chép link
              </Button>
              <Button type="button" tone="white" onClick={onClose}>
                Xong
              </Button>
            </div>
          </div>
        ) : (
          <>
            <label className="mt-4 block text-sm font-extrabold">
              Tên người nhận
              <input className="field mt-1" value={receiver} onChange={(event) => setReceiver(event.target.value)} required />
            </label>
            <label className="mt-3 block text-sm font-extrabold">
              Tiêu đề
              <input className="field mt-1" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Cuối tuần này đi chơi nha" />
            </label>
            <p className="mt-3 text-sm font-extrabold">Mùa của thư</p>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {SEASON_CHOICES.map((season) => (
                <button
                  key={season.name}
                  type="button"
                  onClick={() => setThemeSeason(season.id)}
                  className={`rounded-2xl border-2 border-[#2B3A67] p-1 text-[11px] font-extrabold ${themeSeason === season.id ? 'shadow-[3px_3px_0_#2B3A67]' : ''}`}
                >
                  <span className="mb-1 block h-8 rounded-xl" style={{ background: `linear-gradient(${season.from}, ${season.to})` }} />
                  {season.name}
                </button>
              ))}
            </div>
            <label className="mt-3 block text-sm font-extrabold">
              Mã 4 số, có thể bỏ trống
              <input
                className="field mt-1 tracking-[0.3em]"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
              />
            </label>
            {errorText && <p className="mt-3 text-sm font-bold">{errorText}</p>}
            <div className="mt-4 flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Đang tạo...' : 'Tạo thư'}
              </Button>
              <Button type="button" tone="white" onClick={onClose}>
                Hủy
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
