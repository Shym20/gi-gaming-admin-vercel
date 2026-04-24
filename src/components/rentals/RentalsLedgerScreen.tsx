import React from "react"
import { useApp } from "../../context/AppContext"
import RentalScreenTabs from "./RentalScreenTabs"
import { getLedgerRows, getDueDateLabel } from "../../utils/rentalLedgerUtils"

const RentalsLedgerScreen: React.FC = () => {
  const state = useApp()

  const selectedId =
    state.rentalLedgerRentalId || state.rentals?.[0]?.id

  const selectedRental = state.rentals.find(
    (r: any) => r.id === selectedId
  )

  if (!selectedRental) {
    return (
      <div className="space-y-6">
        <RentalScreenTabs activeScreen="ledger" />

        <div className="brutal-card p-10 text-center">
          <p className="font-black text-xl uppercase">
            No rentals available for ledger
          </p>
        </div>
      </div>
    )
  }

  const rows = getLedgerRows(selectedRental)

  let running = 0

  return (
    <div className="space-y-6">
      <RentalScreenTabs activeScreen="ledger" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase">
          Rental Ledger
        </h2>

        <div className="w-full sm:w-[420px]">
          <select
            className="brutal-input bg-white"
            value={selectedRental.id}
            onChange={(e) =>
              state.setRentalLedgerRentalId(e.target.value)
            }
          >
            {state.rentals.map((r: any) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.user} ({r.console})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="brutal-card p-4">
          <p className="font-mono text-xs uppercase text-gray-500">
            Rental
          </p>
          <p className="font-black text-xl">
            {selectedRental.id}
          </p>
        </div>

        <div className="brutal-card p-4">
          <p className="font-mono text-xs uppercase text-gray-500">
            Customer
          </p>
          <p className="font-black text-lg truncate">
            {selectedRental.user}
          </p>
        </div>

        <div className="brutal-card p-4">
          <p className="font-mono text-xs uppercase text-gray-500">
            Due At
          </p>
          <p className="font-black text-sm">
            {getDueDateLabel(selectedRental.dueAt)}
          </p>
        </div>

        <div className="brutal-card p-4">
          <p className="font-mono text-xs uppercase text-gray-500">
            Status
          </p>
          <p className="font-black text-sm">
            {selectedRental.status}
          </p>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="brutal-card overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead>
            <tr className="bg-[#00e5ff] border-b-4 border-black font-bold uppercase text-sm">
              <th className="p-3 border-r-2 border-black">Time</th>
              <th className="p-3 border-r-2 border-black">Type</th>
              <th className="p-3 border-r-2 border-black">Flow</th>
              <th className="p-3 border-r-2 border-black text-right">
                Amount
              </th>
              <th className="p-3 border-r-2 border-black">
                Method
              </th>
              <th className="p-3 border-r-2 border-black">
                Note
              </th>
              <th className="p-3 text-right">Running Total</th>
            </tr>
          </thead>

          <tbody className="font-mono text-sm">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500 font-bold uppercase"
                >
                  No ledger events found
                </td>
              </tr>
            ) : (
              rows.map((entry) => {
                if (entry.direction === "IN")
                  running += entry.amount

                if (entry.direction === "OUT")
                  running -= entry.amount

                const signed =
                  entry.direction === "OUT"
                    ? `-₹${entry.amount}`
                    : entry.direction === "IN"
                    ? `+₹${entry.amount}`
                    : `₹${entry.amount}`

                return (
                  <tr
                    key={entry.id}
                    className="border-b-2 border-black hover:bg-[#f4f4f0]"
                  >
                    <td className="p-3 border-r-2 border-black text-xs">
                      {entry.time}
                    </td>

                    <td className="p-3 border-r-2 border-black font-bold">
                      {entry.type}
                    </td>

                    <td className="p-3 border-r-2 border-black">
                      {entry.direction}
                    </td>

                    <td className="p-3 border-r-2 border-black text-right font-bold">
                      {signed}
                    </td>

                    <td className="p-3 border-r-2 border-black">
                      {entry.method || "-"}
                    </td>

                    <td className="p-3 border-r-2 border-black text-xs">
                      {entry.note || "-"}
                    </td>

                    <td className="p-3 text-right font-black">
                      {running >= 0 ? "+" : ""}₹{running}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RentalsLedgerScreen