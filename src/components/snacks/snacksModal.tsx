import React, { useState } from "react";
import SnacksApi from "../../apis/snacks.api";
import toast from "react-hot-toast";

const snacksService = new SnacksApi();

interface Props {
  snack?: any;
  onClose: () => void;
  onSuccess: (newSnack: any) => void;
}

const SnackModal: React.FC<Props> = ({ snack, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: snack?.name || "",
    price: snack?.price?.toString() || "",
    stock: snack?.stock?.toString() || "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        price: parseInt(form.price),
        stock: parseInt(form.stock),
      };

      let res;

      if (snack?.id) {
        // ✅ UPDATE
        res = await snacksService.updateSnacks({
          id: snack.id,
          ...payload,
        });
      } else {
        // ✅ CREATE
        res = await snacksService.createSnacks(payload);
      }

      if (res?.status === 200 || res?.status === 201) {
        toast.success(
          snack ? "Snack updated successfully" : "Snack created successfully"
        );

        onSuccess(payload);
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg">

        {/* Header */}
        <div className="bg-[#ffe600] border-b-4 border-black px-6 py-4 flex justify-between items-center">
          <h2 className="font-black uppercase text-lg">
            {snack ? "Edit Snack" : "Add New Snack"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm uppercase">Snack Name</label>
            <input
              className="border-2 border-black px-3 py-2 shadow-[4px_4px_0px_#000]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price"
              min={1}
              className="border-2 border-black px-3 py-2 shadow-[4px_4px_0px_#000]"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Stock"
              min={1}
              className="border-2 border-black px-3 py-2 shadow-[4px_4px_0px_#000]"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffe600] border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_#000]"
          >
            {loading
              ? "Saving..."
              : snack
                ? "Update Snack"
                : "Save Snack"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SnackModal;