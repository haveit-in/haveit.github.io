import { useNavigate } from 'react-router-dom'
import LocationSelector from './LocationSelector.jsx'
import MagnetWrapper from './MagnetWrapper.jsx'
import ProfileMenu from './ProfileMenu.jsx'

export default function Navbar({
  user,
  loading,
  onLoginClick,
  activeMode,
  accent,
  setIsCartModalOpen,
  setIsFavoritesModalOpen,
}) {
  const navigate = useNavigate()

  return (
    <>
      {/* DESKTOP HEADER */}
      <header className={`hidden md:block sticky top-0 z-50 ${accent.bgLight} border-b border-gray-100 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative">
            <div className="relative z-10 flex items-center justify-between h-16 gap-4">
              <div className="flex items-center gap-4 flex-shrink-0">
                <LocationSelector isHeader accent={accent} activeMode={activeMode} />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center h-16">
                <MagnetWrapper>
                  <div className="flex items-center gap-2">
                    <img 
                      src="/image/22.png" 
                      alt="Haveit Logo" 
                      className="h-8 w-auto"
                    />
                    <span className={`text-2xl font-bold ${accent.icon}`}>
                      Haveit
                    </span>
                  </div>
                </MagnetWrapper>
              </div>

              <div className="flex items-center gap-2 whitespace-nowrap">
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={() => navigate('/partner')}
                    className={`h-8 px-3 rounded-full text-xs font-medium text-white ${accent.bg} hover:bg-opacity-90 transition-colors`}
                  >
                    Become a Partner
                  </button>
                </MagnetWrapper>
                {!loading && user ? (
                    <ProfileMenu 
                      activeMode={activeMode} 
                      setIsCartModalOpen={setIsCartModalOpen}
                      setIsFavoritesModalOpen={setIsFavoritesModalOpen}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={onLoginClick}
                      className={`h-8 px-3 rounded-full text-xs font-medium ${accent.icon} border border-gray-300 ${accent.bgLight} hover:border-${activeMode === 'food' ? 'orange-500' : 'green-600'} hover:bg-opacity-80 transition-colors`}
                    >
                      Login
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm">
        <div className="flex items-center px-4 h-14">

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <img src="/image/22.png" className="h-6" />
            <span className={`text-xl font-bold ${accent.icon}`}>Haveit</span>
          </div>

          {/* Location RIGHT */}
          <div className="ml-auto flex justify-end">
            <LocationSelector isMobile accent={accent} activeMode={activeMode} />
          </div>

        </div>
      </header>
    </>
  )
}
