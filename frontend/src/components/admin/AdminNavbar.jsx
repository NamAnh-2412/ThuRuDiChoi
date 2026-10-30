import { NavLink, useNavigate } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  `rounded-full border-2 border-[#2B3A67] px-3 py-1.5 text-sm font-extrabold ${
    isActive ? 'bg-[#FFB6C9] shadow-[3px_3px_0_#2B3A67]' : 'bg-white'
  }`

export default function AdminNavbar() {
  const navigate = useNavigate()

  function logout() {
    sessionStorage.removeItem('token')
    navigate('/admin/login')
  }

  return (
    <header className="border-b-2 border-[#2B3A67] bg-white">
      <div className="admin-page flex flex-wrap items-center gap-3 py-3">
        <p className="mr-auto font-display text-xl font-extrabold">Thư rủ đi chơi</p>
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/admin/invitations" className={linkClass}>
            Thư mời
          </NavLink>
          <NavLink to="/admin/choices" className={linkClass}>
            Lựa chọn
          </NavLink>
        </nav>
        <button type="button" onClick={logout} className="text-sm font-bold text-[#64748B]">
          Đăng xuất
        </button>
      </div>
    </header>
  )
}
