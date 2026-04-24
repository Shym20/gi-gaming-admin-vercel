export const getOverdueHours = (rental: any): number => {
  if (!rental?.dueAt) return 0

  const due = new Date(rental.dueAt).getTime()
  const now = Date.now()

  const diffMs = now - due

  if (diffMs <= 0) return 0

  return diffMs / (1000 * 60 * 60)
}
export const getTimestamp = (): string => {
  return new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  })
}