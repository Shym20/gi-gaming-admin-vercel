import React from "react"

interface StatusBadgeProps {
  status?: string
  kycStatus?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {

  const getStatusStyle = (status?: string): string => {
    const upperStatus = status?.toUpperCase()

    const styles: Record<string, string> = {
      ACTIVE: "bg-[#00ff66] text-black",
      PENDING: "bg-[#ffea00] text-black",
      COMPLETED: "bg-[#00e5ff] text-black",
      CANCELLED: "bg-red-500 text-black",
      REFUNDED: "bg-gray-200 text-black",
      PAID: "bg-[#00ff66] text-black",
      OVERDUE: "bg-[#ff3366] text-white",
      RETURNED: "bg-gray-300 text-black",
      VERIFIED: "bg-[#00ff66] text-black",
      REJECTED: "bg-[#ff3366] text-white",
      SUSPENDED: "bg-[#ff3366] text-white",
      IN_STOCK: "bg-[#00ff66] text-black",
      OUT_OF_STOCK: "bg-red-200 text-black",
      MAINTENANCE: "bg-[#ffea00] text-black",
      DELIVERY: "bg-[#00e5ff] text-black",
      PICKUP: "bg-[#ffea00] text-black",
    }

    return styles[upperStatus || ""] || "bg-gray-200 text-black"
  }
 

  if (!status) return null

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-bold font-mono uppercase border-2 border-black ${getStatusStyle(
        status
      )}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge