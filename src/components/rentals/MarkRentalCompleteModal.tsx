import React, { useState } from "react";

type FinalSettlementModalProps = {
  rental: any;
  onClose: () => void;
  onSettle?: (payload: {
    rentalId: string;
    handlingMethod: string;
  }) => void;
};

const FinalSettlementModal: React.FC<FinalSettlementModalProps> = ({
  rental,
  onClose,
  onSettle,
}) => {
  const [handlingMethod, setHandlingMethod] = useState("CASH");

  const rentalCharges = 1500;
  const extensionCharges = 450;
  const lateFees = 0;
  const accessoryPenalties = 0;
  const depositPaid = 5000;

  const totalCharges =
    rentalCharges + extensionCharges + lateFees + accessoryPenalties;

  const refundAmount = depositPaid - totalCharges;

  const handleSubmit = () => {
    onSettle?.({
      rentalId: rental?.id,
      handlingMethod,
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
      >
        {/* Header */}
        <div className="bg-[#ffe600] border-b-4 border-black px-5 py-5 flex items-center justify-between">
          <h2 className="font-black uppercase text-xl">
            Final Settlement: {rental?.id || "RNT-881"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl leading-none font-normal"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Rental Summary */}
          <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_#000]">
            <h3 className="font-black uppercase text-sm border-b-2 border-black pb-3 mb-3">
              Rental Summary
            </h3>

            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span>Base Rental Charges</span>
                <b>₹{rentalCharges}</b>
              </div>

              <div className="flex justify-between">
                <span>Extension Charges</span>
                <b>₹{extensionCharges}</b>
              </div>

              <div className="flex justify-between">
                <span>Late Fees</span>
                <b>₹{lateFees}</b>
              </div>

              <div className="flex justify-between text-[#ff3366]">
                <span>Accessory Penalties</span>
                <b>₹{accessoryPenalties}</b>
              </div>

              <div className="border-t-2 border-black pt-3 mt-3 flex justify-between font-black">
                <span>Total Charges</span>
                <span>₹{totalCharges}</span>
              </div>
            </div>
          </div>

          {/* Deposit Paid */}
          <div className="border-2 border-black bg-[#fffbd1] p-4 flex items-center justify-between font-mono">
            <span className="font-black uppercase">Deposit Paid</span>
            <b>₹{depositPaid}</b>
          </div>

          {/* Refund */}
          <div className="border-2 border-black bg-[#00ff66] p-4 flex items-center justify-between font-mono">
            <span className="font-black uppercase">Refund To User</span>
            <b className="text-2xl">₹{refundAmount}</b>
          </div>

          {/* Handling Method */}
          <div className="border-2 border-black bg-white p-4">
            <label className="block font-black uppercase text-sm mb-3">
              Handling Method
            </label>

            <select
              value={handlingMethod}
              onChange={(e) => setHandlingMethod(e.target.value)}
              className="w-full border-2 text-xs border-black bg-white px-3 py-3 font-[600] uppercase shadow-[4px_4px_0px_#000] outline-none"
            >
              <option value="CASH">Refund Via Cash</option>
              <option value="UPI">Refund Via UPI</option>
              <option value="WALLET">Refund To Wallet</option>
              <option value="BANK">Refund Via Bank</option>
            </select>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-[0.8fr_1.6fr] gap-4 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="bg-white border-2 border-black py-2 font-[700] uppercase shadow-[4px_4px_0px_#000]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#00ff66] border-2 border-black py-2 font-[700] uppercase shadow-[4px_4px_0px_#000]"
            >
              End Rental & Settle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSettlementModal;