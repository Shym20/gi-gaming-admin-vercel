import React, { useState } from "react"
import StatusBadge from "../shared/StatusBadge"
import type { User } from "../../types/apptypes"

interface Booking {
  id: string
  center: string
  slot: string
  amount: number
  status: string
}

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: "CREDIT" | "DEBIT"
}

interface Props {
  user: User
  bookings: Booking[]
  transactions: Transaction[]
  onSave: (user: User) => void
  onClose: () => void
}

const UserModal: React.FC<Props> = ({
  user,
  bookings = [],
  transactions = [],
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<User>({ ...user })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="w-[95%] max-w-6xl bg-white border-4 border-black brutal-shadow max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="bg-[#ffea00] border-b-4 border-black flex justify-between items-center px-6 py-3">
          <h2 className="font-black uppercase text-lg">
            Manage Profile: {user.name}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">✕</button>
        </div>

        {/* BODY */}
        <div className="flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto mb-3">

          {/* LEFT SIDE */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 space-y-4"
          >
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <div>
                <p className="text-xs uppercase font-bold text-gray-500">
                  User Profile
                </p>
                <p className="font-bold">{user.id}</p>
              </div>
              <StatusBadge status={user.status} />
            </div>

            {/* NAME + EMAIL */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Full Name</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="brutal-input  border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                  placeholder="Full Name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Email Address</label>
                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                  placeholder="Email"
                />
              </div>
            </div>
            {/* PHONE + LOCATION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Phone Number</label>
                <input
                  value={user.phone}
                  disabled
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Location / Address</label>
                <input
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                  placeholder="Location"
                />
              </div>
            </div>

            {/* KYC */}
            <div className="border-2 border-black p-4 bg-yellow-100">
              <p className="font-bold border-b-2 border-black mb-2">
                KYC & Verification
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-sm uppercase">Aadhaar Number</label>

                  <input
                    name="aadhaar"
                    value={formData.aadhaar || ""}
                    onChange={handleChange}
                    className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                    placeholder="Aadhaar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-sm uppercase">PAN Number</label>
                  <input
                    name="pan"
                    value={formData.pan || ""}
                    onChange={handleChange}
                    className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                    placeholder="PAN"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <select
                  name="kycStatus"
                  value={formData.kycStatus}
                  onChange={handleChange}
                  className="brutal-input flex-1"
                >
                  <option value="PENDING">Status: PENDING</option>
                  <option value="VERIFIED">Status: VERIFIED</option>
                  <option value="REJECTED">Status: REJECTED</option>
                </select>

               <div className="flex items-center">
                 <StatusBadge status={formData.kycStatus} />
               </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 border-2 border-black text-center p-4">
              <div className=" border-r-2 border-black">
                <p className="font-bold text-lg">₹{user.balance}</p>
                <p className="text-xs text-gray-500">Wallet Balance</p>
              </div>
              <div className="">
                <p className="font-bold text-lg">{user.bookings}</p>
                <p className="text-xs text-gray-500">Total Bookings</p>
              </div>
            </div>

            <button className="brutal-btn brutal-btn-primary w-full border-2 border-black  brutal-shadow">
              Save Profile Changes
            </button>
          </form>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">

            {/* BOOKINGS */}
            <div>
              <div className="flex flex-row justify-start items-center gap-2 border-b-4 mb-2 border-black">
                <i className="ph ph-calendar-blank"></i>
              <h3 className="font-black uppercase">
                 Booking History
              </h3>
              </div>

              <table className="w-full border-2 border-black text-sm">
                <thead className="bg-cyan-400">
                  <tr>
                    <th className="p-2 border-r-2">ID</th>
                    <th className="p-2 border-r-2">Slot</th>
                    <th className="p-2 border-r-2">Amt</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-t-2">
                      <td className="p-2">{b.id}</td>
                      <td className="p-2">{b.center}</td>
                      <td className="p-2">₹{b.amount}</td>
                      <td className="p-2">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TRANSACTIONS */}
            <div>
                <div className="flex flex-row justify-start items-center gap-2 border-b-4 mb-2 border-black">
              <h3 className="font-black">
                   <i className="ph ph-wallet"></i> Wallet Transactions
              </h3>
              </div>

              <table className="w-full border-2 border-black text-sm">
                <thead className="bg-yellow-300">
                  <tr>
                    <th className="p-2 border-r-2">ID</th>
                    <th className="p-2 border-r-2">Date</th>
                    <th className="p-2 border-r-2">Desc</th>
                    <th className="p-2">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-t-2">
                      <td className="p-2">{t.id}</td>
                      <td className="p-2">{t.date}</td>
                      <td className="p-2">{t.description}</td>
                      <td
                        className={`p-2 font-bold ${t.type === "CREDIT"
                          ? "text-green-500"
                          : "text-red-500"
                          }`}
                      >
                        {t.type === "CREDIT" ? "+" : "-"}₹{t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserModal