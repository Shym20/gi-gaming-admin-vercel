

import React, { useEffect, useState } from "react"
import CenterModal from "../center/centerModal";
import { useApp } from "../../context/AppContext"
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

  const handleSave = async () => {
    await fetchCenters();
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const res = await centerService.getAllCenters();

      if (res?.status === 200) {
        // ⚠️ map backend → frontend shape
        const data = res.data?.data || [];

        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          location: item.address, // 👈 mapping
          pcs: item.pcsCount,
          consoles: item.consoleCount,
          status: item.status || "ACTIVE",
        }));

        setCenterList(formatted);
      } else {
        toast.error(res?.data?.message || "Failed to fetch centers");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
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
        await fetchCenters(); // refresh list
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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