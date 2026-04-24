import React from "react"
import { useApp } from "../../context/AppContext"
import SearchBar from "../shared/Searchbar"
import RentalScreenTabs from "./RentalScreenTabs"
import StatusBadge from "../shared/StatusBadge"


const RentalListScreen: React.FC = () => {
    const { rentals, searchQuery, setSearchQuery } = useApp()

    const query = searchQuery.trim().toLowerCase()

    const list = rentals.filter(
        (r) =>
            r.id.toLowerCase().includes(query) ||
            r.user.toLowerCase().includes(query)
    )

    return (
        <div className="space-y-6">
            <RentalScreenTabs activeScreen="list" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
                <h2 className="text-2xl font-black uppercase">
                    Rentals Management
                </h2>

                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search Rentals or User..."
                />
            </div>

            {/* Table */}
            <div className="brutal-card overflow-x-auto">
                <table className="w-full text-left min-w-[980px] border-2 border-black">
                    <thead>
                        <tr className="bg-[#00e5ff] border-b-4 border-black font-bold uppercase text-sm">
                            <th className="p-4 border-r-2 border-black">ID</th>
                            <th className="p-4 border-r-2 border-black">User & Console</th>
                            <th className="p-4 border-r-2 border-black">Type</th>
                            <th className="p-4 border-r-2 border-black">Due At</th>
                            <th className="p-4 border-r-2 border-black text-right">Deposit</th>
                            <th className="p-4 border-r-2 border-black text-right">Late Fee</th>
                            <th className="p-4 border-r-2 border-black">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="font-mono text-sm">
                        {list.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="p-8 text-center text-gray-500 font-bold uppercase"
                                >
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            list.map((r) => (
                                <tr
                                    key={r.id}
                                    className="border-b-2 border-black hover:bg-[#f4f4f0]"
                                >
                                    <td className="p-4 border-r-2 border-black font-bold">
                                        {r.id}
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="font-sans font-bold uppercase text-xs text-blue-600">
                                            {r.user}
                                        </div>
                                        <div className="text-gray-600">{r.console}</div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        {r.type}
                                    </td>

                                    <td className="p-4 border-r-2 border-black font-mono text-xs">
                                        {r.dueAt}
                                    </td>

                                    <td className="p-4 border-r-2 border-black text-right font-bold">
                                        ₹{r.deposit}
                                        <div className="text-[10px] text-gray-500 font-normal">
                                            ({r.depositMethod})
                                        </div>
                                    </td>

                                    <td
                                        className={`p-4 border-r-2 border-black text-right font-bold ${r.lateFee > 0 ? "text-[#ff3366]" : ""
                                            }`}
                                    >
                                        ₹{r.lateFee}
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <StatusBadge status={r.status} />
                                    </td>

                                    <td className="p-4 text-center flex justify-center gap-2">
                                        <button className="brutal-btn brutal-btn-secondary px-2 py-1">
                                            <i className="ph ph-eye text-lg"></i>
                                        </button>

                                        <button className="brutal-btn brutal-btn-warning px-2 py-1">
                                            <i className="ph ph-receipt text-lg"></i>
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

export default RentalListScreen