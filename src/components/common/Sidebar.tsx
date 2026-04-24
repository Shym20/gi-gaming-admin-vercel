import React from 'react'
import { useApp } from '../../context/AppContext'
import {
  ChartBar,
  CalendarBlank,
  GameController,
  Users,
  Package,
  Gear,
  Popcorn,
  SignOut,
} from '@phosphor-icons/react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface SidebarProps {
  activeMenu: string
  onMenuChange: (menuId: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const { user, logout } = useApp()

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'DASHBOARD', icon: <ChartBar size={20} weight="bold" /> },
    { id: 'bookings', label: 'BOOKINGS', icon: <CalendarBlank size={20} weight="bold" /> },
    { id: 'rentals', label: 'RENTALS', icon: <GameController size={20} weight="bold" /> },
    { id: 'users', label: 'USERS', icon: <Users size={20} weight="bold" /> },
    { id: 'centers', label: 'CENTERS', icon: <Package size={20} weight="bold" /> },
    { id: 'products', label: 'PRODUCTS', icon: <Gear size={20} weight="bold" /> },
    { id: 'snacks', label: 'SNACKS', icon: <Popcorn size={20} weight="bold" /> },
  ]

  const handleLogout = () => {
    
    logout()
  }

  return (
    <aside className="flex flex-col w-full md:w-72 bg-white border-b-4 md:border-b-0 md:border-r-4 border-black md:min-h-screen z-40">
      {/* Logo Section */}
      <div className="p-6 border-b-4 border-black bg-[#ffe600]">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
          GAMEHUB
        </h1>
        <p className="font-mono text-[10px] font-bold mt-1 uppercase">Admin Portal</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`w-full text-left px-6 py-3 rounded-md transition-all font-semibold flex items-center gap-3 ${
              activeMenu === item.id
                ? 'bg-black text-white border-2 border-black'
                : 'text-black hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t-4 border-black bg-gray-50">
        <div className="flex items-center gap-3 mb-4">
          <div  className="w-10 h-10 bg-[#00e5ff] border-2 border-black flex items-center justify-center font-bold font-mono brutal-shadow">
            {user?.role?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm uppercase truncate">{user?.phone || '9000765555'}</p>
            <p className="text-xs font-mono text-gray-500">{user?.role || 'ADMIN'}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="brutal-btn brutal-btn-danger brutal-hover w-full flex justify-center items-center gap-2"
        >
          <SignOut size={20} weight="bold" />
          LOGOUT
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
