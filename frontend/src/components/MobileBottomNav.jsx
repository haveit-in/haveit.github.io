import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  House,
  ShoppingBag,
  Heart,
  User,
  Briefcase,
  Search,
} from 'lucide-react'
import SearchBar from './SearchBar.jsx'

export default function MobileBottomNav({
  activeTab,
  setActiveTab,
  activeMode,
  user,
  loading,
  onLoginClick,
  accent,
  setIsCartModalOpen,
  setIsFavoritesModalOpen,
}) {
  const navigate = useNavigate()
  const [showSearchModal, setShowSearchModal] = useState(false)
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20 z-40">
      <button
        type="button"
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'home' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'home' ? 'text-green-500' : 'text-gray-500'
        }`}
      >
        <House size={24} />
        {activeTab === 'home' && <div className={`w-1 h-1 rounded-full mt-1 ${
          activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
        }`} />}
      </button>
      <button
        type="button"
        onClick={() => {
          setActiveTab('search')
          setShowSearchModal(true)
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'search' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'search' ? 'text-green-500' : 'text-gray-500'
        }`}
      >
        <Search size={24} />
        {activeTab === 'search' && <div className={`w-1 h-1 rounded-full mt-1 ${
          activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
        }`} />}
      </button>
      <button
        type="button"
        onClick={() => navigate('/partner')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeMode === 'food' ? 'text-orange-500' : 'text-green-500'
        }`}
      >
        <Briefcase size={24} />
        <span className={`text-xs mt-1 font-medium ${
          activeMode === 'food' ? 'text-orange-500' : 'text-green-500'
        }`}>Partner</span>
      </button>
      <button
        type="button"
        onClick={() => {
          if (!loading && user) {
            setActiveTab('saved')
            setIsFavoritesModalOpen(true)
          } else {
            onLoginClick()
          }
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'saved'
            ? (activeMode === 'food' ? 'text-orange-500' : 'text-green-500')
            : 'text-gray-500'
        }`}
      >
        <Heart size={24} />
        {activeTab === 'saved' && <div className={`w-1 h-1 rounded-full mt-1 ${
          activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
        }`} />}
      </button>
      <button
        type="button"
        onClick={() => {
          if (!loading && user) {
            setActiveTab('profile')
            navigate('/profile')
          } else {
            onLoginClick()
          }
        }}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          activeTab === 'profile'
            ? (activeMode === 'food' ? 'text-orange-500' : 'text-green-500')
            : 'text-gray-500'
        }`}
      >
        <User size={24} />
        {activeTab === 'profile' && <div className={`w-1 h-1 rounded-full mt-1 ${
          activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
        }`} />}
      </button>
    </nav>
    
    {/* Search Modal */}
    {showSearchModal && (
      <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-start">
        <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Search</h3>
            <button
              type="button"
              onClick={() => {
                setShowSearchModal(false)
                setActiveTab('home')
              }}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <SearchBar 
            isMobile={true} 
            placeholder={
              activeMode === 'food'
                ? 'Search for food, restaurants...'
                : 'Search for groceries, items...'
            }
          />
        </div>
      </div>
    )}
    </>
  )
}
