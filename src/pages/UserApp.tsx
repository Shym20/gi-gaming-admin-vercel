import { useState, type JSX } from "react"
import { useApp } from "../context/AppContext"
import { Navigate } from "react-router-dom";

type ViewType = "home" | "bookings" | "rentals" | "wallet" | "profile"

function UserApp(): JSX.Element {
  const { users, token } = useApp();

  // ✅ AUTH CHECK
  if (!token) {
    return <Navigate to="/login" replace />
  }

  const [currentView, setCurrentView] = useState<ViewType>("home")

  // Mock user
  const currentUser = users?.[0]

  const navigate = (view: ViewType) => {
    setCurrentView(view)
  }

  const renderHome = () => (
    <div className="space-y-4">
      <div className="brutal-card p-6 bg-gradient-to-br from-[#00e5ff] to-[#00ff66]">
        <h2 className="text-2xl font-black uppercase mb-2">Welcome Back!</h2>
        <p className="font-mono text-sm">{currentUser?.name}</p>
      </div>

      <div className="brutal-card p-4 bg-white">
        <h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black pb-2">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button className="brutal-btn brutal-btn-primary brutal-hover p-3 text-xs">
            <i className="ph ph-calendar-plus text-xl mb-1"></i>
            <br />Book Now
          </button>

          <button className="brutal-btn brutal-btn-warning brutal-hover p-3 text-xs">
            <i className="ph ph-game-controller text-xl mb-1"></i>
            <br />Rent Console
          </button>
        </div>
      </div>

      <div className="brutal-card p-4 bg-white">
        <h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black pb-2">
          Recent Activity
        </h3>

        <p className="text-sm text-gray-600 font-mono">
          No recent bookings
        </p>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-4">
      <div className="brutal-card p-4 bg-white">
        <h2 className="font-black uppercase text-xl mb-4">My Bookings</h2>
        <p className="text-sm text-gray-600 font-mono">
          No active bookings
        </p>
      </div>
    </div>
  )

  const renderRentals = () => (
    <div className="space-y-4">
      <div className="brutal-card p-4 bg-white">
        <h2 className="font-black uppercase text-xl mb-4">My Rentals</h2>
        <p className="text-sm text-gray-600 font-mono">
          No active rentals
        </p>
      </div>
    </div>
  )

  const renderWallet = () => (
    <div className="space-y-4">
      <div className="brutal-card p-6 bg-[#00ff66]">
        <h3 className="font-mono text-xs font-bold uppercase mb-2">
          Current Balance
        </h3>

        <p className="text-4xl font-black">
          ₹{currentUser?.balance}
        </p>
      </div>

      <div className="brutal-card p-4 bg-white">
        <h3 className="font-bold uppercase text-sm mb-3">
          Add Money
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[100, 500, 1000].map((amount) => (
            <button
              key={amount}
              className="brutal-btn brutal-hover py-2 text-sm"
            >
              +₹{amount}
            </button>
          ))}
        </div>

        <button className="brutal-btn brutal-btn-success brutal-hover w-full">
          Custom Amount
        </button>
      </div>

      <div className="brutal-card p-4 bg-white">
        <h3 className="font-bold uppercase text-sm mb-3 border-b-2 border-black pb-2">
          Transaction History
        </h3>

        <p className="text-sm text-gray-600 font-mono">
          No transactions yet
        </p>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-4">
      <div className="brutal-card p-6 bg-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#00e5ff] border-2 border-black flex items-center justify-center font-black text-2xl brutal-shadow">
            {currentUser?.name?.charAt(0)}
          </div>

          <div>
            <h2 className="font-black uppercase text-xl">
              {currentUser?.name}
            </h2>

            <p className="text-sm font-mono text-gray-600">
              {currentUser?.phone}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t-2 border-black pt-4">
          <div className="flex justify-between">
            <span className="font-bold text-sm">Email</span>
            <span className="font-mono text-sm">
              {currentUser?.email}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-sm">Location</span>
            <span className="font-mono  text-xs">
              {currentUser?.location}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-bold text-sm">Total Bookings</span>
            <span className="font-mono text-sm">
              {currentUser?.bookings}
            </span>
          </div>
        </div>
      </div>

      <button className="brutal-btn brutal-btn-danger brutal-hover w-full">
        <i className="ph ph-sign-out"></i> Logout
      </button>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return renderHome()
      case "bookings":
        return renderBookings()
      case "rentals":
        return renderRentals()
      case "wallet":
        return renderWallet()
      case "profile":
        return renderProfile()
      default:
        return renderHome()
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center sm:p-8">
      <main className="mobile-shell">

        {/* Header */}
        <header className="bg-[#ffea00] border-b-4 border-black px-4 pt-7 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              GameHub
            </h1>
            <p className="font-mono text-[10px] font-bold uppercase mt-1">
              User App
            </p>
          </div>

          <div className="text-right">
            <div className="text-[10px] uppercase font-bold font-mono text-gray-700">
              Wallet
            </div>

            <div className="bg-white border-2 border-black px-3 py-1 text-sm font-black font-mono brutal-shadow">
              ₹{currentUser?.balance}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-28 subtle-grid">
          {renderContent()}
        </div>

        {/* Bottom Nav */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black px-4 py-3 flex justify-between">

          {(["home","bookings","rentals","wallet","profile"] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => navigate(view)}
              className={`nav-btn ${currentView === view ? "active" : ""}`}
            >
              <span className="capitalize">{view}</span>
            </button>
          ))}

        </nav>

      </main>
    </div>
  )
}

export default UserApp