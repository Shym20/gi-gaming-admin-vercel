import React, { useEffect } from "react"
import { useApp } from "../../context/AppContext"

import RentalsCreateScreen from "../rentals/RentalsCreateScreen"
import RentalsOverdueScreen from "../rentals/RentalsOverdueScreen"
import RentalsLedgerScreen from "../rentals/RentalsLedgerScreen"
import RentalsListScreen from "../rentals/RentalListScreen"

import { refreshOverdueStatuses } from "../../utils/rentalStatusUtils"

const Rentals: React.FC = () => {
  const state = useApp()

  useEffect(() => {
    refreshOverdueStatuses(state.rentals)
  }, [state.rentals])

  const current = state.rentalsScreen || "list"

  const renderRentals = () => {
    switch (current) {
      case "create":
        return <RentalsCreateScreen />

      case "overdue":
        return <RentalsOverdueScreen />

      case "ledger":
        return <RentalsLedgerScreen />

      default:
        return <RentalsListScreen />
    }
  }

  return <>{renderRentals()}</>
}

export default Rentals