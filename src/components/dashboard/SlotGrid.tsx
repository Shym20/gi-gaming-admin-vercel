import React from "react";

interface SlotGridProps {
  slots: Array<{ id: number; booked: boolean; color: string }>;
}

const SlotGrid: React.FC<SlotGridProps> = ({ slots }) => {
  const colors: Record<string, string> = {
    pink: "bg-[#ff3366]",
    green: "bg-[#00ff66]",
    yellow: "bg-[#ffea00]",
    white: "bg-white",
  };

  return (
    <div className="brutal-card p-6 bg-white border-4 border-black shadow-[6px_6px_0_black]">
      
      {/* Title */}
      <h3 className="font-bold uppercase text-lg border-b-2 border-black pb-2 mb-6">
        Slot Utilization
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-6 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`aspect-square border-2 border-black ${
              colors[slot.color]
            } hover:scale-110 transition-transform cursor-crosshair`}
            title={`Slot ${slot.id}`}
          />
        ))}
      </div>

      {/* Time Labels */}
      <div className="mt-6 flex justify-between text-xs font-mono font-bold border-t-2 border-black pt-2">
        <span>08:00</span>
        <span>22:00</span>
      </div>
    </div>
  );
};

export default SlotGrid;