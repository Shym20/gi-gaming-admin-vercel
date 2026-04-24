export interface TimelineEvent {
  time: string
  text: string
}
export interface FinancialEvent {
  id?: string
  time?: string
  type: string
  amount: number
  direction: "IN" | "OUT" | "NEUTRAL"
  method?: string
  note?: string
}
export interface Rental {
  id: string
  user: string
  console: string
  status: string
  dueAt?: string
  timeline: TimelineEvent[]
  financialEvents?: any[]
}