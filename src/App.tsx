// import { useState } from 'react'
// import MainLayout from './layouts/MainLayout'
// import Dashboard from './pages/Dashboard'
// import Bookings from './pages/Booking'

// type MenuType = 'dashboard' | 'bookings' | 'rentals' | 'users' | 'centers' | 'products' | 'snacks'

// function App() {
//   const [activeMenu, setActiveMenu] = useState<MenuType>('dashboard')

//   const handleMenuChange = (menuId: string) => {
//     setActiveMenu(menuId as MenuType)
//   }

//   const renderPage = () => {
//     switch (activeMenu) {
//       case 'dashboard':
//         return <Dashboard />
//       case 'bookings':
//         return <Bookings/>

//       default:
//         return (
//           <div className="bg-white p-8 rounded-lg border-4 border-black">
//             <h2 className="text-2xl font-bold mb-4">{activeMenu.toUpperCase()} Page</h2>
//             <p className="text-gray-600">Coming soon...</p>
//           </div>
//         )
//     }
//   }

//   return (
//     <MainLayout
    
//       activeMenu={activeMenu}
//       onMenuChange={handleMenuChange}
//     >
//       {renderPage()}
//     </MainLayout>
//   )
// }

// export default App
import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import { AppProvider } from "./context/AppContext"
import AdminApp from "./pages/AdminApp"
import UserApp from "./pages/UserApp"
import Login from "./components/Login"
import { Toaster } from "react-hot-toast"

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>

      <Toaster position="top-right" reverseOrder={false} />

        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* User */}
          <Route path="/user/*" element={<UserApp />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
