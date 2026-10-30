import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ManageChoices from './pages/admin/ManageChoices'
import InviteExperience from './pages/invite/InviteExperience'
import InviteGate from './pages/invite/InviteGate'
import PinGate from './pages/invite/PinGate'
import SpecialFlow from './pages/invite/SpecialFlow'

function RequireAuth({ children }) {
  if (!sessionStorage.getItem('token')) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/invite/:code" element={<InviteGate />} />
      <Route path="/invite/:code/pin" element={<PinGate />} />
      <Route path="/invite/:code/letter" element={<InviteExperience />} />
      <Route path="/invite/:code/special/step/:n" element={<SpecialFlow />} />
      <Route path="/invite/:code/special/done" element={<SpecialFlow />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Navigate to="/admin/invitations" replace />} />
      <Route path="/admin/invitations" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/admin/choices" element={<RequireAuth><ManageChoices /></RequireAuth>} />
    </Routes>
  )
}
