import { useEffect, useState } from "react";

type UserWalletUpdateModalProps = {
  user: {
    id: string;
    userId?: string;
    name?: string;
    phone?: string;
    email?: string;
    walletBalance?: number | string;
    balance?: number | string;
  };
  onClose: () => void;
  onSave: (payload: {
    userId: string;
    amount: number;
  }) => Promise<void> | void;
};

const UserWalletUpdateModal = ({
  user,
  onClose,
  onSave,
}: UserWalletUpdateModalProps) => {
  const currentBalance = Number(user.walletBalance || user.balance || 0);

  const [amount, setAmount] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAmount("");
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const rechargeAmount = Number(amount);

    if (!amount || Number.isNaN(rechargeAmount) || rechargeAmount <= 0) {
      return;
    }

    try {
      setSaving(true);

      await onSave({
        userId: user.id,
        amount: rechargeAmount,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#ffe600] px-5 py-4">
          <div>
            <h2 className="text-xl font-black uppercase">Recharge Wallet</h2>
            <p className="text-xs font-bold uppercase">
              {user.name || "User"} / {user.userId || user.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border-2 border-black bg-white px-3 py-1 font-black shadow-[3px_3px_0px_#000]"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* User info */}
          <div className="border-2 border-black p-3 bg-[#f4f4f0] shadow-[3px_3px_0px_#000]">
            <div className="text-xs font-black uppercase text-gray-600">
              Current Balance
            </div>
            <div className="text-2xl font-black">₹{currentBalance}</div>

            <div className="mt-3 text-xs font-bold">
              <div>{user.phone || "-"}</div>
              <div>{user.email || "-"}</div>
            </div>
          </div>

          {/* Amount */}
          <div className="flex flex-col gap-1">
            <label className="font-black uppercase text-sm">
              Recharge Amount
            </label>

            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="border-2 border-black px-3 py-2 font-bold outline-none shadow-[3px_3px_0px_#000]"
              required
            />
          </div>

          {/* Preview */}
          <div className="border-2 border-black p-3 bg-white">
            <div className="flex justify-between text-sm font-bold uppercase">
              <span>New Balance</span>
              <span>
                ₹
                {currentBalance +
                  (Number(amount) > 0 && !Number.isNaN(Number(amount))
                    ? Number(amount)
                    : 0)}
              </span>
            </div>
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
              {saving ? "Updating..." : "Update Wallet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserWalletUpdateModal;