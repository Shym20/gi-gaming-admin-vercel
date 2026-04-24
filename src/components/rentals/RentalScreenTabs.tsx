import React from "react"
import { useApp } from "../../context/AppContext"

interface Tab {
  key: string
  label: string
  icon: string
}

interface Props {
  activeScreen: string
}

const RentalScreenTabs: React.FC<Props> = ({ activeScreen }) => {
  const { setRentalsScreen } = useApp()

  const tabs: Tab[] = [
    { key: "list", label: "RENTAL LIST", icon: "ph-list" },
    { key: "create", label: "CREATE RENTAL", icon: "ph-plus-circle" },
    { key: "overdue", label: "OVERDUE BOARD", icon: "ph-warning-circle" },
    { key: "ledger", label: "RENTAL LEDGER", icon: "ph-receipt" }
  ]

  return (
    <div className="bg-white text-black   p-4 border-2 border-black  
              flex flex-wrap gap-3 translate-x-[2px] translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,0.9)]">
      {tabs.map((tab) => {
        const isActive = tab.key === activeScreen

        return (
          <button
            key={tab.key}
            onClick={() => setRentalsScreen(tab.key)}
            className={`
              flex items-center gap-2
              px-4 py-2
              text-xs font-bold uppercase
              border-2 border-black
              transition-all
              ${isActive ? "bg-black text-white translate-x-[2px] translate-y-[2px] shadow-[4px_4px_0_rgba(0,0,0,0.9)]" : "bg-white text-black hover:bg-gray-100 translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0_rgba(0,0,0,0.9)]"}
            `}
          >
            <i className={`ph ${tab.icon} text-sm`} />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RentalScreenTabs