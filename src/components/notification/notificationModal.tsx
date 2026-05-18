type NotificationModalProps = {
  onClose: () => void;
};

const notifications = [
  {
    id: 1,
    icon: "ph-wallet",
    title: "Wallet Recharged",
    description: "User wallet was recharged successfully.",
    time: "2 min ago",
    highlight: true,
  },
  {
    id: 2,
    icon: "ph-user-plus",
    title: "New User Created",
    description: "A new customer account was added by admin.",
    time: "15 min ago",
    highlight: false,
  },
  {
    id: 3,
    icon: "ph-warning-circle",
    title: "Low Stock Alert",
    description: "Some store products are running low in stock.",
    time: "1 hour ago",
    highlight: false,
  },
  {
    id: 4,
    icon: "ph-warning-circle",
    title: "New Booking",
    description: "New booking at ElectroGaming Center.",
    time: "1 hour ago",
    highlight: false,
  },
  {
    id: 5,
    icon: "ph-warning-circle",
    title: "Payment Overdue",
    description: "Payment for rental product is overdue (which was due on 10 May 26).",
    time: "1 hour ago",
    highlight: false,
  },
];

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-end p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-sm mt-16"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#ffe600] px-4 py-3">
          <div>
            <h2 className="text-lg font-black uppercase">Notifications</h2>
            <p className="text-[10px] font-bold uppercase font-mono">
              Latest admin alerts
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

        {/* Body */}
        <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`border-2 border-black p-3 shadow-[3px_3px_0px_#000] ${item.highlight ? "bg-[#f4f4f0]" : "bg-white"
                }`}
            >
              <div className="flex items-start gap-2">
                <i className={`ph ${item.icon} text-xl`}></i>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black text-sm uppercase">{item.title}</p>

                    <p className="text-[10px] font-bold text-gray-500 whitespace-nowrap">
                      {item.time}
                    </p>
                  </div>

                  <p className="text-xs font-mono text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;