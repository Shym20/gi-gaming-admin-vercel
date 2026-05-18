import React, { useEffect, useState } from "react";
import RentalScreenTabs from "./RentalScreenTabs";
import UserRentalApi from "../../apis/user-rental.api";
import toast from "react-hot-toast";

const userRentalService = new UserRentalApi();

type RentalOption = {
  id?: string;
  rentId: string;
  userName?: string;
  product?: string;
  rentalProductName?: string;
};

type LedgerEntry = {
  id: string;
  createdAt: string;
  type: "DEBIT" | "CREDIT" | string;
  reason: string;
  amount: number;
  description?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  paymentId?: string | null;
};

type RentalLedgerData = {
  rentalId: string;
  rentId: string;
  user: {
    id: string;
    userId: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  status: string;
  ledger: LedgerEntry[];
};

type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const RentalsLedgerScreen: React.FC = () => {
  const [rentals, setRentals] = useState<RentalOption[]>([]);
  const [selectedRentalId, setSelectedRentalId] = useState("");

  const [ledgerData, setLedgerData] = useState<RentalLedgerData | null>(null);

  const [rentalsLoading, setRentalsLoading] = useState(false);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  // dropdown pagination
  const [rentalPage] = useState(1);
  const [rentalLimit] = useState(10);
  const [, setRentalPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // ledger pagination
  const [ledgerPage, setLedgerPage] = useState(1);
  const [ledgerLimit] = useState(10);
  const [ledgerPagination, setLedgerPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    fetchRentalsForDropdown(rentalPage);
  }, [rentalPage]);

  useEffect(() => {
    if (selectedRentalId) {
      fetchRentalLedger(selectedRentalId, ledgerPage);
    }
  }, [selectedRentalId, ledgerPage]);

  const fetchRentalsForDropdown = async (page = 1) => {
    try {
      setRentalsLoading(true);

      const res = await userRentalService.getAllUserRental(1, 1000);

      if (res?.status === 200 && res?.data?.success) {
        const list = res.data.data || [];

        setRentals(list);

        setRentalPagination({
          total: res.data.pagination?.total || 0,
          page: res.data.pagination?.page || page,
          limit: res.data.pagination?.limit || rentalLimit,
          totalPages: res.data.pagination?.totalPages || 1,
        });

        if (list.length > 0) {
          setSelectedRentalId((prev) => prev || list[0].id || list[0].rentId);
        } else {
          setSelectedRentalId("");
          setLedgerData(null);
        }
      } else {
        toast.error(res?.data?.message || "Failed to fetch rentals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching rentals");
    } finally {
      setRentalsLoading(false);
    }
  };

  const fetchRentalLedger = async (id: string, page = 1) => {
    try {
      setLedgerLoading(true);

      const res = await userRentalService.getRentalLedger(
        id,
        page,
        ledgerLimit
      );

      if (res?.status === 200 && res?.data?.success) {
        setLedgerData(res.data.data || null);

        setLedgerPagination({
          total: res.data.pagination?.total || 0,
          page: res.data.pagination?.page || page,
          limit: res.data.pagination?.limit || ledgerLimit,
          totalPages: res.data.pagination?.totalPages || 1,
        });
      } else {
        setLedgerData(null);
        toast.error(res?.data?.message || "Failed to fetch rental ledger");
      }
    } catch (error) {
      console.error(error);
      setLedgerData(null);
      toast.error("Something went wrong while fetching rental ledger");
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleRentalChange = (id: string) => {
    setSelectedRentalId(id);
    setLedgerPage(1);
  };

  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAmountText = (entry: LedgerEntry) => {
    const amount = Number(entry.amount || 0);

    if (entry.type === "DEBIT") {
      return `-₹${amount}`;
    }

    if (entry.type === "CREDIT") {
      return `+₹${amount}`;
    }

    return `₹${amount}`;
  };

  const getAmountClass = (entry: LedgerEntry) => {
    if (entry.type === "DEBIT") return "text-[#ff3366]";
    if (entry.type === "CREDIT") return "text-green-700";
    return "";
  };

  return (
    <div className="space-y-6">
      <RentalScreenTabs activeScreen="ledger" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase">Rental Ledger</h2>

        <div className="w-full sm:w-[520px] space-y-2">
          <select
            className="brutal-input bg-white"
            value={selectedRentalId}
            disabled={rentalsLoading}
            onChange={(e) => handleRentalChange(e.target.value)}
          >
            {rentalsLoading ? (
              <option>Loading rentals...</option>
            ) : rentals.length === 0 ? (
              <option>No rentals found</option>
            ) : (
              rentals.map((r) => (
                <option key={r.id || r.rentId} value={r.id || r.rentId}>
                  {r.rentId} - {r.userName || "Unknown"} (
                  {r.product || r.rentalProductName || "-"})
                </option>
              ))
            )}
          </select>

        </div>
      </div>

      {/* SUMMARY CARDS */}
      {ledgerLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="brutal-card p-4">
              <div className="h-3 bg-gray-300 w-20 mb-3"></div>
              <div className="h-6 bg-gray-300 w-32"></div>
            </div>
          ))}
        </div>
      ) : ledgerData ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="brutal-card p-4">
            <p className="font-mono text-xs uppercase text-gray-500">
              Rental
            </p>
            <p className="font-black text-xl">{ledgerData.rentId}</p>
          </div>

          <div className="brutal-card p-4">
            <p className="font-mono text-xs uppercase text-gray-500">
              Customer
            </p>
            <p className="font-black text-lg truncate">
              {ledgerData.user?.name || "-"}
            </p>
          </div>

          <div className="brutal-card p-4">
            <p className="font-mono text-xs uppercase text-gray-500">
              Duration
            </p>
            <p className="font-black text-sm">
              {formatDate(ledgerData.startDate)} -{" "}
              {formatDate(ledgerData.endDate)}
            </p>
          </div>

          <div className="brutal-card p-4">
            <p className="font-mono text-xs uppercase text-gray-500">
              Status
            </p>
            <p className="font-black text-sm">{ledgerData.status}</p>
          </div>
        </div>
      ) : (
        <div className="brutal-card p-10 text-center">
          <p className="font-black text-xl uppercase">
            No rental ledger available
          </p>
        </div>
      )}

      {/* LEDGER TABLE */}
      <div className="brutal-card overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead>
            <tr className="bg-[#00e5ff] border-b-4 border-black font-bold uppercase text-sm">
              <th className="p-3 border-r-2 border-black">Time</th>
              <th className="p-3 border-r-2 border-black">Type</th>
              <th className="p-3 border-r-2 border-black">Reason</th>
              <th className="p-3 border-r-2 border-black text-right">
                Amount
              </th>
              <th className="p-3 border-r-2 border-black text-right">
                Before
              </th>
              <th className="p-3 border-r-2 border-black text-right">
                After
              </th>
              <th className="p-3">Description</th>
            </tr>
          </thead>

          <tbody className="font-mono text-sm">
            {ledgerLoading ? (
              [...Array(5)].map((_, index) => (
                <tr
                  key={index}
                  className="border-b-2 border-black animate-pulse"
                >
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-32"></div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-16"></div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-24"></div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                  </td>
                  <td className="p-3 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 w-20 ml-auto"></div>
                  </td>
                  <td className="p-3">
                    <div className="h-4 bg-gray-300 w-56"></div>
                  </td>
                </tr>
              ))
            ) : !ledgerData || ledgerData.ledger.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-gray-500 font-bold uppercase"
                >
                  No ledger events found
                </td>
              </tr>
            ) : (
              ledgerData.ledger.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b-2 border-black hover:bg-[#f4f4f0]"
                >
                  <td className="p-3 border-r-2 border-black text-xs">
                    {formatDateTime(entry.createdAt)}
                  </td>

                  <td className="p-3 border-r-2 border-black">
                    <span
                      className={`inline-block border-2 border-black px-2 py-1 text-xs font-black uppercase ${entry.type === "DEBIT"
                          ? "bg-[#ff3366] text-white"
                          : "bg-[#00ff66]"
                        }`}
                    >
                      {entry.type}
                    </span>
                  </td>

                  <td className="p-3 border-r-2 border-black font-bold">
                    {entry.reason || "-"}
                  </td>

                  <td
                    className={`p-3 border-r-2 border-black text-right font-black ${getAmountClass(
                      entry
                    )}`}
                  >
                    {getAmountText(entry)}
                  </td>

                  <td className="p-3 border-r-2 border-black text-right">
                    ₹{Number(entry.balanceBefore || 0)}
                  </td>

                  <td className="p-3 border-r-2 border-black text-right font-black">
                    ₹{Number(entry.balanceAfter || 0)}
                  </td>

                  <td className="p-3 text-xs">{entry.description || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* LEDGER PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-2 border-black p-3 brutal-shadow">
        <div className="font-mono text-xs font-bold uppercase">
          Showing page {ledgerPagination.page} of {ledgerPagination.totalPages}{" "}
          / Total {ledgerPagination.total}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={ledgerLoading || ledgerPage <= 1}
            onClick={() => setLedgerPage((prev) => Math.max(prev - 1, 1))}
            className="brutal-btn bg-white px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <span className="font-mono font-black text-sm">
            {ledgerPagination.page} / {ledgerPagination.totalPages}
          </span>

          <button
            type="button"
            disabled={
              ledgerLoading || ledgerPage >= ledgerPagination.totalPages
            }
            onClick={() =>
              setLedgerPage((prev) =>
                Math.min(prev + 1, ledgerPagination.totalPages)
              )
            }
            className="brutal-btn bg-white px-4 py-2 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalsLedgerScreen;