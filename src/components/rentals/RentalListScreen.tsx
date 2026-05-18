import React, { useEffect, useState } from "react"
import SearchBar from "../shared/Searchbar"
import RentalScreenTabs from "./RentalScreenTabs"
import StatusBadge from "../shared/StatusBadge"
import RentControlPanelModal from "./RentalControlPanel"
import UserRentalApi from "../../apis/user-rental.api"
import toast from "react-hot-toast"

const userRentalService = new UserRentalApi()

type UserRentalRow = {
    id?: string
    rentId: string
    userId: string
    userName: string
    product: string
    rentalProductName?: string
    startDate: string
    endDate: string
    deposit: string | number
    lateFee: string | number
    status: string
}

const RentalListScreen: React.FC = () => {
    const [rentals, setRentals] = useState<UserRentalRow[]>([])
    const [selectedRental, setSelectedRental] = useState<any | null>(null)
    const [detailLoadingId, setDetailLoadingId] = useState<string | null>(null)

    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)
    const [limit] = useState(10)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery.trim())
            setPage(1)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        fetchUserRentals()
    }, [page, debouncedSearch])

    const fetchUserRentals = async () => {
        try {
            setLoading(true)

            const res = await userRentalService.getAllUserRental(
                page,
                limit,
                debouncedSearch
            )

            if (res?.status === 200 && res?.data?.success) {
                setRentals(res.data.data || [])

                setTotal(res.data.pagination?.total || 0)
                setTotalPages(res.data.pagination?.totalPages || 1)
            } else {
                toast.error(res?.data?.message || "Failed to fetch rentals")
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong while fetching rentals")
        } finally {
            setLoading(false)
        }
    }

    const list = rentals

    const formatDate = (date?: string) => {
        if (!date) return "-"

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const handleOpenRentalDetail = async (r: UserRentalRow) => {
        const rentalId = r.id || r.rentId

        if (!rentalId) {
            toast.error("Rental id not found")
            return
        }

        try {
            setDetailLoadingId(rentalId)

            const res = await userRentalService.getUserRentalDetail(rentalId)

            if (res?.status === 200 && res?.data?.success) {
                setSelectedRental({
                    id: rentalId,
                    rentId: r.rentId,
                    ...res.data.data,
                    raw: r,
                })
            } else {
                toast.error(res?.data?.message || "Failed to fetch rental detail")
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong while fetching rental detail")
        } finally {
            setDetailLoadingId(null)
        }
    }

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
                            <th className="p-4 border-r-2 border-black">Due At</th>
                            <th className="p-4 border-r-2 border-black">Deposit</th>
                            <th className="p-4 border-r-2 border-black">Late Fee</th>
                            <th className="p-4 border-r-2 border-black">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="font-mono text-sm">
                        {loading ? (
                            [...Array(6)].map((_, index) => (
                                <tr key={index} className="border-b-2 border-black animate-pulse">
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 w-20"></div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-300 w-44"></div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 w-28"></div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                                    </td>
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-6 bg-gray-300 w-28"></div>
                                    </td>
                                    <td className="p-4">
                                        <div className="h-8 bg-gray-300 w-20 mx-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : list.length === 0 ? (
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
                                    key={r.rentId}
                                    className="border-b-2 border-black hover:bg-[#f4f4f0]"
                                >
                                    <td className="p-4 border-r-2 border-black font-bold">
                                        {r.rentId}
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="font-sans font-bold uppercase text-xs text-blue-600">
                                            {r.userName || "Unknown"}
                                        </div>
                                        <div className="text-gray-600">{r.product || "-"}</div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black font-mono text-xs">
                                        <div>
                                            <span className="font-black">Start:</span>{" "}
                                            {formatDate(r.startDate)}
                                        </div>
                                        <div>
                                            <span className="font-black">End:</span>{" "}
                                            {formatDate(r.endDate)}
                                        </div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black text-right font-bold">
                                        ₹{Number(r.deposit || 0)}
                                    </td>

                                    <td
                                        className={`p-4 border-r-2 border-black text-right font-bold ${Number(r.lateFee || 0) > 0 ? "text-[#ff3366]" : ""
                                            }`}
                                    >
                                        ₹{Number(r.lateFee || 0)}
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <StatusBadge status={r.status} />
                                    </td>

                                    <td className="p-4 text-center flex justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenRentalDetail(r)}
                                            disabled={detailLoadingId === (r.id || r.rentId)}
                                            className="brutal-btn brutal-btn-secondary px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {detailLoadingId === (r.id || r.rentId) ? (
                                                <i className="ph ph-spinner-gap animate-spin text-lg"></i>
                                            ) : (
                                                <i className="ph ph-eye text-lg"></i>
                                            )}
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
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-2 border-black p-4 brutal-shadow">
                    <div className="font-mono text-sm font-bold">
                        Showing page {page} of {totalPages} • Total {total}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            className="brutal-btn brutal-btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1

                            return (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    disabled={loading}
                                    className={`border-2 border-black px-3 py-2 font-black shadow-[3px_3px_0px_#000] ${page === pageNumber
                                        ? "bg-[#ffe600]"
                                        : "bg-white"
                                        }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        })}

                        <button
                            type="button"
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            className="brutal-btn brutal-btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {selectedRental && (
                <RentControlPanelModal
                    rental={selectedRental}
                    onClose={() => setSelectedRental(null)}
                />
            )}

        </div>
    )
}

export default RentalListScreen