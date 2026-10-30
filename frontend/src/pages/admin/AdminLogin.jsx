import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, errorMessage } from '../../api/client'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setErrorText('')
    try {
      const { data } = await api.post('/admin/login', { username, password })
      sessionStorage.setItem('token', data.token)
      navigate('/admin/invitations')
    } catch (error) {
      setErrorText(errorMessage(error, 'Đăng nhập chưa được'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-gradient-to-b from-[#d7ecff] to-[#ffe3ec] px-4">
      <Card className="letter-frame bg-[#FFF9F0] p-6">
        <form onSubmit={submit}>
          <p className="text-center font-display text-3xl font-extrabold">Thư đi chơi</p>
          <p className="mb-5 text-center text-sm text-[#64748B]">Trang quản trị viên</p>
          <label className="block text-sm font-extrabold">
            Tài khoản
            <input className="field mt-1" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </label>
          <label className="mt-3 block text-sm font-extrabold">
            Mật khẩu
            <input className="field mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </label>
          {errorText && <p className="mt-3 text-sm font-bold">{errorText}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={saving}>
            {saving ? 'Đang vào...' : 'Đăng nhập'}
          </Button>
        </form>
      </Card>
    </main>
  )
}
