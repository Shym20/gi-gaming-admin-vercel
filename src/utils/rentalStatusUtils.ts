import type { Rental, FinancialEvent } from "../types/rental"
import { RENTAL_STATUS } from "../constants/rentalStatus"
import { getOverdueHours } from "./rentalTimeUtils"
import { getTimestamp  } from "./rentalTimeUtils"
import { appendFinancialEvent } from "./rentalLedgerUtils"

export const refreshOverdueStatuses = (rentals: Rental[]): void => {
  rentals.forEach((r) => {
    if (r.status === RENTAL_STATUS.ACTIVE && getOverdueHours(r) > 0) {
      r.status = RENTAL_STATUS.OVERDUE

      r.timeline.push({
        time: getTimestamp(),
        text: "Rental auto-marked as OVERDUE based on due date."
      })

      const event: FinancialEvent = {
        type: "STATUS",
        amount: 0,
        direction: "NEUTRAL",
        method: "-",
        note: "Rental status changed to OVERDUE by due-date rule."
      }

      appendFinancialEvent(r, event)
    }
  })
}