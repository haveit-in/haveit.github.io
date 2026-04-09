import { useState, useEffect, useCallback, useRef } from 'react'
import { useApp } from '../context/useApp.js'
import { Heart } from 'lucide-react'

// CrossIcon component
const CrossIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

// EmptyHeartIcon component
const EmptyHeartIcon = ({ size = 64 }) => (
  <Heart size={size} className="text-gray-300" />
)

export default function FavoritesButton() {
  const { favorites, removeFromFavorites, clearFavorites } = useApp()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const drawerRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  const handleBackdropClick = useCallback((e) => {
    if (e.target === drawerRef.current) {
      setIsDrawerOpen(false)
    }
  }, [])

  const handleFavoritesClick = useCallback(() => {
    setIsDrawerOpen(true)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!isDrawerOpen) {
    return (
      <button
        type="button"
        onClick={handleFavoritesClick}
        className="w-10 h-10 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="View favorites"
      >
        <Heart size={18} className={favorites.items.length > 0 ? 'fill-red-500 text-red-500' : ''} />
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={handleFavoritesClick}
        className="p-3 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="View favorites"
      >
        <Heart size={18} className={favorites.items.length > 0 ? 'fill-red-500 text-red-500' : ''} />
      </button>

      <div
        ref={drawerRef}
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={handleBackdropClick}
      >
        <div
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out animate-slide-in-right"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Favorites</h2>
                <p className="text-sm text-gray-500">{favorites.items.length} {favorites.items.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close favorites"
            >
              <CrossIcon size={20} />
            </button>
          </div>

          <div className="flex flex-col h-[calc(100%-140px)]">
            {favorites.items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <EmptyHeartIcon size={80} />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">No favorites yet</h3>
                <p className="mt-1 text-sm text-gray-500 text-center">
                  Add some delicious items to your favorites!
                </p>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-4">
                    {favorites.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-xs">{item.name[0]}</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">{item.type || item.category}</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeFromFavorites(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove from favorites"
                        >
                          <CrossIcon size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-4 border-t border-gray-100">
                  <button
                    onClick={clearFavorites}
                    className="w-full px-4 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Clear All Favorites
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
