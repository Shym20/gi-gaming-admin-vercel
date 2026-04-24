export interface LedgerEntry {
  id: string
  time: string
  type: string
  amount: number
  direction: "IN" | "OUT" | "NEUTRAL"
  method?: string
  note?: string
}

export const getLedgerRows = (rental: any): LedgerEntry[] => {
  const derived: LedgerEntry[] = []

  derived.push({
    id: `${rental.id}-BASE`,
    time: rental.contractDate
      ? `${rental.contractDate} 10:00 AM`
      : new Date().toLocaleString(),
    type: "BASE_RENTAL",
    amount: rental.basePrice || 0,
    direction: "IN",
    method: "-",
    note: "Base rental charge"
  })

  if ((rental.deposit || 0) > 0) {
    derived.push({
      id: `${rental.id}-DEP`,
      time: rental.contractDate
        ? `${rental.contractDate} 10:05 AM`
        : new Date().toLocaleString(),
      type: "DEPOSIT_HELD",
      amount: rental.deposit,
      direction: "IN",
      method: rental.depositMethod || "-",
      note: "Deposit currently held"
    })
  }

  if ((rental.extensionCharges || 0) > 0) {
    derived.push({
      id: `${rental.id}-EXT`,
      time: new Date().toLocaleString(),
      type: "EXTENSION",
      amount: rental.extensionCharges,
      direction: "IN",
      method: "-",
      note: "Extension charge"
    })
  }

  if ((rental.lateFee || 0) > 0) {
    derived.push({
      id: `${rental.id}-LATE`,
      time: new Date().toLocaleString(),
      type: "LATE_FEE",
      amount: rental.lateFee,
      direction: "IN",
      method: "-",
      note: "Late fee applied"
    })
  }

  if (rental.settlementSummary) {
    const bal = Number(rental.settlementSummary.balanceDue || 0)

    derived.push({
      id: `${rental.id}-SETTLE`,
      time: new Date().toLocaleString(),
      type: "SETTLEMENT",
      amount: Math.abs(bal),
      direction: bal > 0 ? "IN" : bal < 0 ? "OUT" : "NEUTRAL",
      method: rental.settlementSummary.method || "-",
      note:
        bal > 0
          ? "Collected from customer"
          : bal < 0
          ? "Refunded to customer"
          : "No net settlement"
    })
  }

  return derived
}

export const getDueDateLabel = (dueAt?: string) => {
  if (!dueAt) return "N/A"

  const due = new Date(dueAt)

  if (Number.isNaN(due.getTime())) return "Invalid date"

  return due.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  })
}
export const appendFinancialEvent = (
  rental: any,
  event: any
) => {
  if (!rental.financialEvents) {
    rental.financialEvents = []
  }

  rental.financialEvents.push({
    id: `${rental.id}-${Date.now()}`,
    time: new Date().toLocaleString(),
    ...event
  })
}