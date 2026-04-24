import { useState } from "react"
import SearchBar from "../shared/Searchbar"
import UserModal from "../users/userModal"
import type { User } from "../../types/apptypes"
import { useApp } from "../../context/AppContext"
import StatusBadge from "../shared/StatusBadge"

const tableHeaders = [
  { label: "ID", className: "p-4 border-r-2 border-black" },
  { label: "User Info", className: "p-4 border-r-2 border-black" },
  { label: "Wallet", className: "p-4 border-r-2 border-black" },
  { label: "KYC Status", className: "p-4 border-r-2 border-black" },
  { label: "Status", className: "p-4 border-r-2 border-black" },
  { label: "Joined", className: "p-4 border-r-2 border-black text-right" },
  { label: "Actions", className: "p-4 text-center" }
]

const Users = () => {
  const { users, rentals } = useApp()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userList, setUserList] = useState<User[]>(users)

  // ✅ Save user (replaces saveUser)
  // const handleSaveUser = (updatedUser: User) => {
  //   setUserList((prev) =>
  //     prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
  //   )
  // }
  const handleSaveUser = (updatedUser: User) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === updatedUser.id
          ? { ...updatedUser, name: updatedUser.name || "" } // ✅ force string
          : u
      )
    )
  }

  // ✅ Toggle status (replaces toggleUserStatus)
  const toggleUserStatus = (id: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u

        // Check blocking rentals
        if (u.status === "ACTIVE") {
          const blockingRentals = rentals.filter(
            (r) =>
              r.userId === id &&
              ["PENDING", "ACTIVE", "OVERDUE"].includes(r.status)
          )

          if (blockingRentals.length > 0) {
            alert(
              `Cannot suspend user with open rentals: ${blockingRentals
                .map((r) => r.id)
                .join(", ")}`
            )
            return u // ❌ Don't update
          }

          return { ...u, status: "SUSPENDED" }
        }

        // ✅ Activate user
        return { ...u, status: "ACTIVE" }
      })
    )
  }

  return (
    <div className="">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase ">
          Users Management
        </h2>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search ID or User..."
        />
      </div>
      <div className="brutal-card overflow-x-auto">
        <table className="w-full text-left  min-w-[800px] border-2 border-black">
          <thead >
            <tr className="bg-[#00e5ff] border-b-4 py-4 border-black font-bold uppercase text-sm">
              {tableHeaders.map((header, index) => (
                <th key={index} className={header.className + " bg-[#ffea00] border-b-4 border-black font-bold uppercase text-sm"}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="font-mono text-sm">
            {userList.map((u) => (
              <tr key={u.id} className="border-b-2 border-black hover:bg-[#f4f4f0] transition-colors">
                <td className="p-4 border-r-2 border-black font-bold" >{u.id}</td>
                <td className="p-4 border-r-2 border-black">
                  <button className="font-sans font-bold uppercase text-xs text-blue-600 hover:underline text-left">{u.name || 'Unknown'}</button>
                  <div className="text-gray-600 font-mono">{u.phone}</div>
                </td>
                <td className="p-4 border-r-2 border-black">₹{u.balance}</td>
                <td className="p-4 border-r-2 border-black"> <StatusBadge status={u.kycStatus} /></td>
                <td className="p-4 border-r-2 border-black"> <StatusBadge status={u.status} /></td>
                <td className="p-4 border-r-2 border-black text">{u.joined}</td>
                <td className="p-4 text-center flex justify-center gap-2">
                  <button
                    onClick={() => setSelectedUser(u)}
                    className="brutal-btn brutal-btn-secondary brutal-hover px-1 py-1  border-2 border-black brutal-shadow"
                  >
                    <i className="ph ph-eye text-lg"></i>
                  </button>

                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className={`brutal-btn brutal-hover px-1 py-1 border-2 border-black brutal-shadow ${u.status === "ACTIVE"
                      ? "bg-[#ff3366] text-white"
                      : "bg-[#00ff66] text-black"
                      }`}
                  >
                    <i className="ph ph-power text-lg"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      {/* Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => setSelectedUser(null)} bookings={[]} transactions={[]}        />
      )}
    </div>
  )
}

export default Users