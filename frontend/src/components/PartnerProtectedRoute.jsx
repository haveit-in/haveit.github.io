import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PartnerProtectedRoute({ children }) {
  const { token, fetchWithAuth, loading } = useAuth()
  const [status, setStatus] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      if (!token) {
        setChecking(false)
        return
      }
      try {
        const res = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/restaurant/profile`)
        if (res.ok) {
          const profile = await res.json()
          setStatus(profile.status)
          if (profile.rejection_reason) {
            localStorage.setItem('rejection_reason', profile.rejection_reason)
          }
        }
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [token, fetchWithAuth])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to="/partner/login" replace />
  }

  if (status === 'draft' || status === null) {
    return <Navigate to="/partner/register" replace />
  }
  if (status === 'pending') {
    return <Navigate to="/partner/pending-review" replace />
  }
  if (status === 'rejected') {
    return <Navigate to="/partner/rejected" replace />
  }
  if (status !== 'approved') {
    return <Navigate to="/partner/pending-review" replace />
  }

  return children
}
