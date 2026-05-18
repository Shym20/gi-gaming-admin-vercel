import React, { useEffect, useState } from 'react';
import StatCard from '../dashboard/StatCard';
import RevenueChart from '../dashboard/RevenueChart';
import type { StatCard as StatCardType, RevenueData } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import DashboardApi from '../../apis/dashboard.api';

const dashboardService = new DashboardApi();

const Dashboard: React.FC = () => {

  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    todayRevenue: 0,
    todayBookings: 0,
    activeRentals: 0,
    totalUsers: 0,
    revenueLast7Days: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await dashboardService.getDashboard();

      if (res?.status === 200) {
        console.log("dvffg");
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards: StatCardType[] = [
    {
      id: "revenue",
      title: "TODAY'S REVENUE",
      value: formatCurrency(dashboardData.todayRevenue),
      icon: "ph ph-chart-bar",
      color: "green",
      bgClass: "#00ff66",
    },
    {
      id: "bookings",
      title: "TODAY'S BOOKINGS",
      value: dashboardData.todayBookings,
      icon: "ph ph-calendar-blank",
      color: "yellow",
      bgClass: "#ffea00",
    },
    {
      id: "rentals",
      title: "ACTIVE RENTALS",
      value: dashboardData.activeRentals,
      icon: "ph ph-game-controller",
      color: "cyan",
      bgClass: "#00e5ff",
    },
    {
      id: "users",
      title: "TOTAL USERS",
      value: dashboardData.totalUsers,
      icon: "ph ph-users",
      color: "pink",
      bgClass: "#ff3366",
    },
  ];

  const revenueData: RevenueData[] =
    dashboardData.revenueLast7Days.map((item: any) => ({
      day: item.day,
      amount: item.revenue,
    }));

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border-4 border-black bg-gray-200 p-6 shadow-[6px_6px_0px_#000] h-[150px]"
            >
              <div className="h-4 bg-gray-400 w-32 mb-6"></div>

              <div className="h-10 bg-gray-400 w-24 mb-4"></div>

              <div className="absolute"></div>
            </div>
          ))}
        </div>

        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Revenue Chart Skeleton */}
          <div className="lg:col-span-2 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
            <div className="h-5 bg-gray-300 w-52 mb-10"></div>

            <div className="flex items-end justify-between gap-4 h-56">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="w-full bg-gray-300 border-2 border-black"
                    style={{
                      height: `${40 + Math.random() * 120}px`,
                    }}
                  ></div>

                  <div className="h-3 bg-gray-300 w-8 mt-3"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Slot Grid Skeleton */}
          {/* <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_#000]">
            <div className="h-5 bg-gray-300 w-40 mb-8"></div>

            <div className="grid grid-cols-6 gap-2">
              {[...Array(36)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-300 border-2 border-black"
                ></div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-in-out]">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Charts and Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 min-h-[100%]">
          <RevenueChart data={revenueData} />
        </div>

        {/* Slot Utilization */}
        {/* <div>
          <SlotGrid slots={slots} />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
