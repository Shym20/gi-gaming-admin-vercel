import type { AppState } from "../types/apptypes"

export const initialState: AppState = {
  token: null,
  user: null,
  currentRoute: "dashboard",
  searchQuery: "",
  productsScreen: "inventory",
  rentalsScreen: "list",
  rentalLedgerRentalId: null,

  stats: {
    revenue: 0,
    bookings: 0,
    activeRentals: 0,
    totalUsers: 0,
    chartData: []
  },

  bookings: [],
  rentals: [],
  users: [],
  centers: [],
  products: [],
  rentalProducts: [],
  snacks: [],
  transactions: []
}