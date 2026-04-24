import { Routes, Route, Navigate } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import type { JSX } from "react"
import { useSelector } from "react-redux";
import type { RootState } from "../redux/redux-store/store";

import Dashboard from "../components/admin/Dashboard"
import Bookings from "../components/admin/Bookings"
import Rentals from "../components/admin/Rentals"
import Users from "../components/admin/Users"
import Centers from "../components/admin/Centers"
import Products from "../components/admin/Products"
import Snacks from "../components/admin/Snacks"

function AdminApp(): JSX.Element {

  const token = useSelector(
  (state: RootState) => state.user.giGamingAdmin_auth_token
);

  console.log("AdminApp Token:", token);

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="users" element={<Users />} />
        <Route path="centers" element={<Centers />} />
        <Route path="products" element={<Products />} />
        <Route path="snacks" element={<Snacks />} />
      </Routes>
    </AdminLayout>
  )
}

export default AdminApp