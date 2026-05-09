import { useState } from "react";

type WalletTransaction = {
    id: number;
    user: string;
    transactionDate: string;
    type: "CREDIT" | "DEBIT" | "REFUND" | "ADJUSTMENT";
    amount: number;
    bookingId: string;
    rentalId: string;
    refundStatus: "COMPLETED" | "PENDING" | "FAILED";
};

const Wallet = () => {
    const [search, setSearch] = useState("");

    // STATIC DATA
    const [transactions] = useState<WalletTransaction[]>([
        {
            id: 1,
            user: "Rahul Sharma",
            transactionDate: "08 May 2026",
            type: "CREDIT",
            amount: 2500,
            bookingId: "BK1023",
            rentalId: "RN556",
            refundStatus: "COMPLETED",
        },
        {
            id: 2,
            user: "Ankit Verma",
            transactionDate: "07 May 2026",
            type: "DEBIT",
            amount: 1200,
            bookingId: "BK1045",
            rentalId: "RN778",
            refundStatus: "PENDING",
        },
        {
            id: 3,
            user: "Priya Singh",
            transactionDate: "06 May 2026",
            type: "REFUND",
            amount: 1800,
            bookingId: "BK1099",
            rentalId: "RN881",
            refundStatus: "COMPLETED",
        },
        {
            id: 4,
            user: "Aman Patel",
            transactionDate: "05 May 2026",
            type: "ADJUSTMENT",
            amount: 500,
            bookingId: "BK1120",
            rentalId: "RN902",
            refundStatus: "FAILED",
        },
    ]);

    // FILTER
    const filtered = transactions.filter(
        (item) =>
            item.user.toLowerCase().includes(search.toLowerCase()) ||
            item.bookingId.toLowerCase().includes(search.toLowerCase()) ||
            item.rentalId.toLowerCase().includes(search.toLowerCase())
    );

    // TOTALS
    const totalBalance = 100;
    const totalCredits = 18200;
    const totalDebits = 18100;

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "CREDIT":
                return (
                    <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold">
                        CREDIT
                    </span>
                );

            case "DEBIT":
                return (
                    <span className="bg-[#ff4d4d] border-2 border-black px-3 py-1 text-xs font-bold text-white">
                        DEBIT
                    </span>
                );

            case "REFUND":
                return (
                    <span className="bg-[#00e5ff] border-2 border-black px-3 py-1 text-xs font-bold">
                        REFUND
                    </span>
                );

            default:
                return (
                    <span className="bg-[#ffe600] border-2 border-black px-3 py-1 text-xs font-bold">
                        ADJUSTMENT
                    </span>
                );
        }
    };

    const getRefundBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold">
                        COMPLETED
                    </span>
                );

            case "FAILED":
                return (
                    <span className="bg-[#ff4d4d] border-2 border-black px-3 py-1 text-xs font-bold text-white">
                        FAILED
                    </span>
                );

            default:
                return (
                    <span className="bg-[#ffe600] border-2 border-black px-3 py-1 text-xs font-bold">
                        PENDING
                    </span>
                );
        }
    };

    return (
        <div className="p-6 bg-[#f4f4f0] min-h-screen font-mono">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] mb-6">

                <h2 className="text-2xl font-black uppercase">
                    Wallet Management
                </h2>

                {/* Search */}
                <div className="flex items-center w-full md:w-[320px] border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
                    <i className="ph ph-magnifying-glass mr-2"></i>

                    <input
                        placeholder="Search Transactions..."
                        className="outline-none bg-transparent w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                {/* Wallet Balance */}
                <div className="bg-[#ffe600] border-4 border-black p-5 shadow-[6px_6px_0px_#000]">
                    <p className="text-sm font-bold uppercase mb-2">
                        Wallet Balance
                    </p>

                    <h3 className="text-3xl font-black">
                        ₹ {totalBalance}
                    </h3>
                </div>

                {/* Credits */}
                <div className="bg-[#00ff66] border-4 border-black p-5 shadow-[6px_6px_0px_#000]">
                    <p className="text-sm font-bold uppercase mb-2">
                        Total Credits
                    </p>

                    <h3 className="text-3xl font-black">
                        ₹ {totalCredits}
                    </h3>
                </div>

                {/* Debits */}
                <div className="bg-[#ff4d4d] border-4 border-black p-5 shadow-[6px_6px_0px_#000] text-white">
                    <p className="text-sm font-bold uppercase mb-2">
                        Total Debits
                    </p>

                    <h3 className="text-3xl font-black">
                        ₹ {totalDebits}
                    </h3>
                </div>
            </div>

            {/* Table */}
            <div className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-x-auto bg-white">

                <table className="w-full border-collapse">

                    {/* Head */}
                    <thead>
                        <tr className="bg-[#ffe600] border-b-4 border-black text-left uppercase text-sm font-black">

                            <th className="p-4 border-r-2 border-black">
                                S.No
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                User
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Date
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Type
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Amount
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Booking ID
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Rental ID
                            </th>

                            <th className="p-4 text-center">
                                Refund Status
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {filtered.map((item, index) => (
                            <tr
                                key={item.id}
                                className="border-b-2 border-black hover:bg-[#f4f4f0] transition"
                            >

                                <td className="p-4 border-r-2 border-black font-bold">
                                    {index + 1}
                                </td>

                                <td className="p-4 border-r-2 border-black font-bold uppercase text-sm">
                                    {item.user}
                                </td>

                                <td className="p-4 border-r-2 border-black font-bold">
                                    {item.transactionDate}
                                </td>

                                <td className="p-4 border-r-2 border-black">
                                    {getTypeBadge(item.type)}
                                </td>

                                <td className="p-4 border-r-2 border-black font-black">
                                    ₹ {item.amount}
                                </td>

                                <td className="p-4 border-r-2 border-black font-bold">
                                    {item.bookingId}
                                </td>

                                <td className="p-4 border-r-2 border-black font-bold">
                                    {item.rentalId}
                                </td>

                                <td className="p-4 text-center">
                                    {getRefundBadge(item.refundStatus)}
                                </td>
                            </tr>
                        ))}

                        {!filtered.length && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="p-6 text-center font-bold"
                                >
                                    No transactions found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Wallet;