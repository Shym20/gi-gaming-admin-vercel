export interface Snack {
  name: string
  qty: number
}

export interface Booking {
  id: string
  user: string
  center: string
  slot: string
  status: string
  payment: string
  amount: number
  snacks?: Snack[]
}