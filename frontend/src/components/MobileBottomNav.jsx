import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import {
  House,
  ShoppingBag,
  Heart,
  Briefcase,
  Search,
} from 'lucide-react'
import SearchBar from './SearchBar.jsx'
import { useApp } from '../context/useApp.js'

// Search data
const searchData = [
  // Food dishes
  { id: 'dish-1', name: 'Biryani', type: 'Food', category: 'Food', price: 240, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&h=100&fit=crop' },
  { id: 'dish-2', name: 'Pizza', type: 'Dish', category: 'Food', price: 299, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop' },
  { id: 'dish-3', name: 'Dosa', type: 'Dish', category: 'Food', price: 120, image: 'https://images.unsplash.com/photo-1665660716988-1f472b8e7d50?w=100&h=100&fit=crop' },
  { id: 'dish-4', name: 'Paneer Butter Masala', type: 'Dish', category: 'Food', price: 180, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=100&h=100&fit=crop' },
  { id: 'dish-5', name: 'Burger', type: 'Dish', category: 'Food', price: 199, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop' },
  { id: 'dish-6', name: 'Fries', type: 'Dish', category: 'Food', price: 99, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&h=100&fit=crop' },
  { id: 'dish-7', name: 'Noodles', type: 'Dish', category: 'Food', price: 149, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&h=100&fit=crop' },
  { id: 'dish-8', name: 'Tandoori Chicken', type: 'Dish', category: 'Food', price: 349, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=100&h=100&fit=crop' },
  { id: 'dish-9', name: 'Idli', type: 'Dish', category: 'Food', price: 80, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&h=100&fit=crop' },
  { id: 'dish-10', name: 'Vada', type: 'Dish', category: 'Food', price: 70, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=100&h=100&fit=crop' },
  
  // Restaurants
  { id: 'rest-1', name: 'Biryani House', type: 'Restaurant', category: 'Food', rating: 4.5 },
  { id: 'rest-2', name: 'Pizza Hut', type: 'Restaurant', category: 'Food', rating: 4.3 },
  { id: 'rest-3', name: 'Dominos', type: 'Restaurant', category: 'Food', rating: 4.4 },
  { id: 'rest-4', name: 'Dosa Corner', type: 'Restaurant', category: 'Food', rating: 4.6 },
  { id: 'rest-5', name: 'Burger King', type: 'Restaurant', category: 'Food', rating: 4.2 },
  
  // Groceries
  { id: 'groc-1', name: 'Apples', type: 'Grocery', category: 'Groceries', price: 120 },
  { id: 'groc-2', name: 'Bananas', type: 'Grocery', category: 'Groceries', price: 60 },
  { id: 'groc-3', name: 'Tomatoes', type: 'Grocery', category: 'Groceries', price: 40 },
  { id: 'groc-4', name: 'Potatoes', type: 'Grocery', category: 'Groceries', price: 35 },
  { id: 'groc-5', name: 'Onions', type: 'Grocery', category: 'Groceries', price: 30 },
  
  // Beverages
  { id: 'bev-1', name: 'Coca Cola', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-2', name: 'Pepsi', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-3', name: 'Sprite', type: 'Beverage', category: 'Beverages', price: 40 },
  { id: 'bev-4', name: 'Fanta', type: 'Beverage', category: 'Beverages', price: 40 },
]

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
  const { setSearchQuery: setAppSearchQuery } = useApp()
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const searchInputRef = useRef(null)
  const debounceTimerRef = useRef(null)

  // Initialize Fuse
  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'type', weight: 0.2 },
        { name: 'category', weight: 0.2 },
      ],
      threshold: 0.4,
      includeMatches: true,
      minMatchCharLength: 1,
    });
  }, []);

  // Perform search with debounce
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([])
      return;
    }

    const results = fuse.search(query, { limit: 10 });
    setSearchResults(results);
  }, [fuse]);

  // Handle input change with debounce
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  }, [performSearch]);

  // Handle result selection
  const handleSelectResult = useCallback((result) => {
    setSearchQuery(result.item.name);
    setAppSearchQuery(result.item.name);
    setShowSearchModal(false);
    setActiveTab('home');
  }, [setAppSearchQuery]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [showSearchModal])

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
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
    </nav>
    
    {/* Search Modal */}
    {showSearchModal && (
      <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <button
            type="button"
            onClick={() => {
              setShowSearchModal(false)
              setActiveTab('home')
              setSearchQuery('')
              setSearchResults([])
            }}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={handleInputChange}
                className={`block w-full h-10 pl-10 pr-4 border ${accent.border} rounded-full ${accent.bgLight} text-sm font-medium text-gray-900 placeholder-gray-400 hover:border-${activeMode === 'food' ? 'orange-500' : 'green-600'} focus:outline-none focus:ring-2 ${accent.focus}`}
                placeholder={
                  activeMode === 'food'
                    ? 'Search for food, restaurants...'
                    : 'Search for groceries, items...'
                }
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        
        {/* Search Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {!searchQuery ? (
            <div className="text-center text-gray-500 mt-8">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-gray-300">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <p className="text-sm">Start typing to search</p>
              <p className="text-xs text-gray-400 mt-1">
                {activeMode === 'food' 
                  ? 'Find your favorite food and restaurants' 
                  : 'Discover fresh groceries and essentials'
                }
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
                <button
                  key={result.item.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  {result.item.image && (
                    <img 
                      src={result.item.image} 
                      alt={result.item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  {!result.item.image && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-sm">
                        {result.item.type?.[0] || '?'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {result.item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.item.type}
                      {result.item.price && ` • ₹${result.item.price}`}
                      {result.item.rating && ` • ★${result.item.rating}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-gray-300">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <p className="text-sm">
                No results for <span className="font-medium text-gray-900">"{searchQuery}"</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for dishes, restaurants, or groceries
              </p>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
