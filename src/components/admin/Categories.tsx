import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CategoryModal from "../categories/categoriesModal";
import ConfirmModal from "../shared/confirmModal";
import CategoryApi from "../../apis/category.api";

type Category = {
    id: string;
    categoryId: string;
    name: string;
    createdAt: string;
};

const categoriesService = new CategoryApi();

const Categories = () => {
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalCategories, setTotalCategories] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories(page);
    }, [page]);

    const fetchCategories = async (currentPage = page) => {
        try {
            setLoading(true);

            const res = await categoriesService.getAllCategories(
                currentPage,
                limit
            );

            if (res?.status === 200) {
                const data = res.data?.data || [];

                const formatted = data.map((item: any) => ({
                    id: item.id,
                    categoryId: item.categoryId,
                    name: item.name,
                    createdAt: new Date(item.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
                }));

                setCategories(formatted);

                setTotalCategories(res.data?.pagination?.total || 0);
                setLastPage(res.data?.pagination?.lastPage || 1);
                setPage(currentPage);
            } else {
                toast.error(
                    res?.data?.message || "Failed to fetch categories"
                );
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // SEARCH FILTER
    const filtered = categories.filter(
        (c) =>
            c.categoryId.toLowerCase().includes(search.toLowerCase()) ||
            c.name.toLowerCase().includes(search.toLowerCase())
    );

    // DELETE HANDLER
    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            setDeleteLoading(true);

            const res = await categoriesService.deleteCategory(deleteId);

            if (res?.status === 200) {

                toast.success(
                    res?.data?.message || "Category deleted successfully"
                );

                setDeleteId(null);
                await fetchCategories(page);

            } else {
                toast.error(
                    res?.data?.message || "Failed to delete category"
                );
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="p-6 bg-[#f4f4f0] min-h-screen font-mono">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] mb-6">
                <h2 className="text-2xl font-black uppercase">
                    Categories Management
                </h2>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">

                    {/* Search */}
                    <div className="flex items-center w-full sm:w-[260px] border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
                        <i className="ph ph-magnifying-glass mr-2"></i>

                        <input
                            placeholder="Search Categories..."
                            className="outline-none bg-transparent w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => {
                            setSelectedCategory(null);
                            setShowForm(true);
                        }}
                        className="bg-[#ffe600] border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition w-full sm:w-auto"
                    >
                        <i className="ph ph-plus"></i>
                        ADD CATEGORY
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-x-auto bg-white">

                <table className="w-full border-collapse">

                    {/* Table Head */}
                    <thead>
                        <tr className="bg-[#ffe600] border-b-4 border-black text-left uppercase text-sm font-black">
                            <th className="p-4 border-r-2 border-black">
                                Category ID
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Name
                            </th>

                            <th className="p-4 border-r-2 border-black">
                                Created At
                            </th>

                            <th className="p-4 text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {loading ? (
                            [...Array(5)].map((_, index) => (
                                <tr
                                    key={index}
                                    className="border-b-2 border-black animate-pulse"
                                >
                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                                    </td>

                                    <td className="p-4 border-r-2 border-black">
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <div className="h-10 w-10 bg-gray-300 rounded"></div>
                                            <div className="h-10 w-10 bg-gray-300 rounded"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : filtered.length ? (
                            filtered.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-b-2 border-black hover:bg-[#f4f4f0] transition"
                                >
                                    {/* Category ID */}
                                    <td className="p-4 border-r-2 border-black font-bold">
                                        {category.categoryId}
                                    </td>

                                    {/* Name */}
                                    <td className="p-4 border-r-2 border-black font-bold uppercase text-sm">
                                        {category.name}
                                    </td>

                                    {/* Created At */}
                                    <td className="p-4 border-r-2 border-black font-bold">
                                        {category.createdAt}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-4 text-center space-x-2">

                                        {/* Edit */}
                                        <button
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setShowForm(true);
                                            }}
                                            className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                                        >
                                            <i className="ph ph-pencil text-lg"></i>
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => setDeleteId(category.id)}
                                            className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                                        >
                                            <i className="ph ph-trash text-lg text-red-500"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="p-6 text-center font-bold"
                                >
                                    No categories found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-4 border-black bg-white px-4 py-3 shadow-[6px_6px_0px_#000]">

                    {/* LEFT */}
                    <div className="text-sm font-bold uppercase">
                        Total Categories: {totalCategories}
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-2">

                        {/* PREV */}
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
            ${page === 1
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-[#ffe600]"
                                }`}
                        >
                            Prev
                        </button>

                        {/* PAGE COUNT */}
                        <div className="border-2 border-black px-4 py-2 font-bold bg-black text-white shadow-[3px_3px_0px_#000]">
                            {page} / {lastPage}
                        </div>

                        {/* NEXT */}
                        <button
                            disabled={page === lastPage}
                            onClick={() => setPage((prev) => prev + 1)}
                            className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
            ${page === lastPage
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-[#ffe600]"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showForm && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => setShowForm(false)}
                    onSuccess={async () => {
                        setShowForm(false);

                        await fetchCategories(page);
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

export default Categories;