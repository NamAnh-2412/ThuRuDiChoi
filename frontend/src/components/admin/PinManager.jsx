import { useState } from 'react'
import { api, errorMessage } from '../../api/client'
import Button from '../common/Button'

const SEASON_CHOICES = [
  { id: '', name: 'Mặc định', from: '#C5E0FF', to: '#FFD0DE' },
  { id: 'spring', name: 'Xuân', from: '#FFE3EC', to: '#E8F8EE' },
  { id: 'summer', name: 'Hạ', from: '#8EDCF5', to: '#FFF5D1' },
  { id: 'autumn', name: 'Thu', from: '#FFD9B0', to: '#FFF0D9' },
  { id: 'winter', name: 'Đông', from: '#D6E8FF', to: '#FDE8F0' },
]

export default function PinManager({ invitation, onChanged }) {
  const [pin, setPin] = useState('')
  const [revealed, setRevealed] = useState('')
  const [errorText, setErrorText] = useState('')
  const [busy, setBusy] = useState(false)

  if (!invitation) return null

  async function run(action) {
    setBusy(true)
    setErrorText('')
    try {
      const data = await action()
      setRevealed(data?.revealedPin || '')
      setPin('')
      onChanged()
    } catch (error) {
      setErrorText(errorMessage(error, 'Chưa cập nhật được mã'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mt-5 rounded-3xl border-2 border-[#2B3A67] bg-white p-5 shadow-[4px_4px_0_#2B3A67]">
      <h3 className="font-display text-xl font-extrabold">Mùa và mã của {invitation.receiver}</h3>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SEASON_CHOICES.map((season) => (
          <button
            key={season.name}
            type="button"
            disabled={busy}
            onClick={() => run(() => api.patch(`/admin/invitations/${invitation.id}/theme`, { themeSeason: season.id || null }).then(({ data }) => data))}
            className={`rounded-2xl border-2 border-[#2B3A67] p-1 text-[11px] font-extrabold ${(invitation.themeSeason || '') === season.id ? 'shadow-[3px_3px_0_#2B3A67]' : ''}`}
          >
            <span className="mb-1 block h-8 rounded-xl" style={{ background: `linear-gradient(${season.from}, ${season.to})` }} />
            {season.name}
          </button>
        ))}
      </div>
      <p className="mt-1 text-sm">{invitation.hasPin ? 'Thư đang có mã 4 số.' : 'Thư này chưa có mã.'}</p>
      {invitation.pinLocked && <p className="mt-2 text-sm font-extrabold">Mã đang bị khóa vì nhập sai nhiều lần.</p>}
      {revealed && (
        <div className="mt-3 rounded-2xl bg-[#FFF9F0] p-3">
          <p className="font-display text-3xl font-extrabold tracking-[0.3em]">{revealed}</p>
          <p className="mt-1 text-sm font-bold">Mã chỉ hiển thị một lần. Hãy sao chép ngay.</p>
          <Button type="button" className="mt-3" onClick={() => navigator.clipboard.writeText(revealed)}>
            Sao chép mã
          </Button>
        </div>
      )}
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <label className="text-sm font-extrabold">
          Đặt 4 số
          <input
            className="field mt-1 w-32 tracking-[0.3em]"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, 4))}
          />
        </label>
        <Button type="button" disabled={busy || pin.length !== 4} onClick={() => run(() => api.post(`/admin/invitations/${invitation.id}/pin`, { pin }).then(({ data }) => data))}>
          Lưu mã
        </Button>
        <Button type="button" tone="sky" disabled={busy} onClick={() => run(() => api.post(`/admin/invitations/${invitation.id}/pin`, { generate: true }).then(({ data }) => data))}>
          Tạo mã ngẫu nhiên
        </Button>
        {invitation.hasPin && (
          <Button type="button" tone="white" disabled={busy} onClick={() => run(() => api.delete(`/admin/invitations/${invitation.id}/pin`).then(({ data }) => data))}>
            Gỡ mã
          </Button>
        )}
        {invitation.pinLocked && (
          <Button type="button" tone="mint" disabled={busy} onClick={() => run(() => api.post(`/admin/invitations/${invitation.id}/pin/unlock`).then(({ data }) => data))}>
            Mở khóa
          </Button>
        )}
      </div>
      {errorText && <p className="mt-3 text-sm font-bold">{errorText}</p>}
    </section>
  )
}
