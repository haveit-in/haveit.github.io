import { useEffect, useState, useRef } from 'react'
import {
  CubeIcon,
  FoodIcon,
  AppleIcon,
  DropletIcon,
  LeafIcon,
  SearchIcon,
  UserIcon,
  CartIcon,
  LocationIcon,
  ChevronDownIcon,
  MenuIcon,
  StarIcon,
  PlusIcon,
  LightningIcon,
} from '../components/Icons.jsx'

const searchPhrases = [
  'Search for dishes, groceries, or more...',
  'Search for biryani...',
  'Search for groceries...',
]

const categories = [
  { id: 'all', Icon: CubeIcon, label: 'All' },
  { id: 'food', Icon: FoodIcon, label: 'Food' },
  { id: 'groceries', Icon: AppleIcon, label: 'Groceries' },
  { id: 'beverages', Icon: DropletIcon, label: 'Beverages' },
  { id: 'fresh', Icon: LeafIcon, label: 'Fresh' },
]

const popularItems = [
  {
    name: 'Biryani',
    price: '₹240',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  },
  {
    name: 'Pizza',
    price: '₹299',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
  // {
  //   name: 'Dosa',
  //   price: '₹120',
  //   rating: '4.6',
  //   image: 'https://images.unsplash.com/photo-1665660716988-1f472b8e7d50?w=400&h=300&fit=crop',
  // },
  {
    name: 'Paneer',
    price: '₹180',
    rating: '4.4',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
  },
  {
    name: 'Burger',
    price: '₹199',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    name: 'Fries',
    price: '₹99',
    rating: '4.3',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
  },
  {
    name: 'Noodles',
    price: '₹149',
    rating: '4.4',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  },
  {
    name: 'Tandoori',
    price: '₹349',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  },
]

// ChevronLeft Icon component
const ChevronLeftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

// ChevronRight Icon component
const ChevronRightIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default function Landing({ onOpenLogin, onOpenSignup }) {
  const [placeholder, setPlaceholder] = useState(searchPhrases[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(searchPhrases[0].length)
  const [isDeleting, setIsDeleting] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sliderRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const maxScroll = scrollWidth - clientWidth
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setScrollProgress(progress)
    }
  }

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300
      const targetScroll = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      sliderRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const current = searchPhrases[phraseIndex]
    const delay = isDeleting ? 40 : 80

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (charIndex > 0) {
          const next = current.slice(0, charIndex - 1)
          setCharIndex(charIndex - 1)
          setPlaceholder(next || 'Search')
        } else {
          const nextIndex = (phraseIndex + 1) % searchPhrases.length
          setPhraseIndex(nextIndex)
          setIsDeleting(false)
        }
      } else {
        if (charIndex < current.length) {
          const next = current.slice(0, charIndex + 1)
          setCharIndex(charIndex + 1)
          setPlaceholder(next)
        } else {
          setTimeout(() => {
            setIsDeleting(true)
          }, 1500)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-orange-500">Haveit</span>
            </div>

            {/* Location Selector */}
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Select delivery location"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Select Location</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  Tap to choose <ChevronDownIcon size={10} />
                </p>
              </div>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={placeholder}
                  aria-label="Search for dishes, groceries, or more"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <UserIcon size={18} />
                <span>Login</span>
              </button>
              <button
                type="button"
                className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="View cart"
              >
                <CartIcon size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.Icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors relative ${
                      isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <Icon size={22} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                    <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {cat.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 w-6 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <MenuIcon size={24} />
          </button>
          <span className="text-xl font-bold text-orange-500">Haveit</span>
          <button
            type="button"
            className="relative p-2 -mr-2 text-gray-700"
            aria-label="View cart"
          >
            <CartIcon size={22} />
            <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onOpenLogin()
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white text-base font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              <UserIcon size={20} />
              <span>Login</span>
            </button>
          </div>
        )}

        {/* Mobile Location & Search */}
        <div className="px-4 pb-3 space-y-3">
          {/* Location */}
          <button
            type="button"
            className="flex items-center gap-2 text-left"
            aria-label="Select delivery location"
          >
            <LocationIcon size={18} className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                Tap to choose <ChevronDownIcon size={10} />
              </p>
            </div>
          </button>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon size={18} className="text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Search dishes, groceries..."
              aria-label="Search dishes, groceries"
            />
          </div>

          {/* Category Bar Mobile */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
            {categories.map((cat) => {
              const Icon = cat.Icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 min-w-[56px] transition-colors ${
                    isActive ? 'text-orange-500' : 'text-gray-500'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <Icon size={20} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                  <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Orange Background with Cards */}
        <section className="bg-orange-500 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Food Delivery Card */}
              <article className="bg-white rounded-2xl p-5 md:p-6 relative overflow-hidden min-h-[200px] md:min-h-[260px]">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide mb-1">
                    FOOD DELIVERY
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Crave it? Order it.
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">
                    Get your favorite meals delivered hot and fresh to your doorstep.
                  </p>
                  <span className="inline-block px-3 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg">
                    UPTO 60% OFF
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="absolute bottom-0 left-0 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  {/* Arrow button in top right of image area */}
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
                    aria-label="Explore Food Delivery"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </article>

              {/* Groceries Card */}
              <article className="bg-white rounded-2xl p-5 md:p-6 relative overflow-hidden min-h-[200px] md:min-h-[260px]">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide mb-1">
                    GROCERIES
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Fresh picks, fast delivery.
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">
                    Stock up on essentials with our wide range of groceries.
                  </p>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-600 text-xs font-bold rounded-lg">
                    <LightningIcon size={12} /> 10 MINS
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="absolute bottom-0 left-0 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  {/* Arrow button in top right of image area */}
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
                    aria-label="Explore Groceries"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Popular Items Section */}
        <section className="py-6 md:py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-5 md:mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  What&apos;s popular near you
                </h2>
                <p className="text-sm text-gray-500">
                  Trending bites HaveIt users are loving right now.
                </p>
              </div>
              {/* Arrow buttons in same line as subtitle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition-all"
                  aria-label="Previous items"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition-all"
                  aria-label="Next items"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>

            {/* Slider Container */}
            <div className="relative">
              {/* Slider Track */}
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
              >
                <div className="flex gap-4 pb-4">
                  {popularItems.map((item) => (
                    <article
                      key={item.name}
                      className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] snap-start"
                    >
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-[4/3]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                            aria-label={`Add ${item.name}`}
                          >
                            <PlusIcon size={16} />
                          </button>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{item.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-900">{item.price}</span>
                            <span className="inline-flex items-center gap-0.5 text-sm font-semibold text-orange-500">
                              <StarIcon size={14} />
                              {item.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Slider Progress Bar */}
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <span className="text-2xl font-bold text-orange-500">Haveit</span>
                <p className="text-gray-400 text-sm mt-1">Food. Groceries. Found it? HaveIt.</p>
              </div>
              <nav className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              </nav>
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">© 2025 Haveit. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

