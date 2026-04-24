import React from "react";
import { formatDate } from "../../utils/formatters";

const Header: React.FC = () => {
  const today: Date = new Date();
  const dateStr: string = formatDate(today);

  return (
    <header className="bg-white border-b-4 border-black p-4 flex justify-between items-center z-30 flex-shrink-0">
      <div className="font-mono font-bold text-md hidden sm:block py-4">
        {dateStr}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00ff66] border-2 border-black"></span>
        </span>

        <span className="font-mono text-md font-bold uppercase">
          System Online
        </span>
      </div>
    </header>
  );
};

export default Header;