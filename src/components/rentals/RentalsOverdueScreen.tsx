import React from "react"
import { useApp } from "../../context/AppContext"
import RentalsScreenTabs from "./RentalScreenTabs"
import SearchBar from "../shared/Searchbar"

import {
  getOverdueBucket,
  getDueDateLabel
} from "../../utils/rentalOverdueUtils"

import { getOverdueRentals } from "../../utils/getOverdueRentals"
import { RENTAL_STATUS } from "../../constants/rentalStatus"
import { getOverdueHours } from "../../utils/rentalTimeUtils"


const RentalsOverdueScreen: React.FC = () => {
  const state = useApp()

  const query = state.searchQuery.trim().toLowerCase()

  const overdueRows = getOverdueRentals(state, getOverdueHours).filter(
    ({ rental }: any) =>
      rental.id.toLowerCase().includes(query) ||
      rental.user.toLowerCase().includes(query) ||
      rental.console.toLowerCase().includes(query)
  )

  const buckets = {
    "0-24h": 0,
    "1-3d": 0,
    "3d+": 0
  }

  overdueRows.forEach(({ overdueHours }: any) => {
    const bucket = getOverdueBucket(overdueHours)
    buckets[bucket as keyof typeof buckets] += 1
  })

  return (
    <div className="space-y-6">
      <RentalsScreenTabs activeScreen="overdue" />

      {/* Bucket cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="brutal-card p-4 bg-[#ffea00]">
          <p className="font-mono text-xs uppercase">0-24 Hours</p>
          <p className="text-3xl font-black">{buckets["0-24h"]}</p>
        </div>

        <div className="brutal-card p-4 bg-[#ff3366] text-white">
          <p className="font-mono text-xs uppercase">1-3 Days</p>
          <p className="text-3xl font-black">{buckets["1-3d"]}</p>
        </div>

        <div className="brutal-card p-4 bg-black text-white">
          <p className="font-mono text-xs uppercase">3+ Days</p>
          <p className="text-3xl font-black">{buckets["3d+"]}</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase">
          Overdue Rental Board
        </h2>

        <SearchBar
          value={state.searchQuery}
          onChange={state.setSearchQuery}
          placeholder="Search overdue by ID/User/Console..."
        />
      </div>

      {/* Table */}
      <div className="brutal-card overflow-x-auto">
        <table className="w-full min-w-[960px] text-left border-collapse">
          <thead>
            <tr className="bg-[#ff3366] text-white border-b-4 border-black font-bold uppercase text-sm">
              <th className="p-3 border-r-2 border-black">ID</th>
              <th className="p-3 border-r-2 border-black">
                User & Console
              </th>
              <th className="p-3 border-r-2 border-black">Due At</th>
              <th className="p-3 border-r-2 border-black">Overdue</th>
              <th className="p-3 border-r-2 border-black text-right">
                Late Fee
              </th>
              <th className="p-3 border-r-2 border-black">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="font-mono text-sm">
            {overdueRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500 font-bold uppercase"
                >
                  No overdue rentals found
                </td>
              </tr>
            ) : (
              overdueRows.map(({ rental, overdueHours }: any) => (
                <tr
                  key={rental.id}
                  className="border-b-2 border-black hover:bg-[#f4f4f0]"
                >
                  <td className="p-3 border-r-2 border-black font-bold">
                    {rental.id}
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="font-sans font-bold uppercase text-xs text-blue-600">
                      {rental.user}
                    </div>
                    <div className="text-gray-600">
                      {rental.console}
                    </div>
                  </td>

                  <td className="p-3 border-r-2 border-black font-mono text-xs">
                    {getDueDateLabel(rental.dueAt)}
                  </td>

                  <td className="p-3 border-r-2 border-black font-bold text-[#ff3366]">
                    {Math.ceil(overdueHours)}h
                  </td>

                  <td className="p-3 border-r-2 border-black text-right font-bold">
                    ₹{rental.lateFee}
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    {RENTAL_STATUS.OVERDUE}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button className="brutal-btn brutal-btn-warning px-2 py-1 text-xs">
                      💰
                    </button>

                    <button className="brutal-btn brutal-btn-secondary px-2 py-1 text-xs">
                      🔔
                    </button>

                    <button className="brutal-btn bg-black text-white px-2 py-1 text-xs">
                      👁
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RentalsOverdueScreen