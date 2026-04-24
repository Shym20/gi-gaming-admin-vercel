export const getOverdueBucket = (hours: number): string => {
  if (hours <= 24) return "0-24h"
  if (hours <= 72) return "1-3d"
  return "3d+"
}

export const getDueDateLabel = (dueAt: string | Date | undefined): string => {
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