import type { Booking } from "./booking";

export interface NavItem {
  route: string
  icon: string
  label: string
}

export interface User {
  phone?: string
  role?: string
}

export interface AppContextType {
  user: User | null
  logout: () => void
   bookings: Booking[]
}

export interface AdminLayoutProps {
  children: React.ReactNode
}
