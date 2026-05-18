import React, { useEffect, useState } from "react";

type AddLateFeesModalProps = {
  rental: {
    id?: string;
    rentId: string;
    userName?: string;
    rentalProductName?: string;
    lateFee?: string | number;
  };
  onClose: () => void;
  onSubmit: (amount: number) => Promise<void> | void;
};

const AddLateFeesModal: React.FC<AddLateFeesModalProps> = ({
  rental,
  onClose,
  onSubmit,
}) => {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAmount("");
  }, [rental?.rentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = Number(amount);

    if (!amount || Number.isNaN(finalAmount) || finalAmount <= 0) {
      return;
    }

    try {
      setSaving(true);
      await onSubmit(finalAmount);
    } finally {
      setSaving(false);
    }
  };

  const currentLateFee = Number(rental?.lateFee || 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-[#ffe600] border-b-4 border-black px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-black uppercase text-xl">Add Late Fees</h2>
            <p className="font-mono text-xs font-bold uppercase">
              {rental?.rentId || "-"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none font-normal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Rental info */}
          <div className="border-2 border-black bg-[#f4f4f0] p-3 shadow-[3px_3px_0px_#000]">
            <div className="flex justify-between gap-3 border-b border-black pb-2 mb-2">
              <span className="font-black uppercase text-xs text-gray-600">
                User
              </span>
              <span className="font-bold text-sm text-right">
                {rental?.userName || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-3 border-b border-black pb-2 mb-2">
              <span className="font-black uppercase text-xs text-gray-600">
                Product
              </span>
              <span className="font-bold text-sm text-right">
                {rental?.rentalProductName || "-"}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="font-black uppercase text-xs text-gray-600">
                Current Late Fee
              </span>
              <span className="font-mono font-black">
                ₹{currentLateFee}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-black uppercase text-sm mb-1">
              Update Late Fee Amount
            </label>

            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border-2 border-black px-3 py-2 font-bold outline-none shadow-[3px_3px_0px_#000]"
              required
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="border-2 border-black bg-white px-4 py-2 font-black uppercase shadow-[3px_3px_0px_#000] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="border-2 border-black bg-[#00ff66] px-4 py-2 font-black uppercase shadow-[3px_3px_0px_#000] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Adding..." : "Add Fees"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLateFeesModal;