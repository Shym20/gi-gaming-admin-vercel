import React, { useState } from "react";

type AccessoryItem = {
    id: number;
    name: string;
    qty: number;
};

type ProcessHandoverModalProps = {
    rental: any;
    onClose: () => void;
    onConfirm?: (payload: {
        rentalId: string;
        identityVerified: boolean;
        consoleSerialNumber: string;
        accessories: AccessoryItem[];
        amountCollected: number;
        paymentMethod: string;
    }) => void;
};

const defaultAccessories: AccessoryItem[] = [
    {
        id: 1,
        name: "Console Unit",
        qty: 1,
    },
    {
        id: 2,
        name: "Wireless Controller",
        qty: 2,
    },
];

const ProcessHandoverModal: React.FC<ProcessHandoverModalProps> = ({
    rental,
    onClose,
    onConfirm,
}) => {
    const [identityVerified, setIdentityVerified] = useState(false);
    const [consoleSerialNumber, setConsoleSerialNumber] = useState("");
    const [accessories, setAccessories] =
        useState<AccessoryItem[]>(defaultAccessories);

    const [amountCollected, setAmountCollected] = useState("6500");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [handoverSuccess, setHandoverSuccess] = useState(false);

    const basePrice = 1500;
    const depositRequired = 5000;
    const totalDue = basePrice + depositRequired;
    const walletBalance = 450;

    const handleAccessoryChange = (
        id: number,
        field: "name" | "qty",
        value: string
    ) => {
        setAccessories((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [field]: field === "qty" ? Number(value || 0) : value,
                    }
                    : item
            )
        );
    };

    const handleAddItem = () => {
        setAccessories((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: "",
                qty: 1,
            },
        ]);
    };

    const handleRemoveItem = (id: number) => {
        setAccessories((prev) => prev.filter((item) => item.id !== id));
    };

    const handleConfirm = () => {
        onConfirm?.({
            rentalId: rental?.id,
            identityVerified,
            consoleSerialNumber,
            accessories,
            amountCollected: Number(amountCollected || 0),
            paymentMethod,
        });

        setHandoverSuccess(true);
    };


    if (handoverSuccess) {
        return (
          <div
  onClick={onClose}
  className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center px-4"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="bg-white border-4 border-black shadow-[7px_7px_0px_#000] w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
  >
    {/* Header */}
    <div className="bg-[#ffe600] border-b-4 border-black px-5 py-4 flex items-center justify-between">
      <h2 className="font-[700] uppercase text-xl">
        Handover Confirmation
      </h2>

      <button
        type="button"
        onClick={onClose}
        className="text-3xl leading-none font-normal"
      >
        ×
      </button>
    </div>

    <div className="p-6 text-center">
      {/* Icon */}
      <div className="mx-auto mb-5 w-20 h-20 bg-[#00ff66] border-4 border-black shadow-[5px_5px_0px_#000] flex items-center justify-center rotate-[2deg]">
        <i className="ph ph-check text-4xl"></i>
      </div>

      <h3 className="font-[700] uppercase text-2xl mb-5">
        Handover Successful!
      </h3>

      {/* Details */}
      <div className="border-2 border-black shadow-[4px_4px_0px_#000] p-3 text-left max-w-sm mx-auto text-sm">
        <div className="flex items-center justify-between border-b border-black py-2 gap-4">
          <span className="font-black uppercase text-gray-500">
            Rental ID
          </span>
          <span className="font-mono font-black">
            {rental?.id || "RNT-884"}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-black py-2 gap-4">
          <span className="font-black uppercase text-gray-500">
            New Status
          </span>
          <span className="font-mono font-black text-green-700 uppercase">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-black py-2 gap-4">
          <span className="font-black uppercase text-gray-500">
            Contract Generated
          </span>
          <span className="font-mono font-black">
            CTR-884-26R3
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-black py-2 gap-4">
          <span className="font-black uppercase text-gray-500">
            Payment Handled
          </span>
          <span className="font-mono font-black text-right">
            ₹{Number(amountCollected || 0)} via {paymentMethod}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 gap-4">
          <span className="font-black uppercase text-gray-500">
            Accessories
          </span>
          <span className="font-mono font-black">
            {accessories.length} Items Issued
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7 max-w-sm mx-auto">
        <button
          type="button"
          className="bg-white border-2 border-black py-3.5 font-black uppercase shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 text-sm"
        >
          <i className="ph ph-printer text-xl"></i>
          <span>Print Contract</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-black text-white border-2 border-black py-3.5 font-black uppercase shadow-[4px_4px_0px_#000] text-sm"
        >
          Open Dashboard
        </button>
      </div>
    </div>
  </div>
</div>
        );
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
                {/* Header */}
                <div className="bg-[#ffe600] border-b-4 border-black px-5 py-4 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="font-black uppercase text-lg">
                        Process Handover: {rental?.id || "RNT-884"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl leading-none font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-4 bg-white">
                    {/* 1. Verify Customer Identity */}
                    <section className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                        <h3 className="font-black uppercase text-base border-b-2 border-black pb-2 mb-3">
                            1. Verify Customer Identity
                        </h3>

                        <div className="font-mono text-sm space-y-2">
                            <p>
                                <span className="font-black">Name:</span>{" "}
                                {rental?.user || "Mike Ross"}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className="font-black">KYC Status:</span>
                                <span className="bg-[#ffe600] border-2 border-black px-2 py-1 font-black uppercase text-xs">
                                    Pending
                                </span>
                            </div>

                            <label className="mt-3 flex items-center gap-2 border-2 border-[#ffe600] bg-[#fffbd1] px-3 py-2 font-bold cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={identityVerified}
                                    onChange={(e) => setIdentityVerified(e.target.checked)}
                                    className="w-4 h-4 accent-black"
                                />
                                <span>I have physically verified the user's ID</span>
                            </label>
                        </div>
                    </section>

                    {/* 2. Assign Hardware */}
                    <section className="border-2 border-black bg-[#fffbd1] p-4 shadow-[4px_4px_0px_#000]">
                        <h3 className="font-black uppercase text-base border-b-2 border-black pb-2 mb-3">
                            2. Assign Hardware & Accessories
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="font-black uppercase text-xs">
                                    Console Serial Number <span className="text-[#ff3366]">*</span>
                                </label>

                                <input
                                    value={consoleSerialNumber}
                                    onChange={(e) => setConsoleSerialNumber(e.target.value)}
                                    placeholder="E.G. SN-PS5-998222"
                                    className="mt-1 w-full border-2 border-black px-3 py-3 font-mono uppercase outline-none shadow-[4px_4px_0px_#000]"
                                />
                            </div>

                            <div>
                                <p className="font-black uppercase text-xs mb-2">
                                    Accessories To Issue (Edit As Needed)
                                </p>

                                <div className="space-y-2">
                                    {accessories.map((item) => (
                                        <div
                                            key={item.id}
                                            className="grid grid-cols-[1fr_80px_36px] gap-2"
                                        >
                                            <input
                                                value={item.name}
                                                onChange={(e) =>
                                                    handleAccessoryChange(item.id, "name", e.target.value)
                                                }
                                                className="border-2 border-black px-3 py-2 font-mono outline-none shadow-[3px_3px_0px_#000]"
                                            />

                                            <input
                                                type="number"
                                                min={1}
                                                value={item.qty}
                                                onChange={(e) =>
                                                    handleAccessoryChange(item.id, "qty", e.target.value)
                                                }
                                                className="border-2 border-black px-3 py-2 font-mono outline-none shadow-[3px_3px_0px_#000]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="bg-[#ff3366] text-white border-2 border-black font-black shadow-[3px_3px_0px_#000]"
                                            >
                                                <i className="ph ph-trash text-sm"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="mt-3 border-2 border-black bg-white px-4 py-2 font-black uppercase text-xs border-dashed"
                                >
                                    + Add Item
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Payment Collection */}
                    <section className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
                        <div className="flex items-start justify-between gap-3 border-b-2 border-black pb-2 mb-3">
                            <h3 className="font-black uppercase text-base">
                                3. Payment Collection
                            </h3>

                            <span className="border-2 border-black bg-[#d7ffe4] px-3 py-1 font-black text-xs">
                                Wallet: ₹{walletBalance}
                            </span>
                        </div>

                        <div className="border-2 border-black bg-white p-3 mb-4 font-mono text-xs shadow-[3px_3px_0px_#000]">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-gray-500 font-black uppercase">
                                        Base Price: ₹{basePrice}
                                    </p>
                                    <p className="text-gray-500 font-black uppercase">
                                        Deposit Required: ₹{depositRequired}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-gray-500 font-black uppercase">
                                        Total Due At Handover
                                    </p>
                                    <p className="text-[#ff3366] font-black text-xl">
                                        ₹{totalDue}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="font-black uppercase text-xs">
                                    Amount Collected (₹) <span className="text-[#ff3366]">*</span>
                                </label>

                                <input
                                    type="number"
                                    min={0}
                                    value={amountCollected}
                                    onChange={(e) => setAmountCollected(e.target.value)}
                                    className="mt-1 w-full border-2 border-black px-3 py-3 font-mono font-black outline-none shadow-[4px_4px_0px_#000]"
                                />
                            </div>

                            <div>
                                <label className="font-black uppercase text-xs">
                                    Payment Method
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="mt-1 w-full border-2 border-black px-3 py-3 font-black uppercase outline-none shadow-[4px_4px_0px_#000] bg-white"
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="UPI">UPI</option>
                                    <option value="CARD">Card</option>
                                    <option value="WALLET">Wallet</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="w-full bg-[#00ff66] border-2 border-black py-4 font-black uppercase tracking-widest shadow-[5px_5px_0px_#000] flex items-center justify-center gap-2"
                    >
                        <i className="ph ph-check-square text-lg"></i>
                        <span>Confirm Handover</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessHandoverModal;