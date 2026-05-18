import React from "react";
import type { Booking } from "../../types/booking";
import StatusBadge from "../shared/StatusBadge";

interface Props {
    booking: Booking;
    onClose: () => void;
}

const BookingModal: React.FC<Props> = ({ booking, onClose }) => {
    const snacks = [
        {
            id: 1,
            name: "Salted Popcorn",
            quantity: 1,
        },
        {
            id: 2,
            name: "Coke (500ml)",
            quantity: 2,
        },
    ];

    const normalizedStatus = booking.status?.toLowerCase();
    const isPending = normalizedStatus === "pending";
    const isCompleted = normalizedStatus === "completed";
    const isCancelled = normalizedStatus === "cancelled";

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
                {/* Header */}
                <div className="bg-[#ffe600] border-b-4 border-black px-6 py-5 flex justify-between items-center">
                    <h2 className="font-black uppercase text-xl tracking-wide">
                        Booking Details: {booking.id}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-3xl leading-none font-normal hover:scale-110 transition-transform"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">
                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-[700] uppercase text-sm">
                                Customer
                            </p>
                            <p className="font-mono font-black text-blue-600 mt-1">
                                {booking.user || "-"}
                            </p>
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-[700] uppercase text-sm">
                                Center
                            </p>
                            <p className="font-mono font-black mt-1">
                                {booking.center || "-"}
                            </p>
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-[700] uppercase text-sm">
                                Time Slot
                            </p>
                            <p className="font-mono font-black mt-1">
                                {booking.slot || "-"}
                            </p>
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-[700] uppercase text-sm">
                                Amount
                            </p>
                            <p className="font-mono font-black mt-1">
                                ₹{booking.amount || 0}
                            </p>
                        </div>
                    </div>

                    {/* Ordered Snacks */}
                    <div className="border-2 border-black bg-[#fffbd1] p-4">
                        <p className="text-gray-500 font-[700] uppercase text-sm">
                            Ordered Snacks
                        </p>

                        <div className="border-t-2 border-black mt-2 pt-3 space-y-0">
                            {snacks.length === 0 ? (
                                <p className="font-mono font-bold text-sm text-gray-500">
                                    No snacks ordered
                                </p>
                            ) : (
                                snacks.map((snack) => (
                                    <div
                                        key={snack.id}
                                        className="flex items-center justify-between gap-4 font-mono font-black text-sm"
                                    >
                                        <span>{snack.name}</span>
                                        <span>x{snack.quantity}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="border-2 border-black bg-[#f4f4f0] p-3 flex items-center justify-between">
                        <p className="font-[700] uppercase text-[16px] ">Current Status</p>
                        <StatusBadge status={booking.status} />
                    </div>

                    {/* Action Buttons */}
                    {isPending ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="w-full bg-[#00ff66] text-[14px] text-black border-2 border-black py-3 font-[700] uppercase tracking-widest shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
                            >
                                Confirm Check-In
                            </button>

                            <button
                                type="button"
                                className="w-full bg-[#ff3366] text-[14px] text-white border-2 border-black py-3 font-[700] uppercase tracking-widest shadow-[5px_5px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
                            >
                                Cancel & Refund
                            </button>
                        </div>
                    ) : (
                        !isCompleted &&
                        !isCancelled && (
                            <button
                                type="button"
                                className="w-full bg-black text-white border-2 border-black py-2 font-black uppercase tracking-widest shadow-[6px_6px_0px_#999] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_#999] transition-all"
                            >
                                Complete Session
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;