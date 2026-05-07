export type KYCStatus = "PENDING" | "VERIFIED" | "REJECTED"
export type UserStatus = "ACTIVE" | "SUSPENDED"

export interface ChartData {
  day: string
  revenue: number
}

export interface Stats {
  revenue: number
  bookings: number
  activeRentals: number
  totalUsers: number
  chartData: ChartData[]
}

export interface SnackItem {
  name: string
  qty: number
}

export interface Booking {
  id: string
  userId: string
  user: string
  center: string
  slot: string
  status: string
  payment: string
  amount: number
  snacks: SnackItem[]
}

export interface RentalAccessory {
  item: string
  qty: number
  status: string
  penalty: number
}

export interface RentalTimeline {
  time: string
  text: string
}

export interface SettlementSummary {
  basePrice: number
  extraFees: number
  accPenalty: number
  totalCharges: number
  deposit: number
  balanceDue: number
  method: string
}

export interface Rental {
  id: string
  userId: string
  user: string
  console: string
  type: string
  basePrice: number
  extensionCharges: number
  lateFee: number
  deposit: number
  depositMethod: string
  status: string
  contractId: string | null
  contractDate: string | null
  dueAt: string
  accessories: RentalAccessory[]
  timeline: RentalTimeline[]
  settlementSummary?: SettlementSummary
}

export interface User {
  id: string
  name?: string
  email: string
  phone: string
  location: string
  aadhaar: string
  pan: string
  balance: number
  bookings: number
  joined: string
  kycStatus: KYCStatus   // ✅ FIXED
  status: UserStatus  
}

export interface Center {
  id: string
  name: string
  location: string
  pcs: number
  consoles: number
  status: string
}

export interface Product {
  id: string
  name: string
  mainCategory: string
  subCategory: string
  category: string
  productType: string
  serialNumber: string
  condition: string
  compatibleWith: string[]
  availability: string
  price: number
  stock: number
  status: string
}

export interface Snack {
  id: string
  name: string
  price: number
  stock: number
  status: string
}

export interface Transaction {
  id: string
  userId: string
  type: string
  amount: number
  date: string
  description: string
}
export interface AppState {
  token: string | null
  user: any | null
  currentRoute: string
  searchQuery: string
  productsScreen: string
  rentalsScreen: string
  rentalLedgerRentalId: string | null

  stats: Stats
  bookings: Booking[]
  rentals: Rental[]
  users: User[]
  // centers: Center[]
  products: Product[]
  rentalProducts: any[]
  snacks: Snack[]
  transactions: Transaction[]
}