import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { UserIcon } from './Icons.jsx'

const ProfileMenu = ({ activeMode }) => {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  const accent = activeMode === 'food'
    ? { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' }
    : { bg: 'bg-green-600', bgLight: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }

  if (!user) return null

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-8 h-8 ${accent.bg} text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors`}
        aria-label="Profile"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <UserIcon size={20} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.email}
            </p>
            {user.name && (
              <p className="text-xs text-gray-500 truncate">
                {user.name}
              </p>
            )}
          </div>

          {/* Logout Button */}
          <div className="px-2">
            <button
              type="button"
              onClick={handleLogout}
              className={`w-full text-left px-3 py-2 text-sm ${accent.text} hover:${accent.bgLight} rounded-md transition-colors flex items-center gap-2`}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
