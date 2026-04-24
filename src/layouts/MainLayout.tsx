import React from 'react'
import Sidebar from '../components/common/Sidebar'
import Header from '../components/common/Header'

interface MainLayoutProps {
  activeMenu: string
  onMenuChange: (menuId: string) => void
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({
  activeMenu,
  onMenuChange,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={onMenuChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-[#f4f4f0]">
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout
