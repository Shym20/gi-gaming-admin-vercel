import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext'
import type { NavItem, AdminLayoutProps } from '../types/admin'
import { useDispatch } from 'react-redux';
import { updateToken, updateUser } from '../redux/redux-slice/user.slice';
import { getUserLocal, setTokenLocal, setUserLocal } from '../utils/localStorage.utils';
import Cookies from "js-cookie";
import toast from 'react-hot-toast';

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
    { route: 'products', icon: 'ph-gear', label: 'Products' },
    { route: 'snacks', icon: 'ph-popcorn', label: 'Snacks' }
  ]

  const isActive = (route: string): boolean => {
    return location.pathname.includes(route)
  }

  const dispatch = useDispatch();

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
      <aside className="flex flex-col w-full md:w-64 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black md:min-h-screen z-40">
        <div className="p-6 border-b-4 border-black bg-[#ffe600]">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">GAMEHUB</h1>
          <p className="font-mono text-[10px] font-bold mt-1 uppercase">Admin Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(`/admin/${item.route}`)}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white border-b-4 border-black p-4 flex justify-between items-center z-30 flex-shrink-0">
          <div className="font-mono font-bold text-sm hidden sm:block">{dateStr}</div>
          <div className="flex items-center gap-4 ml-auto">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff66] border border-black"></span>
            </span>
            <span className="font-mono text-xs font-bold uppercase">System Online</span>
          </div>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto flex-1 bg-[#f4f4f0]">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
