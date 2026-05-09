import { useState } from "react";
import toast from "react-hot-toast";
import CategoryModal from "../categories/categoriesModal";
import ConfirmModal from "../shared/confirmModal";

type Report = {
    id: number;
    reportedBy: string;
    reportedOn: string;
    product: string;
    category: string;
    status: "IN_PROGRESS" | "RESOLVED" | "PENDING";
};

const Reports = () => {
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [selectedReport, setSelectedReport] =
        useState<Report | null>(null);

    // STATIC DATA
    const [reports, setReports] = useState<Report[]>([
        {
            id: 1,
            reportedBy: "Rahul Sharma",
            reportedOn: "08 May 2026",
            product: "Gaming Headset",
            category: "Electronics",
            status: "PENDING",
        },
        {
            id: 2,
            reportedBy: "Ankit Verma",
            reportedOn: "07 May 2026",
            product: "Wireless Mouse",
            category: "Accessories",
            status: "IN_PROGRESS",
        },
        {
            id: 3,
            reportedBy: "Priya Singh",
            reportedOn: "06 May 2026",
            product: "Mechanical Keyboard",
            category: "Electronics",
            status: "RESOLVED",
        },
        {
            id: 4,
            reportedBy: "Aman Patel",
            reportedOn: "05 May 2026",
            product: "Gaming Chair",
            category: "Furniture",
            status: "PENDING",
        },
    ]);

    // SEARCH FILTER
    const filtered = reports.filter(
        (report) =>
            report.reportedBy.toLowerCase().includes(search.toLowerCase()) ||
            report.product.toLowerCase().includes(search.toLowerCase()) ||
            report.category.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "RESOLVED":
                return (
                    <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold">
                        RESOLVED
                    </span>
                );

            case "IN_PROGRESS":
                return (
                    <span className="bg-[#00e5ff] border-2 border-black px-3 py-1 text-xs font-bold">
                        IN PROGRESS
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
                    Reports
                </h2>

               <div className="flex items-center gap-3 w-full md:w-auto">

                    {/* Search */}
                   <div className="flex items-center w-full md:w-[300px] border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">       
                    <i className="ph ph-magnifying-glass mr-2"></i>

                        <input
                            placeholder="Search Reports..."
                           className="outline-none bg-transparent w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                </div>
            </div>

            {/* Table */}
            <div className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-x-auto bg-white">

                <table className="w-full border-collapse">

                    {/* Table Head */}
                    <thead>
                        <tr className="bg-[#ffe600] border-b-4 border-black text-left uppercase text-sm font-black">
                            <th className="p-4 border-r-2 border-black">S.No</th>

                            <th className="p-4 border-r-2 border-black">
                                Reported By
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Reported On
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Product
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Category
                            </th>

                            <th className="p-4 text-center">
                                Status
                            </th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {filtered.map((report, index) => (
                            <tr
                                key={report.id}
                                className="border-b-2 border-black hover:bg-[#f4f4f0] transition"
                            >
                                {/* Serial Number */}
                                <td className="p-4 border-r-2 border-black font-bold">
                                    {index + 1}
                                </td>

                                {/* Reported By */}
                                <td className="p-4 border-r-2 border-black font-bold uppercase text-sm">
                                    {report.reportedBy}
                                </td>

                                {/* Reported On */}
                                <td className="p-4 border-r-2 border-black font-bold">
                                    {report.reportedOn}
                                </td>

                                {/* Product */}
                                <td className="p-4 border-r-2 border-black font-bold">
                                    {report.product}
                                </td>

                                {/* Category */}
                                <td className="p-4 border-r-2 border-black font-bold">
                                    {report.category}
                                </td>

                                {/* Status */}
                                <td className="p-4 text-center">
                                    {getStatusBadge(report.status)}
                                </td>
                            </tr>
                        ))}

                        {!filtered.length && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="p-6 text-center font-bold"
                                >
                                    No reports found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showForm && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => setShowForm(false)}
                    onSuccess={(newCategory) => {
                        console.log(newCategory);

                        setShowForm(false);
                    }}
                />
            )}

            {/* Delete Confirm */}
            {deleteId && (
                <ConfirmModal
                    message="Are you sure you want to delete this category?"
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteId(null)}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
};

export default Reports;