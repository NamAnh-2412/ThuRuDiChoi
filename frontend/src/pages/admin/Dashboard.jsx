import { useEffect, useState } from 'react'
import { api, errorMessage } from '../../api/client'
import AdminNavbar from '../../components/admin/AdminNavbar'
import CreateInviteModal from '../../components/admin/CreateInviteModal'
import PinManager from '../../components/admin/PinManager'
import ResponseDetailCard from '../../components/admin/ResponseDetailCard'
import { SEASONS } from '../../theme/seasons'
import Button from '../../components/common/Button'

export default function Dashboard() {
  const [invitations, setInvitations] = useState([])
  const [responses, setResponses] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [copied, setCopied] = useState('')

  async function load() {
    const [invitationRes, responseRes] = await Promise.all([
      api.get('/admin/invitations'),
      api.get('/admin/responses'),
    ])
    setInvitations(invitationRes.data)
    setResponses(responseRes.data)
    setSelectedId((current) => current ?? invitationRes.data[0]?.id ?? null)
  }

  useEffect(() => {
    load().catch((error) => setErrorText(errorMessage(error, 'Không tải được danh sách thư')))
  }, [])

  const selected = invitations.find((item) => item.id === selectedId) || null
  const response = responses.find((item) => item.invitationId === selectedId) || null

  async function copy(code) {
    await navigator.clipboard.writeText(`${window.location.origin}/invite/${code}`)
    setCopied(code)
  }

  return (
    <div className="min-h-dvh bg-[#f3f7fb]">
      <AdminNavbar />
      <main className="admin-page py-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold">Danh sách thư mời</h1>
          <Button onClick={() => setCreating(true)}>Tạo thư</Button>
        </div>
        {errorText && <p className="mt-3 text-sm font-bold">{errorText}</p>}
        <ul className="mt-4 flex flex-col gap-3 lg:hidden">
          {invitations.map((invitation) => (
            <li key={invitation.id} className={`rounded-3xl border-2 border-[#2B3A67] bg-white p-4 shadow-[4px_4px_0_#2B3A67] ${invitation.id === selectedId ? 'bg-[#fff1f5]' : ''}`}>
              <p className="font-extrabold">{invitation.receiver || 'Ẩn danh'}</p>
              <button type="button" className="mt-1 break-all text-left text-sm font-bold underline" onClick={() => copy(invitation.code)}>
                /invite/{invitation.code}
              </button>
              {copied === invitation.code && <span className="ml-2 text-xs">Đã chép</span>}
              <p className="mt-2 text-sm">
                {SEASONS[invitation.themeSeason]?.name || 'Mặc định'} · {invitation.hasPin ? (invitation.pinLocked ? 'Đang khóa' : 'Có mã') : 'Không mã'} · {modeText(invitation)}
              </p>
              <p className="text-sm">{statusText(invitation)}</p>
              <button type="button" className="mt-2 font-extrabold" onClick={() => setSelectedId(invitation.id)}>
                Xem
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 hidden overflow-x-auto rounded-3xl border-2 border-[#2B3A67] bg-white shadow-[4px_4px_0_#2B3A67] lg:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b-2 border-[#2B3A67] bg-[#FFF9F0]">
              <tr>
                <th className="px-4 py-3">Người nhận</th>
                <th className="px-4 py-3">Link</th>
                <th className="px-4 py-3">Mùa</th>
                <th className="px-4 py-3">Mã PIN</th>
                <th className="px-4 py-3">Số lần bấm Không</th>
                <th className="px-4 py-3">Kiểu thư</th>
                <th className="px-4 py-3">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invitation) => (
                <tr key={invitation.id} className={invitation.id === selectedId ? 'bg-[#fff1f5]' : ''}>
                  <td className="px-4 py-3 font-extrabold">{invitation.receiver || 'Ẩn danh'}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="font-bold underline" onClick={() => copy(invitation.code)}>
                      /invite/{invitation.code}
                    </button>
                    {copied === invitation.code && <span className="ml-2 text-xs">Đã chép</span>}
                  </td>
                  <td className="px-4 py-3">{SEASONS[invitation.themeSeason]?.name || 'Mặc định'}</td>
                  <td className="px-4 py-3">{invitation.hasPin ? (invitation.pinLocked ? 'Đang khóa' : 'Có mã') : 'Không'}</td>
                  <td className="px-4 py-3">{statusText(invitation)}</td>
                  <td className="px-4 py-3">{modeText(invitation)}</td>
                  <td className="px-4 py-3">
                    <button type="button" className="font-extrabold" onClick={() => setSelectedId(invitation.id)}>
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <section id="ket-qua" className="mt-5 rounded-3xl border-2 border-[#2B3A67] bg-white p-5 shadow-[4px_4px_0_#2B3A67]">
          <ResponseDetailCard invitation={selected} response={response} />
        </section>
        <PinManager invitation={selected} onChanged={load} />
      </main>
      {creating && (
        <CreateInviteModal
          onClose={() => setCreating(false)}
          onCreated={() => load()}
        />
      )}
    </div>
  )
}

function modeText(invitation) {
  if (!invitation.submitted) return 'Chưa chốt'
  return invitation.mode === 'SPECIAL' ? 'Đặc biệt' : 'Thường'
}

function statusText(invitation) {
  if (!invitation.opened) return 'Chưa mở thư'
  if (!invitation.submitted) return `${invitation.refuseCount} lần, chưa chốt`
  if (invitation.refuseCount === 0) return 'Đồng ý ngay'
  return `${invitation.refuseCount} lần`
}
