import { useNavigate } from 'react-router-dom'
import { Home, TrendingUp, BarChart3, Settings } from 'lucide-react'

export default function PartnerLanding() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center gap-2">
              <Home size={20} className="text-orange-500" />
              <span className="text-xl font-bold text-gray-900">HaveIt Partner</span>
            </div>

            {/* Right side */}
            <button
              type="button"
              onClick={() => navigate('/partner/login')}
              className="px-4 py-2 text-orange-500 border border-orange-500 rounded-full font-medium hover:bg-orange-50 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Grow your restaurant with{' '}
                <span className="text-orange-500">HaveIt</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Reach more customers, increase orders, and manage everything in one place
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate('/partner/login')}
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-full font-medium hover:bg-orange-50 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/partner/register')}
                className="px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
              >
                Register Your Restaurant
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN - Dashboard Preview */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-orange-500 p-4">
                <h3 className="text-white font-semibold text-sm">Dashboard Preview</h3>
                <p className="text-white/80 text-xs">Restaurant Analytics</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-4">
                    <p className="text-gray-600 text-xs mb-1">Today's Orders</p>
                    <p className="text-2xl font-bold text-orange-500">45</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-gray-600 text-xs mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹12,450</p>
                  </div>
                </div>
                
                {/* Skeleton list items */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded w-4/5 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - FEATURES */}
        <div className="mt-20 py-12 border-t border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <TrendingUp size={32} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">More Orders</h3>
              <p className="text-gray-600 text-sm">
                Access thousands of hungry customers looking for great food
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 size={32} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-gray-600 text-sm">
                Track sales, popular items, and customer preferences with detailed insights
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
                <Settings size={32} className="text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Easy Management</h3>
              <p className="text-gray-600 text-sm">
                Update menu, manage orders, and control your restaurant from anywhere
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
