export const RENTAL_STATUS = {
  ACTIVE: "ACTIVE",
  OVERDUE: "OVERDUE",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED"
} as const

export type RentalStatus =
  (typeof RENTAL_STATUS)[keyof typeof RENTAL_STATUS]