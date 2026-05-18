import { useEffect, useState } from "react"
import UserModal from "../users/userModal"
import { useLocation } from "react-router-dom";
import type { User } from "../../types/apptypes"
import { useApp } from "../../context/AppContext"
import StatusBadge from "../shared/StatusBadge"
import UserApi from "../../apis/user.api"
import toast from "react-hot-toast"
import UserWalletUpdateModal from "../users/userWalletUpdateModal"
import CreateUserModal from "../users/createUserModal"

const userService = new UserApi();

const tableHeaders = [
  { label: "ID", className: "p-4 border-r-2 border-black" },
  { label: "User Info", className: "p-4 border-r-2 border-black" },
  { label: "Wallet", className: "p-4 border-r-2 border-black" },
  { label: "KYC Status", className: "p-4 border-r-2 border-black" },
  { label: "Status", className: "p-4 border-r-2 border-black" },
  { label: "Joined", className: "p-4 border-r-2 border-black" },
  { label: "Actions", className: "p-4 text-center" }
]

const Users = () => {
  const { rentals } = useApp()
  const [searchQuery] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const [walletUser, setWalletUser] = useState<any | null>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [walletTransactionLoading, setWalletTransactionLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false);
  const location = useLocation();

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (currentPage = page) => {
    try {
      setLoading(true);

      const res = await userService.getAllUsers(currentPage, limit);

      if (res?.status === 200) {
        const data = res.data?.data || [];

        const formattedUsers = data.map((item: any) => ({
          id: item.id,
          userId: item.userId,
          name: item.name,
          phone: item.phone,
          email: item.email,
          status: item.status,
          kycStatus: item.kycStatus,
          isCreatedByAdmin: item.adminCreated,
          joined: item.joinDate
            ? new Date(item.joinDate).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "-",
          balance: Number(item.walletBalance || item.balance || 0),
          walletBalance: Number(item.walletBalance || item.balance || 0),
        }));

        setUserList(formattedUsers);
        setTotalUsers(res.data?.pagination?.total || 0);
        setTotalPages(res.data?.pagination?.totalPages || 1);
        setPage(currentPage);
      } else {
        toast.error(res?.data?.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletTransactions = async (userId: string) => {
    try {
      setWalletTransactionLoading(true);

      const res = await userService.getWalletTransaction(userId, 1, 10);

      if (res?.status === 200) {
        const data = res.data?.data || [];

        const formattedTransactions = data.map((item: any) => {
          const transactionDate = item.date || item.createdAt || item.updatedAt;

          return {
            id: item.transactionId || item.id || "-",
            date: transactionDate
              ? new Date(transactionDate).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
              : "-",
            description: item.description || "Wallet transaction",
            amount: Number(item.amount || 0),
            type: item.type || "CREDIT",
          };
        });

        setWalletTransactions(formattedTransactions);
      } else {
        setWalletTransactions([]);
        toast.error(res?.data?.message || "Failed to fetch wallet transactions");
      }
    } catch (error) {
      console.error(error);
      setWalletTransactions([]);
      toast.error("Something went wrong while fetching wallet transactions");
    } finally {
      setWalletTransactionLoading(false);
    }
  };

  const handleOpenUserModal = async (id: string) => {
    try {
      setUserDetailLoading(true);

      const res = await userService.getUserById(id);

      if (res?.status === 200) {
        const item = res.data?.data;

        const formattedUser = {
          id: item.id,
          userId: item.userId,
          name: item.name,
          email: item.email,
          phone: item.phone,
          role: item.role,
          status: item.status,
          // modal currently uses location
          location: item.address || "",
          // keep original address fields also
          address: item.address || "",
          city: item.city || "",
          state:
            item.state?.toLowerCase() === "madhya pradesh"
              ? "Madhya Pradesh"
              : item.state || "",
          country: item.country || "",

          aadhaar: item.aadhaar || item.aadhar || "",
          pan: item.pan || "",
          // avatar: item.avatar || "",
          kycStatus: item.kycStatus || "NOT_SUBMITTED",

          // modal currently uses balance and bookings
          balance: Number(item.walletBalance || 0),
          walletBalance: Number(item.walletBalance || 0),
          bookings: item.totalBooking || 0,
          totalBooking: item.totalBooking || 0,
        } as any;

        setSelectedUser(formattedUser);
        await fetchWalletTransactions(item.id);

      } else {
        toast.error(res?.data?.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching user details");
    } finally {
      setUserDetailLoading(false);
    }
  };

  useEffect(() => {
  const state = location.state as {
    openUserId?: string;
    openUserName?: string;
  } | null;

  if (!state?.openUserId) return;

  handleOpenUserModal(state.openUserId);

  // clear route state so modal does not reopen on refresh/back
  window.history.replaceState({}, document.title);
}, [location.state]);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleSaveUser = async (updatedUser: any) => {
    try {
      const payload = {
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        // avatar: updatedUser.avatar || "",
        address: updatedUser.address || updatedUser.location || "",
        city: updatedUser.city || "",
        state: updatedUser.state || "",
        country: updatedUser.country || "",
      };

      const res = await userService.updateUserDetail(updatedUser.id, payload);

      if (res?.status === 200) {
        toast.success(res?.data?.message || "User updated successfully");

        setSelectedUser(null);

        await fetchUsers(page);
      } else {
        toast.error(res?.data?.message || "Failed to update user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating user");
    }
  };

  const toggleUserStatus = async (user: any) => {
    try {
      const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

      // Optional frontend blocking check before suspend
      if (nextStatus === "SUSPENDED") {
        const blockingRentals = rentals.filter(
          (r) =>
            r.userId === user.id &&
            ["PENDING", "ACTIVE", "OVERDUE"].includes(r.status)
        );

        if (blockingRentals.length > 0) {
          toast.error(
            `Cannot suspend user with open rentals: ${blockingRentals
              .map((r) => r.id)
              .join(", ")}`
          );
          return;
        }
      }

      setStatusUpdatingId(user.id);

      const res = await userService.toggleUserStatus(user.id, {
        status: nextStatus,
      });

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || `User ${nextStatus.toLowerCase()} successfully`);

        setUserList((prev) =>
          prev.map((item) =>
            item.id === user.id ? { ...item, status: nextStatus } : item
          )
        );
      } else {
        toast.error(res?.data?.message || "Failed to update user status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating user status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase();

    return (
      String(u.userId || "").toLowerCase().includes(q) ||
      String(u.id || "").toLowerCase().includes(q) ||
      String(u.name || "").toLowerCase().includes(q) ||
      String(u.phone || "").toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q)
    );
  });

  const handleWalletUpdate = async (payload: {
    userId: string;
    amount: number;
  }) => {
    try {
      const res = await userService.rechargeUserWallet(payload.userId, {
        amount: payload.amount,
      });

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || "Wallet recharged successfully");

        setWalletUser(null);

        await fetchUsers(page);
        await fetchWalletTransactions(payload.userId);

      } else {
        toast.error(res?.data?.message || "Failed to recharge wallet");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while recharging wallet");
    }
  };

  const handleCreateUser = async (payload: {
    phone: string;
    email: string;
    name: string;
    city: string;
    state: string;
    country: string;
    address: string;
  }) => {
    try {
      const res = await userService.createUser(payload);

      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || "User created successfully");

        setOpenCreateUserModal(false);

        await fetchUsers(1);
      } else {
        toast.error(res?.data?.message || "Failed to create user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while creating user");
    }
  };

  return (
    <div className="">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border-2 border-black brutal-shadow">
        <h2 className="text-2xl font-black uppercase ">
          Users Management
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center w-full sm:w-[260px] border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
            <i className="ph ph-magnifying-glass mr-2"></i>

            <input
              placeholder="Search UserId / Name..."
              className="outline-none bg-transparent w-full"
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenCreateUserModal(true)}
            className="bg-[#ffe600] border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition w-full sm:w-auto"
          >
            <i className="ph ph-plus"></i>
            CREATE USER
          </button>
        </div>
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
            {loading ? (
              <>
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="border-b-2 border-black animate-pulse">
                    <td className="p-4 border-r-2 border-black">
                      <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-24 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 w-40 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <div className="h-4 w-16 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <div className="h-6 w-28 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                        <div className="h-8 w-8 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center font-bold text-lg">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-b-2 border-black hover:bg-[#f4f4f0] transition-colors">
                  <td className="p-4 border-r-2 border-black font-bold">
                    {u.userId || u.id}
                  </td>
                  <td className="p-4 border-r-2 border-black">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        className="font-sans font-bold uppercase text-xs text-blue-600 hover:underline text-left"
                      >
                        {u.name || "Unknown"}
                      </button>

                      {u.isCreatedByAdmin && (
                        <span className="bg-[#ffe600] border-1 rounded-xl border-black px-2 py-[1px] text-[9px] font-black uppercase ">
                          Admin Created
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 font-mono mt-1">
                      {u.phone || "-"}
                    </div>

                    <div className="text-gray-600 font-mono text-xs break-all">
                      {u.email || "-"}
                    </div>
                  </td>
                  <td className="p-4 border-r-2 border-black">
                    <div className="font-bold">₹{u.walletBalance || "0"}</div>

                    <button
                      type="button"
                      onClick={() => setWalletUser(u)}
                      className="font-sans font-bold uppercase text-xs text-blue-600 hover:underline text-left"
                    >
                      (Recharge)
                    </button>
                  </td>
                  <td className="p-4 border-r-2 border-black"> <StatusBadge status={u.kycStatus} /></td>
                  <td className="p-4 border-r-2 border-black"> <StatusBadge status={u.status} /></td>
                  <td className="p-4 border-r-2 border-black text">{u.joined}</td>
                  <td className="p-4 text-center flex justify-center gap-2">
                    <button
                      disabled={userDetailLoading}
                      onClick={() => handleOpenUserModal(u.id)}
                      className="brutal-btn brutal-btn-secondary brutal-hover px-1 py-1 border-2 border-black brutal-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <i
                        className={`ph ${userDetailLoading ? "ph-spinner animate-spin" : "ph-eye"
                          } text-lg`}
                      ></i>
                    </button>

                    <button
                      disabled={statusUpdatingId === u.id}
                      onClick={() => toggleUserStatus(u)}
                      title={u.status === "ACTIVE" ? "Suspend user" : "Activate user"}
                      className={`brutal-btn brutal-hover px-1 py-1 border-2 border-black brutal-shadow disabled:opacity-60 disabled:cursor-not-allowed ${u.status === "ACTIVE"
                        ? "bg-[#ff3366] text-white"
                        : "bg-[#00ff66] text-black"
                        }`}
                    >
                      <i
                        className={`ph ${statusUpdatingId === u.id ? "ph-spinner animate-spin" : "ph-power"
                          } text-lg`}
                      ></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]">

          <div className="text-sm font-bold uppercase">
            Total Users: {totalUsers}
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
      ${page === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ffe600]"
                }`}
            >
              Prev
            </button>

            <div className="border-2 border-black px-4 py-2 font-bold bg-black text-white shadow-[3px_3px_0px_#000]">
              {page} / {totalPages}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
      ${page === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ffe600]"
                }`}
            >
              Next
            </button>
          </div>
        </div>

      </div>
      {/* Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setSelectedUser(null);
            setWalletTransactions([]);
          }}
          bookings={[]}
          transactions={walletTransactions}
          transactionLoading={walletTransactionLoading}
        />
      )}

      {userDetailLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black px-6 py-4 font-black uppercase shadow-[6px_6px_0px_#000]">
            Loading user details...
          </div>
        </div>
      )}

      {walletUser && (
        <UserWalletUpdateModal
          user={walletUser}
          onClose={() => setWalletUser(null)}
          onSave={handleWalletUpdate}
        />
      )}

      {openCreateUserModal && (
        <CreateUserModal
          onClose={() => setOpenCreateUserModal(false)}
          onSave={handleCreateUser}
        />
      )}
    </div>
  )
}

export default Users