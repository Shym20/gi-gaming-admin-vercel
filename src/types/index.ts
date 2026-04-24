
export interface AppState {
  token: string | null;
  user: any | null;
  currentRoute: string;
  searchQuery: string;
  productsScreen: string;
  rentalsScreen: string;
  rentalLedgerRentalId: string | null;

  stats: any;
  bookings: any[];
  rentals: any[];
  users: any[];
  centers: any[];
  products: any[];
  rentalProducts: any[];
  snacks: any[];
  transactions: any[];
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  icon: string;
  color: 'green' | 'yellow' | 'cyan' | 'pink';
  bgClass: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface RevenueData {
  day: string;
  amount: number;
}

export interface Booking {
  id: number;
  userId: number;
  productId: number;
  date: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
}
