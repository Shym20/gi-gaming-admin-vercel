import React, { useEffect, useState } from "react";
import RentalsScreenTabs from "./RentalScreenTabs";
import SearchBar from "../shared/Searchbar";
import UserRentalApi from "../../apis/user-rental.api";
import toast from "react-hot-toast";
import RentControlPanelModal from "./RentalControlPanel";
import AddLateFeesModal from "./AddLateFeesToUserRentalModal";

const userRentalService = new UserRentalApi();

type OverdueRentalRow = {
  id?: string;
  rentId: string;
  userId?: string;
  userName: string;
  rentalProductName: string;
  rentalProductId: string;
  startDate?: string;
  endDate: string;
  deposit?: string | number;
  lateFee: string | number;
  status: string;
  overdue?: {
    hours?: number;
    days?: number;
  };
};

const RentalsOverdueScreen: React.FC = () => {
  const [overdueRows, setOverdueRows] = useState<OverdueRentalRow[]>([]);
  const [selectedRental, setSelectedRental] = useState<any | null>(null);
  const [lateFeesRental, setLateFeesRental] = useState<OverdueRentalRow | null>(
    null
  );
  const [reminderLoadingId, setReminderLoadingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchOverdueRentals();
  }, [page, debouncedSearch]);

  const fetchOverdueRentals = async () => {
    try {
      setLoading(true);

      const res = await userRentalService.getOverdueRentalListing(
        page,
        limit,
        debouncedSearch
      );

      if (res?.status === 200 && res?.data?.success) {
        setOverdueRows(res.data.data || []);

        setTotal(res.data.pagination?.total || 0);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } else {
        toast.error(res?.data?.message || "Failed to fetch overdue rentals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching overdue rentals");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOverdueText = (row: OverdueRentalRow) => {
    if (row.overdue?.hours !== undefined && row.overdue?.hours !== null) {
      return `${row.overdue.hours}h`;
    }

    return "-";
  };
   
  const handleAddLateFees = async (amount: number) => {
    if (!lateFeesRental?.id) {
      toast.error("Rental id not found");
      return;
    }

    try {
      const res = await userRentalService.addLateFeesToUserRental(
        lateFeesRental.id,
        {
          amount,
        }
      );

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || "Late fees added successfully");
        setLateFeesRental(null);
        fetchOverdueRentals();
      } else {
        toast.error(res?.data?.message || "Failed to add late fees");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while adding late fees");
    }
  };

  const handleSendReminder = async (rental: OverdueRentalRow) => {
    const rentalId = rental.id;

    if (!rentalId) {
      toast.error("Rental id not found");
      return;
    }

    try {
      setReminderLoadingId(rentalId);

      const res = await userRentalService.sendOverdueReminderToUserRental(
        rentalId
      );

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || "Reminder sent successfully");
      } else {
        toast.error(res?.data?.message || "Failed to send reminder");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending reminder");
    } finally {
      setReminderLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <RentalsScreenTabs activeScreen="overdue" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase">
          Overdue Rental Board
        </h2>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search overdue by ID/User/Product..."
        />
      </div>

      {/* Table */}
      <div className="brutal-card overflow-x-auto">
        <table className="w-full min-w-[960px] text-left border-collapse">
          <thead>
            <tr className="bg-[#ff3366] text-white border-b-4 border-black font-bold uppercase text-sm">
              <th className="p-3 border-r-2 border-black">ID</th>
              <th className="p-3 border-r-2 border-black">User & Product</th>
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
            {loading ? (
              [...Array(6)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b-2 border-black animate-pulse"
                >
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-20"></div>
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-32 mb-2"></div>
                    <div className="h-3 bg-gray-300 w-44"></div>
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-28"></div>
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-16"></div>
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="h-6 bg-gray-300 w-24"></div>
                  </td>

                  <td className="p-3">
                    <div className="h-8 bg-gray-300 w-24 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : overdueRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500 font-bold uppercase"
                >
                  No overdue rentals found
                </td>
              </tr>
            ) : (
              overdueRows.map((r) => (
                <tr
                  key={r.rentId}
                  className="border-b-2 border-black hover:bg-[#f4f4f0]"
                >
                  <td className="p-3 border-r-2 border-black font-bold">
                    {r.rentId}
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <div className="font-sans font-bold uppercase text-xs text-blue-600">
                      {r.userName || "Unknown"}
                    </div>
                    <div className="text-gray-600">{r.rentalProductName || "-"} ({r.rentalProductId})</div>
                  </td>

                  <td className="p-3 border-r-2 border-black font-mono text-xs">
                    {formatDate(r.endDate)}
                  </td>

                  <td className="p-3 border-r-2 border-black font-bold text-[#ff3366]">
                    {getOverdueText(r)}
                  </td>

                  <td className="p-3 border-r-2 border-black font-bold">
                    ₹{Number(r.lateFee || 0)}
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <span className="inline-block border-2 border-black bg-[#ff3366] text-white px-2 py-1 text-xs font-black uppercase">
                      {r.status || "OVERDUE"}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setLateFeesRental(r)}
                      className="brutal-btn brutal-btn-warning px-2 py-1 text-xs"
                    >
                      <i className="ph ph-currency-inr text-lg"></i>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSendReminder(r)}
                      disabled={reminderLoadingId === r.id}
                      className="brutal-btn brutal-btn-secondary px-2 py-1 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Send overdue reminder"
                    >
                      {reminderLoadingId === r.id ? (
                        <i className="ph ph-spinner-gap text-lg animate-spin"></i>
                      ) : (
                        <i className="ph ph-bell-ringing text-lg"></i>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRental({
                          id: r.rentId,
                          user: r.userName,
                          console: r.rentalProductName,
                          type: "-",
                          dueAt: formatDate(r.endDate),
                          deposit: Number(r.deposit || 0),
                          depositMethod: "Wallet",
                          lateFee: Number(r.lateFee || 0),
                          status: r.status || "OVERDUE",
                          raw: r,
                        })
                      }
                      className="brutal-btn bg-black text-white px-2 py-1 text-xs"
                    >
                      <i className="ph ph-eye text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-t-2 border-black p-4">
          <div className="font-mono text-sm font-bold">
            Showing page {page} of {totalPages} • Total {total}
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="brutal-btn brutal-btn-secondary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  disabled={loading}
                  className={`border-2 border-black px-3 py-2 font-black shadow-[3px_3px_0px_#000] ${page === pageNumber ? "bg-[#ffe600]" : "bg-white"
                    }`}
                >
                  {pageNumber}
                </button>
              );
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

      {lateFeesRental && (
        <AddLateFeesModal
          rental={lateFeesRental}
          onClose={() => setLateFeesRental(null)}
          onSubmit={handleAddLateFees}
        />
      )}

      {selectedRental && (
        <RentControlPanelModal
          rental={selectedRental}
          onClose={() => setSelectedRental(null)}
        />
      )}
    </div>
  );
};

export default RentalsOverdueScreen;