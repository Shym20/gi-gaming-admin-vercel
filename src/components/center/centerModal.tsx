import React, { useState } from "react";
import type { Center } from "../../types/apptypes";
import Centers from "../../apis/centers.api";
import toast from "react-hot-toast";

const centerService = new Centers();

interface Props {
  center?: Center | null
  onSave: (center: Center) => void
  onClose: () => void
}

const CenterModal: React.FC<Props> = ({ center, onSave, onClose }) => {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<Center>({
    id: center?.id || "",
    name: center?.name || "",
    location: center?.location || "",
    pcs: center?.pcs || 0,
    consoles: center?.consoles || 0,
    status: center?.status || "ACTIVE"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: name === "pcs" || name === "consoles" ? Number(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        address: formData.location,
        pcsCount: formData.pcs,
        consoleCount: formData.consoles,
      };

      setLoading(true);

      let res;

      // ✅ CHECK: create OR update
      if (center?.id) {
        res = await centerService.updateCenter({
          id: center.id, // 👈 IMPORTANT
          ...payload,
        });
      } else {
        res = await centerService.createCenter(payload);
      }

      if (res?.status === 200 || res?.status === 201) {
        toast.success(
          center ? "Center updated successfully" : "Center created successfully"
        );

        onSave(res.data?.data); // refresh list
        onClose();
      } else {
        toast.error(res?.data?.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      {/* MODAL */}
      <div className="w-[95%] max-w-xl bg-[#f4f4f0] border-4 border-black shadow-[4px_4px_0px_#000]">

        {/* HEADER */}
        <div className="bg-[#ffe600] border-b-4 border-black flex justify-between items-center px-5 py-3">
          <h2 className="font-black uppercase text-md tracking-wide">
            {center ? "Manage Center" : "Add New Center"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">✕</button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">

          {/* CENTER NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase">Center Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-black px-3 py-2 bg-white shadow-[3px_3px_0px_#000] outline-none"
              required
            />
          </div>

          {/* LOCATION */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border-2 border-black px-3 py-2 bg-white shadow-[3px_3px_0px_#000] outline-none"
              required
            />
          </div>

          {/* PCS + CONSOLES */}
          <div className="grid grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">Total PCs</label>
              <input
                name="pcs"
                type="number"
                min={1}
                value={formData.pcs}
                onChange={handleChange}
                className="border-2 border-black px-3 py-2 bg-white shadow-[3px_3px_0px_#000] outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase">Consoles</label>
              <input
                name="consoles"
                type="number"
                min={1}
                value={formData.consoles}
                onChange={handleChange}
                className="border-2 border-black px-3 py-2 bg-white shadow-[3px_3px_0px_#000] outline-none"
                required
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#19c2d1] border-2 border-black py-3 font-bold uppercase shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {loading
              ? "Saving..."
              : center
                ? "Update Center"
                : "Save Center"}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CenterModal