import React from 'react';
import StatCard from '../dashboard/StatCard';
import RevenueChart from '../dashboard/RevenueChart';
import SlotGrid from '../dashboard/SlotGrid';
import type { StatCard as StatCardType, RevenueData } from '../../types';
import { formatCurrency } from '../../utils/formatters';

const Dashboard: React.FC = () => {
  // Sample stat cards data
  const statCards: StatCardType[] = [
    {
      id: 'revenue',
      title: "TODAY'S REVENUE",
      value: formatCurrency(45280),
      icon: 'ph ph-chart-bar',
      color: 'green',
      bgClass: 'bg-[#00ff66]',
    },
    {
      id: 'bookings',
      title: "TODAY'S BOOKINGS",
      value: 142,
      icon: 'ph ph-calendar-blank',
      color: 'yellow',
      bgClass: 'bg-[#ffea00]',
    },
    {
      id: 'rentals',
      title: 'ACTIVE RENTALS',
      value: 28,
      icon: 'ph ph-game-controller',
      color: 'cyan',
      bgClass: 'bg-[#00e5ff]',
    },
    {
      id: 'users',
      title: 'TOTAL USERS',
      value: '3,402',
      icon: 'ph ph-users',
      color: 'pink',
      bgClass: 'bg-[#ff3366]',
    },
  ];

  // Sample revenue data
  const revenueData: RevenueData[] = [
    { day: 'Mon', amount: 4500 },
    { day: 'Tue', amount: 3800 },
    { day: 'Wed', amount: 5200 },
    { day: 'Thu', amount: 4800 },
    { day: 'Fri', amount: 6100 },
    { day: 'Sat', amount: 5500 },
    { day: 'Sun', amount: 4200 },
  ];

  // Sample slot data
  const slots = Array.from({ length: 36 }, (_, i) => {
    const colors = ['pink', 'green', 'yellow', 'white'];
    return {
      id: i + 1,
      booked: i % 3 !== 0,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Charts and Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 min-h-[100%]">
          <RevenueChart data={revenueData} />
        </div>

        {/* Slot Utilization */}
        <div>
          <SlotGrid slots={slots} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
