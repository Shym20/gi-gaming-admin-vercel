import React from "react";
import type { StatCard as StatCardType } from "../../types";

interface StatCardProps extends StatCardType {}

const StatCard: React.FC<StatCardProps> = ({ id,title, value, icon, bgClass }) => {
  return (
    <div
      className={`brutal-card p-6  ${bgClass} relative overflow-hidden border-4 border-black`}
    >
      <h3 className={`font-mono text-md font-bold uppercase mb-2 text-${id=="users"?"white":"black"}` }>
        {title}
      </h3>

      <p className={`text-4xl py-3 font-bold ${id=="users"?"text-white":"text-black"}`}>
        {value}
      </p>

      <i
        className={`${icon}  absolute -bottom-4 -right-4 text-[100px] opacity-20`}
      ></i>
    </div>
  );
};

export default StatCard;