import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext'
import type { NavItem, AdminLayoutProps } from '../types/admin'
import { useDispatch } from 'react-redux';
import { updateToken, updateUser } from '../redux/redux-slice/user.slice';
import { getUserLocal, setTokenLocal, setUserLocal } from '../utils/localStorage.utils';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';
import NotificationModal from './notification/notificationModal';

function AdminLayout({ children }: AdminLayoutProps): React.ReactElement {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useApp()

  const user = getUserLocal();

  console.log("AdminLayout User:", user);

  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const navItems: NavItem[] = [
    { route: 'dashboard', icon: 'ph-chart-bar', label: 'Dashboard' },
    { route: 'bookings', icon: 'ph-calendar-blank', label: 'Bookings' },
    { route: 'rentals', icon: 'ph-game-controller', label: 'Rentals' },
    { route: 'users', icon: 'ph-users', label: 'Users' },
    { route: 'centers', icon: 'ph-package', label: 'Centers' },
    { route: 'categories', icon: 'ph-squares-four', label: 'Categories' },
    { route: 'products', icon: 'ph-gear', label: 'Products' },
    { route: 'snacks', icon: 'ph-popcorn', label: 'Snacks' },
    { route: 'reports', icon: 'ph-warning-circle', label: 'Reports' }
  ]

  const isActive = (route: string): boolean => {
    return location.pathname.includes(route)
  }

  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    // Clear Redux
    dispatch(updateToken(null));
    dispatch(updateUser(null));

    // Clear localStorage
    setTokenLocal(null);
    setUserLocal(null);

    //clear cookies
    Cookies.remove("giGamingAdmin_auth_token", { path: "/" });
    Cookies.remove("gi-gaming-admin_ufo", { path: "/" });

    // Clear context
    logout();

    // Redirect
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <aside
        className={`
    fixed md:static top-0 left-0
    h-screen md:h-screen
    w-[280px] md:w-64
    bg-white
    border-r-4 border-black
    z-50
    flex flex-col
    transition-transform duration-300
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        <div className="p-6 border-b-4 border-black bg-[#ffe600] flex justify-between items-start">

          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
              GAMEHUB
            </h1>

            <p className="font-mono text-[10px] font-bold mt-1 uppercase">
              Admin Portal
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-3xl font-black leading-none"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                navigate(`/admin/${item.route}`);
                setSidebarOpen(false);
              }}
              className={`nav-item ${isActive(item.route) ? 'active' : ''}`}
            >
              <i className={`ph ${item.icon} text-lg`}></i> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-4 border-black bg-gray-50">
          <div className="flex items-center mb-4 gap-3">
            <div className="w-10 h-10 bg-[#00e5ff] border-2 border-black flex items-center justify-center font-bold font-mono brutal-shadow">
              A
            </div>
            <div className="">
              <p className="font-bold text-sm uppercase truncate">{user?.phone}</p>
              <p className="text-xs font-mono text-gray-500">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="brutal-btn brutal-btn-danger brutal-hover w-full flex justify-center items-center gap-2"
          >
            <i className="ph ph-sign-out text-lg"></i> Logout
          </button>
        </div>
      </aside>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b-4 border-black p-4 flex justify-between items-center z-30 flex-shrink-0">

          {/* Left Side */}
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden border-2 border-black p-2 bg-[#ffe600]"
            >
              <i className="ph ph-list text-2xl"></i>
            </button>

            <h1 className="text-2xl sm:hidden block ml-3 font-black uppercase tracking-tighter leading-none">
              GAMEHUB
            </h1>

            <div className="font-mono font-bold text-sm hidden sm:block ml-4">
              {dateStr}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Notification */}
            <button
              type="button"
              onClick={() => setNotificationOpen(true)}
              className="relative sm:flex items-center justify-center border-2 border-black bg-white w-9 h-9 shadow-[2px_2px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
              title="Notifications"
            >
              <i className="ph ph-bell text-xl"></i>

              {/* Badge */}
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-[#ff3366] text-white border-2 border-black rounded-full text-[10px] font-black flex items-center justify-center leading-none">
                3
              </span>
            </button>

            {/* Wallet */}
            <div
              onClick={() => navigate("/admin/wallet")}
              className="hidden sm:flex items-center border-2 border-black bg-[#ffe600] px-3 py-1 shadow-[2px_2px_0px_#000] cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <i className="ph ph-wallet text-lg mr-2"></i>

              <span className="font-mono text-xs font-bold uppercase">
                ₹100
              </span>
            </div>
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff66] border border-black"></span>
              </span>

              <span className="font-mono text-xs font-bold uppercase">
                System Online
              </span>
            </div>

          </div>
        </header>

        {notificationOpen && (
          <NotificationModal onClose={() => setNotificationOpen(false)} />
        )}

        <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-[#f4f4f0] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
