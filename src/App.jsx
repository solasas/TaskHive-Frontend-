import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectDetail from './pages/ProjectDetail'
import MyTasks from './pages/MyTasks'
import ChangePassword from './pages/ChangePassword'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/projects/:id"
            element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>}
          />
          <Route
            path="/my-tasks"
            element={<ProtectedRoute><MyTasks /></ProtectedRoute>}
          />
          <Route
            path="/change-password"
            element={<ProtectedRoute><ChangePassword /></ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
