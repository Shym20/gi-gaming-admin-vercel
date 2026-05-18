import { useEffect, useState } from "react";
import SnacksApi from "../../apis/snacks.api";
import toast from "react-hot-toast";
import SnackModal from "../snacks/snacksModal";
import ConfirmModal from "../shared/confirmModal";

type Snack = {
  id: string;
  snackId: string;
  name: string;
  price: number;
  stock: number;
  status: "IN_STOCK" | "OUT_OF_STOCK";
};

const snacksService = new SnacksApi();

const Snacks = () => {

  const [showForm, setShowForm] = useState(false);
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalSnacks, setTotalSnacks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const filtered = snacks.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "IN_STOCK" ? (
      <span className="bg-green-400 border-2 border-black px-2 py-1 text-xs font-bold">
        IN_STOCK
      </span>
    ) : (
      <span className="bg-[#ffe600] border-2 border-black px-2 py-1 text-xs font-bold">
        OUT_OF_STOCK
      </span>
    );
  };

  useEffect(() => {
    fetchSnacks(page);
  }, [page]);

  const fetchSnacks = async (currentPage = page) => {
    try {
      setLoading(true);

      const res = await snacksService.getAllSnacks(currentPage, limit);

      if (res?.status === 200) {
        const data = res.data?.data || [];

        const formatted = data.map((item: any) => ({
          id: item.id,
          snackId: item.snackId,
          name: item.name,
          price: Number(item.price),
          stock: item.stock,
          status: item.status,
        }));

        setSnacks(formatted);

        setTotalSnacks(res.data?.pagination?.total || 0);
        setTotalPages(
          res.data?.pagination?.totalPages ||
          res.data?.pagination?.lastPage ||
          1
        );
        setPage(currentPage);
      } else {
        toast.error(res?.data?.message || "Failed to fetch snacks");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res = await snacksService.deleteSnacks(deleteId);

      if (res?.status === 200 || res?.status === 204) {
        toast.success("Snack deleted successfully");

        setDeleteId(null);
        await fetchSnacks(page);
      } else {
        toast.error(res?.data?.message || "Delete failed");
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
        <h2 className="text-2xl font-black uppercase">Snacks Management</h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center w-full sm:w-[260px] border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
            <i className="ph ph-magnifying-glass mr-2"></i>
            <input
              placeholder="Search Snacks..."
              className="outline-none bg-transparent w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedSnack(null);
              setShowForm(true);
            }}
            className="bg-[#ffe600] border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition w-full sm:w-auto"
          >
            <i className="ph ph-plus"></i> ADD SNACK
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border-4 border-black shadow-[6px_6px_0px_#000] overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#ffe600] border-b-4 border-black text-left uppercase text-sm font-black">
              <th className="p-4 border-r-2 border-black">ID</th>
              <th className="p-4 border-r-2 border-black">Name</th>
              <th className="p-4 border-r-2 border-black text-right">Price</th>
              <th className="p-4 border-r-2 border-black text-center">Stock</th>
              <th className="p-4 border-r-2 border-black">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

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
                    <div className="h-4 bg-gray-300 rounded w-16 ml-auto"></div>
                  </td>

                  <td className="p-4 border-r-2 border-black">
                    <div className="h-4 bg-gray-300 rounded w-10 mx-auto"></div>
                  </td>

                  <td className="p-4 border-r-2 border-black">
                    <div className="h-6 bg-gray-300 rounded w-24"></div>
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
              filtered.map((s) => (
                <tr
                  key={s.id}
                  className="border-b-2 border-black hover:bg-[#f4f4f0] transition"
                >
                  <td className="p-4 border-r-2 border-black font-bold">
                    {s.snackId}
                  </td>

                  <td className="p-4 border-r-2 border-black font-bold text-xs uppercase">
                    {s.name}
                  </td>

                  <td className="p-4 border-r-2 border-black text-right font-bold">
                    ₹{s.price}
                  </td>

                  <td
                    className={`p-4 border-r-2 border-black text-center font-bold ${s.stock === 0 ? "text-pink-500" : ""
                      }`}
                  >
                    {s.stock}
                  </td>

                  <td className="p-4 border-r-2 border-black">
                    {getStatusBadge(s.status)}
                  </td>

                  <td className="p-4 text-center space-x-2">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedSnack(s);
                        setShowForm(true);
                      }}
                      className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                    >
                      <i className="ph ph-pencil text-lg"></i>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                    >
                      <i className="ph ph-trash text-lg text-red-500"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center font-bold">
                  No snacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]">

          <div className="text-sm font-bold uppercase">
            Total Snacks: {totalSnacks}
          </div>

          <div className="flex items-center gap-2">
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

            <div className="border-2 border-black px-4 py-2 font-bold bg-black text-white shadow-[3px_3px_0px_#000]">
              {page} / {totalPages}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
      ${page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ffe600]"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <SnackModal
          snack={selectedSnack}
          onClose={() => setShowForm(false)}
          onSuccess={async () => {
            await fetchSnacks(page);
          }}
        />
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this snack?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Snacks;