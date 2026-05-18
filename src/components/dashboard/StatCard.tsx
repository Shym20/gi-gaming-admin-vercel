import React from "react";
import type { StatCard as StatCardType } from "../../types";

interface StatCardProps extends StatCardType { }

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgClass,
}) => {
  return (
    <div
      className="brutal-card p-6 relative overflow-hidden border-4 border-black"
      style={{
        backgroundColor: bgClass,
      }}
    >
      <h3 className="font-mono text-md font-bold uppercase mb-1 text-black">
        {title}
      </h3>

      <p className="text-4xl py-3 font-bold text-black">
        {value}
      </p>

      <i
        className={`${icon} absolute -bottom-4 -right-4 text-[100px] opacity-20`}
      ></i>
    </div>
  );
};

export default StatCard;