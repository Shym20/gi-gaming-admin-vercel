import { RENTAL_STATUS } from "../constants/rentalStatus"

export const getOverdueRentals = (state: any, getOverdueHours: any) => {
  return state.rentals
    .filter(
      (r: any) =>
        r.status === RENTAL_STATUS.OVERDUE ||
        (r.status === RENTAL_STATUS.ACTIVE && getOverdueHours(r) > 0)
    )
    .map((r: any) => ({
      rental: r,
      overdueHours: getOverdueHours(r)
    }))
}