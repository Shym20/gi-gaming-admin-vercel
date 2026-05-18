

import React, { useEffect, useState } from "react"
import CenterModal from "../center/centerModal";
import type { Center } from "../../types/apptypes"
import StatusBadge from "../shared/StatusBadge"
import CentersApi from "../../apis/centers.api";
import toast from "react-hot-toast";
import ConfirmModal from "../shared/confirmModal";


const Centers: React.FC = () => {

  const centerService = new CentersApi();

  const [centerList, setCenterList] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalCenters, setTotalCenters] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handleSave = async () => {
    await fetchCenters(page);
  };

  useEffect(() => {
    fetchCenters(page);
  }, [page]);

  const fetchCenters = async (currentPage = page) => {
    try {
      setLoading(true);

      const res = await centerService.getAllCenters(currentPage, limit);

      if (res?.status === 200) {
        const data = res.data?.data || [];

        const formatted = data.map((item: any) => ({
          id: item.id,
          centerId: item.centerId,
          name: item.name,
          location: item.address,
          pcs: item.pcsCount,
          consoles: item.consoleCount,
          status: item.status || "ACTIVE",
        }));

        setCenterList(formatted);

        setTotalCenters(res.data?.pagination?.total || 0);
        setTotalPages(
          res.data?.pagination?.totalPages ||
          res.data?.pagination?.lastPage ||
          1
        );
        setPage(currentPage);
      } else {
        toast.error(res?.data?.message || "Failed to fetch centers");
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

      const res = await centerService.deleteCenter(deleteId);

      if (res?.status === 200 || res?.status === 204) {
        toast.success("Center deleted successfully");

        setDeleteId(null);
        await fetchCenters(page); // refresh list
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
    <div className="">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase ">
          Centers Management
        </h2>

        <button
          onClick={() => {
            setSelectedCenter(null)
            setOpen(true)
          }}
          className="brutal-btn brutal-btn-primary brutal-hover flex items-center gap-3 text-lg"
        >
          <i className="ph ph-plus "></i> Add Center
        </button>
      </div>

      {/* GRID */}
      {/* GRID */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="brutal-card p-6 flex flex-col animate-pulse"
            >
              <div className="h-5 bg-gray-300 rounded w-40 mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-56 mb-6"></div>

              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="h-20 bg-gray-300 rounded"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>

              <div className="h-10 bg-gray-300 rounded mt-auto"></div>
            </div>
          ))}
        </div>
      ) : centerList.length === 0 ? (
        <div className="border-2 border-black bg-white p-8 mt-6 text-center font-bold uppercase shadow-[4px_4px_0px_#000]">
          No centers found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {centerList.map((c) => (
            <div key={c.id} className="brutal-card p-6 flex flex-col">

              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-black">{c.name}</h3>
                  <p className="text-xs text-gray-500">{c.location}</p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={c.status} />

                  <button
                    onClick={() => setDeleteId(c.id)} // ✅ open modal
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <i className="ph ph-trash text-2xl"></i>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-4 font-mono text-sm">
                <div className="border-2 border-black p-2 text-center bg-[#f4f4f0]">
                  <p className="font-bold text-xl">{c.pcs}</p><p className="text-xs uppercase font-sans">PCs</p>
                </div>
                <div className="border-2 border-black p-2 text-center bg-[#f4f4f0]">
                  <p className="font-bold text-xl">{c.consoles}</p><p className="text-xs uppercase font-sans">Consoles</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCenter(c)
                  setOpen(true)
                }}
                className="brutal-btn brutal-btn-secondary brutal-hover mt-auto text-lg flex items-center justify-center gap-2"
              >
                <i className="ph ph-gear "></i>   Manage Hardware
              </button>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6   px-4 py-3 ">

        <div className="text-sm font-bold uppercase">
          Total Centers: {totalCenters}
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

      {/* MODAL */}
      {open && (
        <CenterModal
          center={selectedCenter}
          onSave={handleSave}
          onClose={() => setOpen(false)}
        />
      )}

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this center?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}

export default Centers