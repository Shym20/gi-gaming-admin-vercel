// import { createContext, useContext, useState } from 'react'
// import type { ReactNode } from 'react'
// import type { User, AppContextType } from '../types/admin'
// import type { Booking } from '../types/booking'
// import {state} from '../data/initialState';

// const AppContext = createContext<AppContextType | undefined>(undefined)

// interface AppProviderProps {
//   children: ReactNode
// }

// export function AppProvider({ children }: AppProviderProps) {
//   const [user, setUser] = useState<User | null>(state.user)

//     const [bookings] = useState<Booking[]>(state.bookings)

//   const logout = () => {
//     setUser(null)
//   }

//   return (
//     <AppContext.Provider value={{ user, logout, bookings}}>
//       {children}
//     </AppContext.Provider>
//   )
// }

// export function useApp(): AppContextType {
//   const context = useContext(AppContext)
//   if (context === undefined) {
//     throw new Error('useApp must be used within an AppProvider')
//   }
//   return context
// }


import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"
import { initialState } from "../data/initialState"
import type { AppState } from "../types/apptypes"


interface User {
  phone: string
  role: string
}

interface AppContextType extends AppState {
  login: (phone: string) => void
  logout: () => void
  // rentalsScreen: "list" | "create" | "overdue" | "ledger"
  setSearchQuery: (query: string) => void
  setProductsScreen: (screen: string) => void
  setRentalsScreen: (screen: string) => void
  setRentalLedgerRentalId: (id: string | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp(): AppContextType {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }

  return context
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>(initialState);


  const login = (phone: string) => {
    console.log("Logging in with phone:", phone)
    setState((prev: AppState) => ({
      ...prev,
      token: "mock_token",
      user: { phone, role: "ADMIN" } as User
    }))

  }
  const logout = () => {
    setState((prev: AppState) => ({
      ...prev,
      token: null,
      user: null,
    }));
  };
  const setSearchQuery = (query: string) => {
    setState((prev: AppState) => ({ ...prev, searchQuery: query }))
  }
  const setProductsScreen = (screen: string) => {
    setState((prev: AppState) => ({ ...prev, productsScreen: screen }))
  }
  const setRentalsScreen = (screen: string) => {
    setState((prev: AppState) => ({ ...prev, rentalsScreen: screen }))
  }
  const setRentalLedgerRentalId = (id: string | null) => {
    setState((prev: AppState) => ({ ...prev, rentalLedgerRentalId: id }))
  }
  const value: AppContextType = {
    ...state,
    login,
    logout,
    setSearchQuery,
    setProductsScreen,
    setRentalsScreen,
    setRentalLedgerRentalId
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}