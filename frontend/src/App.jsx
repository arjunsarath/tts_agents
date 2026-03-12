import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Landing from './pages/Landing'
import ComplianceAgent from './pages/ComplianceAgent'
import AdoptionCopilot from './pages/AdoptionCopilot'
import KnowledgeBase from './pages/KnowledgeBase'
import Documentation from './pages/Documentation'
import ApprovedStack from './pages/ApprovedStack'
import AppLayout from './components/AppLayout'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/compliance" element={<ComplianceAgent />} />
        <Route path="/copilot" element={<AdoptionCopilot />} />
        <Route path="/copilot/:tab" element={<AdoptionCopilot />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/stack" element={<ApprovedStack />} />
        <Route path="/docs" element={<Documentation />} />
      </Route>
    </Routes>
  )
}
