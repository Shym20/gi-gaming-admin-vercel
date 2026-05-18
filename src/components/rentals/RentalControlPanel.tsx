import React, { useEffect, useState } from "react";
import StatusBadge from "../shared/StatusBadge";
import FinalSettlementModal from "./MarkRentalCompleteModal";
import ProcessHandoverModal from "./ProcessHandoverModal";
import UserRentalApi from "../../apis/user-rental.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const userRentalService = new UserRentalApi();

type RentControlPanelModalProps = {
    rental: any;
    onClose: () => void;
};

type RentalTimelineItem = {
    entityId: string;
    action: string;
    message: string;
    createdAt: string;
};

const RentControlPanelModal: React.FC<RentControlPanelModalProps> = ({
    rental,
    onClose,
}) => {

    const normalizedStatus = rental?.status?.toLowerCase();

    const rentalProductItems = rental?.rentalProductItems || [];
    const extraItems = rental?.items || [];

    const allItems = [
        ...rentalProductItems.map((item: any) => ({
            ...item,
            source: "Rental Product",
            returnStatus: rental?.returnStatus || "PENDING",
            penalty: "0",
        })),
        ...extraItems.map((item: any) => ({
            ...item,
            source: "Extra Accessory",
        })),
    ];

    const baseTotal = Number(rental?.totalAmount || 0);
    const deposit = Number(rental?.deposit || 0);
    const lateFee = Number(rental?.lateFee || 0);
    const penalty = Number(rental?.penalty || 0);
    const totalPenaltyAmount = Number(rental?.totalPenaltyAmount || 0);
    const walletBalance = Number(rental?.walletBalance || 0);

    const totalCharges = baseTotal + lateFee + penalty + totalPenaltyAmount;
    const netSettlement = deposit - totalCharges;

    const isOverdue = normalizedStatus === "overdue";
    const isReturned = normalizedStatus === "returned";
    const isPending =
        normalizedStatus === "pending" ||
        normalizedStatus === "pending_payment";

    const [settlementOpen, setSettlementOpen] = useState(false);
    const [handoverOpen, setHandoverOpen] = useState(false);

    const navigate = useNavigate();

    const [timeline, setTimeline] = useState<RentalTimelineItem[]>([]);
    const [timelineLoading, setTimelineLoading] = useState(false);

    useEffect(() => {
        if (rental?.id) {
            fetchRentalActivityTimeline();
        }
    }, [rental?.id]);

    const fetchRentalActivityTimeline = async () => {
        try {
            setTimelineLoading(true);

            const res = await userRentalService.getRentalActivityTimeline(
                rental.id,
                1000
            );

            if (res?.status === 200 && res?.data?.success) {
                setTimeline(res.data.data || []);
            } else {
                toast.error(res?.data?.message || "Failed to fetch activity timeline");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while fetching activity timeline");
        } finally {
            setTimelineLoading(false);
        }
    };

    const formatTimelineDate = (date?: string) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatTimelineAction = (action?: string) => {
        if (!action) return "-";

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-6xl max-h-[92vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent"
            >
                {/* Header */}
                <div className="bg-[#ffe600] border-b-4 border-black px-6 py-4 flex items-center justify-between">
                    <h2 className="font-black uppercase text-lg">
                        Rental Control Panel: {rental?.rentId || rental?.id || "--"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl leading-none font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-4">

                    {/* Status Summary */}
                    {isOverdue && (
                        <div className="bg-[#ff3366] text-white border-4 border-black px-4 py-3 font-black uppercase text-sm flex items-center gap-2">
                            <i className="ph ph-warning-circle text-base"></i>
                            <span>Overdue rental is past due! Late fees accumulating.</span>
                        </div>
                    )}

                    {isPending && (
                        <div className="bg-[#ffe600] text-black border-4 border-black shadow-[4px_4px_0px_#000] px-4 py-3 font-black uppercase text-sm flex items-center gap-2">
                            <i className="ph ph-hourglass text-lg"></i>
                            <span>Pending: Waiting for user to pickup the hardware.</span>
                        </div>
                    )}

                    {isReturned && (
                        <div className="bg-[#00ff66] border-4 border-black shadow-[6px_6px_0px_#000] p-6">
                            {/* Header */}
                            <div className="flex items-center gap-3 border-b-4 border-black pb-2 mb-3">
                                <i className="ph ph-check-circle text-3xl"></i>
                                <h3 className="font-black uppercase text-xl ">
                                    Rental Completed
                                </h3>
                            </div>

                            {/* Summary Card */}
                            <div className="bg-white border-2 border-black p-5 grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
                                <div>
                                    <p className="text-gray-500 font-[600] uppercase text-xs">
                                        Rental Charges
                                    </p>
                                    <p className="font-mono font-black text-xl mt-1">₹800</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 font-[600] uppercase text-xs">
                                        Extra Fees (Ext/Late)
                                    </p>
                                    <p className="font-mono font-black text-xl mt-1">₹0</p>
                                </div>

                                <div>
                                    <p className="text-[#ff3366] font-[600] uppercase text-xs">
                                        Acc. Penalties
                                    </p>
                                    <p className="font-mono font-black text-xl mt-1 text-[#ff3366]">
                                        ₹1200
                                    </p>
                                </div>

                                <div className="md:border-l-4 md:border-black md:pl-5">
                                    <p className="text-gray-500 font-[600] uppercase text-xs">
                                        Net Final Balance
                                    </p>
                                    <p className="font-mono font-black text-2xl mt-1">
                                        Refunded ₹500
                                    </p>
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="mt-5 flex items-center gap-3 font-black uppercase text-xs">
                                <span>Payment Handled Via:</span>
                                <span className="bg-black text-white px-1 py-1 border-2 border-black">
                                    UPI
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Top Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-black uppercase text-xs">
                                Customer
                            </p>
                            <p className="font-mono font-black text-blue-600 mt-1">
                                {rental?.userName || "Unknown"}
                            </p>
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-black uppercase text-xs">
                                Console & Type
                            </p>
                            <p className="font-mono font-black mt-1">
                                {rental?.rentalProductName || "-"}
                            </p>
                            <p className="font-[700] uppercase text-[10px] mt-1">
                                Via {rental?.deliveryType || "Delivery"}
                            </p>
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 mb-1 font-black uppercase text-xs">
                                Live Status
                            </p>
                            <StatusBadge status={rental.status} />
                        </div>

                        <div className="border-2 border-black bg-[#f9fafb] p-4">
                            <p className="text-gray-500 font-black uppercase text-xs">
                                Live Timer
                            </p>
                            <p className="font-mono font-black mt-1">
                                02:45:10
                            </p>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4">
                        {/* Left Side */}
                        <div className="space-y-4">
                            {/* Accessories */}
                            <div className="border-2 border-black bg-[#f9fafb] p-4">
                                <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-3 flex items-center gap-2">
                                    <i className="ph ph-game-controller text-lg"></i>
                                    <span>Accessories Tracking & Penalties</span>
                                </h3>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-[#e5e7eb] border-b border-black">
                                                <th className="p-2 border-r border-black">
                                                    Item Issued
                                                </th>
                                                <th className="p-2 border-r border-black text-center">
                                                    Qty
                                                </th>
                                                <th className="p-2 border-r border-black">
                                                    Return Status
                                                </th>
                                                <th className="p-2 text-[#ff3366]">
                                                    Penalty (₹)
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {allItems.map((item: any) => (
                                                <tr key={`${item.productId}-${item.source}`} className="border-b border-gray-300">
                                                    <td className="p-2 border-r border-black font-bold">
                                                        <div className="font-bold">{item.productName} {item.sourceType === "CUSTOM" && "(Extra)"}</div>
                                                        <div className="text-[10px] uppercase text-gray-500 font-black">
                                                            {item.source}
                                                        </div>
                                                    </td>

                                                    <td className="p-2 border-r border-black text-center font-bold">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="p-2 border-r border-black">
                                                        <select
                                                            defaultValue={item.returnStatus || "PENDING"}
                                                            disabled={isReturned || isPending}
                                                            className={`w-full border-2 border-black px-2 py-1 font-bold ${(isReturned || isPending)
                                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-80"
                                                                : "bg-white"
                                                                }`}
                                                        >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="RETURNED">Returned</option>
                                                            <option value="DAMAGED">Damaged</option>
                                                            <option value="MISSING">Missing</option>

                                                        </select>
                                                    </td>

                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            defaultValue={Number(item.penalty || 0)}
                                                            min={0}
                                                            disabled={isReturned || isPending}
                                                            className={`w-full border-2 border-black px-2 py-1 font-bold ${(isReturned || isPending)
                                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-80"
                                                                : "bg-white"
                                                                }`}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Charges */}
                            <div className="border-2 border-black bg-[#ffe600] p-4">
                                <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-3 flex items-center gap-2">
                                    <i className="ph ph-calculator text-lg"></i>
                                    <span>Total Charges Calculation</span>
                                </h3>

                                <div className="space-y-2 font-mono text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Rental Amount</span>
                                        <b>₹{baseTotal}</b>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Late Fees Applied</span>
                                        <b>₹{lateFee}</b>
                                    </div>

                                    <div className="flex justify-between text-[#ff3366]">
                                        <span>Rental Penalty</span>
                                        <b>₹{penalty}</b>
                                    </div>

                                    <div className="flex justify-between text-[#ff3366]">
                                        <span>Accessory Penalties</span>
                                        <b>₹{totalPenaltyAmount}</b>
                                    </div>

                                    <div className="border-t-2 border-black pt-3 mt-3 flex justify-between font-black">
                                        <span>Total Computed Charges</span>
                                        <span className="text-lg">₹{totalCharges}</span>
                                    </div>

                                    <div className="bg-white border-2 border-black p-2 flex justify-between items-center">
                                        <span className="text-xs font-black uppercase">
                                            Deposit Paid
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <b>₹{deposit}</b>
                                            <button
                                                disabled={isReturned || isPending}
                                                className={`px-2 py-1 text-[10px] font-black uppercase ${isReturned || isPending
                                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                    : "bg-black text-white"
                                                    }`}
                                            >
                                                <i className="ph ph-pencil-simple text-xs mr-1"></i>
                                                Edit
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t-2 border-black pt-3 flex justify-between font-black">
                                        <span>Net Settlement Adjustment</span>

                                        {netSettlement >= 0 ? (
                                            <span className="text-green-700">
                                                Refund: ₹{netSettlement}
                                            </span>
                                        ) : (
                                            <span className="text-[#ff3366]">
                                                Due: ₹{Math.abs(netSettlement)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="border-t border-dashed border-black pt-2 flex justify-between text-green-700">
                                        <span>⇢ User Wallet Balance</span>
                                        <b>₹{walletBalance}</b>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="space-y-4">
                            {/* Contract */}
                            <div className="border-2 border-black bg-[#d9fbff] p-4">
                                <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-3 flex items-center gap-2">
                                    <i className="ph ph-file-text text-lg"></i>
                                    <span>Contract Management</span>
                                </h3>

                                <div className="bg-white border-2 border-black p-4 font-mono text-xs">
                                    <p>ACTIVE CONTRACT ID:</p>
                                    <p className="font-black">CTR-M81-A</p>

                                    <p className="mt-3">DATE GENERATED:</p>
                                    <p className="font-black">2023-10-25 10:00 AM</p>

                                    <button className="mt-3 bg-[#00ff66] border-2 border-black px-3 py-1 font-black uppercase text-[10px]">
                                        ✓ Digitally Signed by User
                                    </button>
                                </div>

                                <button className="mt-3 w-full bg-white border-2 border-black py-2 font-black uppercase flex items-center justify-center gap-2">
                                    <i className="ph ph-download-simple text-lg"></i>
                                    <span>Download PDF</span>
                                </button>
                            </div>

                            {/* Timeline */}
                            <div className="border-2 border-black bg-white p-4">
                                <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                                    <i className="ph ph-truck text-lg"></i>
                                    <span>Activity Timeline</span>
                                </h3>

                                <div className="max-h-[300px] overflow-y-auto pr-2">
                                    {timelineLoading ? (
                                        <div className="space-y-5">
                                            {[...Array(4)].map((_, index) => (
                                                <div key={index} className="flex gap-4 animate-pulse">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-6 h-6 rounded-full border-2 border-black bg-gray-300" />
                                                        {index !== 3 && (
                                                            <div className="w-[3px] h-14 bg-gray-300 mt-1" />
                                                        )}
                                                    </div>

                                                    <div className="flex-1 pb-4">
                                                        <div className="h-4 bg-gray-300 w-40 mb-2"></div>
                                                        <div className="h-3 bg-gray-300 w-28 mb-2"></div>
                                                        <div className="h-3 bg-gray-300 w-full"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : timeline.length === 0 ? (
                                        <div className="border-2 border-black bg-[#f4f4f0] p-4 font-black uppercase text-center">
                                            No activity found
                                        </div>
                                    ) : (
                                        <div className="space-y-0">
                                            {timeline.map((item, index) => {
                                                const isLatest = index === 0;
                                                const isLast = index === timeline.length - 1;

                                                return (
                                                    <div key={`${item.entityId}-${index}`} className="flex gap-4">
                                                        {/* Left timeline rail */}
                                                        <div className="flex flex-col items-center">
                                                            <div
                                                                className={`w-7 h-7 rounded-full border-2 border-black flex items-center justify-center shrink-0 ${isLatest ? "bg-[#00ff66]" : "bg-white"
                                                                    }`}
                                                            >
                                                                {isLatest ? (
                                                                    <i className="ph ph-check text-sm font-black"></i>
                                                                ) : (
                                                                    <div className="w-2 h-2 rounded-full bg-black" />
                                                                )}
                                                            </div>

                                                            {!isLast && (
                                                                <div
                                                                    className={`w-[3px] min-h-[70px] ${isLatest ? "bg-[#00ff66]" : "bg-black"
                                                                        }`}
                                                                />
                                                            )}
                                                        </div>

                                                        {/* Right content */}
                                                        <div className="flex-1 pb-5">
                                                            <div
                                                                className={`border-2 border-black p-3 shadow-[3px_3px_0px_#000] ${isLatest ? "bg-[#eaffef]" : "bg-[#f8f8f8]"
                                                                    }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        <p className="font-black uppercase text-sm">
                                                                            {formatTimelineAction(item.action)}
                                                                        </p>

                                                                        <p className="font-mono text-[11px] text-gray-500 mt-1">
                                                                            {formatTimelineDate(item.createdAt)}
                                                                        </p>
                                                                    </div>

                                                                    {isLatest && (
                                                                        <span className="bg-[#00ff66] border-2 border-black px-2 py-1 text-[10px] font-black uppercase whitespace-nowrap">
                                                                            Latest
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="font-bold text-gray-700 text-xs mt-3 leading-relaxed">
                                                                    {item.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Profile Shortcut */}
                            <div className="border-2 border-black bg-white p-4">
                                <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-3 flex items-center gap-2">
                                    <i className="ph ph-user-circle text-lg"></i>
                                    <span>User Profile Shortcut</span>
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();

                                        navigate("/admin/users", {
                                            state: {
                                                openUserId: rental?.userId,
                                                openUserName: rental?.userName,
                                            },
                                        });
                                    }}
                                    className="w-full border-2 border-black bg-white px-3 py-2 font-black uppercase text-xs flex items-center justify-between"
                                >
                                    <span>View Complete Profile & History</span>
                                    <i className="ph ph-arrow-right text-base"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    {isPending ? (
                        <div className="border-t-2 border-black pt-4">
                            <button
                                type="button"
                                onClick={() => setHandoverOpen(true)}
                                className="w-full bg-[#00ff66] text-black border-2 border-black py-3 font-black uppercase tracking-widest shadow-[5px_5px_0px_#000] flex items-center justify-center gap-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
                            >
                                <i className="ph ph-handshake text-2xl"></i>
                                <span>Process Pickup Handover</span>
                            </button>
                        </div>
                    ) : (
                        !isReturned && (
                            <div className="border-t-2 border-black pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setSettlementOpen(true)}
                                    className="bg-black text-white border-2 border-black py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_#ff3366] flex items-center justify-center gap-2"
                                >
                                    <i className="ph ph-check-square text-lg"></i>
                                    <span>Mark Returned</span>
                                </button>

                                <button className="bg-[#ffe600] text-black border-2 border-black py-3 font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2">
                                    <i className="ph ph-arrows-left-right text-lg"></i>
                                    <span>Extend & Re-Sign</span>
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>

            {settlementOpen && (
                <FinalSettlementModal
                    rental={rental}
                    onClose={() => setSettlementOpen(false)}
                    onSettle={(payload) => {
                        console.log("Settlement payload:", payload);
                    }}
                />
            )}

            {handoverOpen && (
                <ProcessHandoverModal
                    rental={rental}
                    onClose={() => setHandoverOpen(false)}
                    onConfirm={(payload) => {
                        console.log("Handover payload:", payload);
                    }}
                />
            )}
        </div>
    );
};

export default RentControlPanelModal;