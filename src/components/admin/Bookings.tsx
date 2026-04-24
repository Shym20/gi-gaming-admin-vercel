import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import StatusBadge from "../shared/StatusBadge"
import SearchBar from "../shared/Searchbar"
import type { Booking } from "../../types/booking"

const tableHeaders = [
    { label: "ID", className: "p-4 border-r-2 border-black" },
    { label: "User", className: "p-4 border-r-2 border-black" },
    { label: "Center & Slot", className: "p-4 border-r-2 border-black" },
    { label: "Status", className: "p-4 border-r-2 border-black" },
    { label: "Payment", className: "p-4 border-r-2 border-black" },
    { label: "Amount", className: "p-4 border-r-2 border-black text-right" },
    { label: "Actions", className: "p-4 text-center" }
]

const Bookings: React.FC = () => {
    const { bookings } = useApp()

    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

    const filteredBookings = bookings.filter((b: Booking) =>
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user.toLowerCase().includes(searchQuery.toLowerCase())
    )


    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
                <h2 className="text-2xl font-black uppercase ">
                    Bookings Management
                </h2>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search ID or User..."
                />
            </div>

            {/* Table */}
            <div className="brutal-card overflow-x-auto">
                <table className="w-full text-left  min-w-[800px] border-2 border-black">

                    <thead >
                        <tr className="bg-[#00e5ff] border-b-4 py-4 border-black font-bold uppercase text-sm">
                            {tableHeaders.map((header, index) => (
                                <th key={index} className={header.className}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="font-mono text-sm">
                        {filteredBookings.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-8 text-center text-gray-500 font-bold uppercase"
                                >
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map((b: Booking) => (
                                <tr
                                    key={b.id}
                                    className="border-b-2 border-black hover:bg-[#f4f4f0] transition-colors"
                                >
                                    <td className="p-4 border-r-2 border-black font-bold">
                                        {b.id}
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="font-sans font-bold uppercase text-xs text-blue-600">
                                            {b.user}
                                        </div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="font-sans font-bold uppercase text-xs">
                                            {b.center}
                                        </div>
                                        <div className="text-gray-600">{b.slot}</div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <StatusBadge status={b.status} />
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <StatusBadge status={b.payment} />
                                    </td>

                                    <td className="p-4 border-r-2 border-black text-right font-bold">
                                        ₹{b.amount}
                                    </td>

                                    <td className="p-4 text-center flex justify-center gap-2">
                                        <button
                                            onClick={() => setSelectedBooking(b)}
                                            className="brutal-btn brutal-btn-secondary brutal-hover px-2 py-1"
                                        >
                                            <i className="ph ph-eye text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="brutal-card bg-white p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                            <h3 className="text-xl font-black uppercase">
                                Booking Details: {selectedBooking?.id}
                            </h3>

                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="brutal-btn brutal-hover px-3 py-1"
                            >
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

export default Bookings