import React, { useState } from "react"
import StatusBadge from "../shared/StatusBadge"
import type { User } from "../../types/apptypes"
import { Country, State, City } from "country-state-city"

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
  transactionLoading?: boolean
  onSave: (user: User) => Promise<void> | void
  onClose: () => void
}

const UserModal: React.FC<Props> = ({
  user,
  bookings = [],
  transactions = [],
  transactionLoading = false,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<User>({ ...user })
  const [saving, setSaving] = useState(false);

  const countries = Country.getAllCountries();

  const selectedCountry = countries.find(
    (country) => country.name === (formData as any).country
  );

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const selectedState = states.find(
    (state) => state.name === (formData as any).state
  );

  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;

    setFormData({
      ...formData,
      country: countryName,
      state: "",
      city: "",
    } as any);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;

    setFormData({
      ...formData,
      state: stateName,
      city: "",
    } as any);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      city: e.target.value,
    } as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  };

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
                <p className="font-bold">{user.userId}</p>
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

            {/* <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Avatar URL</label>
                <input
                  name="avatar"
                  value={(formData as any).avatar || ""}
                  onChange={handleChange}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0]"
                  placeholder="Avatar URL"
                />
              </div>
            </div> */}

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
                <label className="font-bold text-sm uppercase">Address</label>
                <input
                  name="address"
                  value={(formData as any).address || (formData as any).location || ""}
                  onChange={handleChange}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                  placeholder="Location"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">Country</label>
                <select
                  name="country"
                  value={(formData as any).country || ""}
                  onChange={handleCountryChange}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0]"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">State</label>
                <select
                  name="state"
                  value={(formData as any).state || ""}
                  onChange={handleStateChange}
                  disabled={!selectedCountry}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-sm uppercase">City</label>
                <select
                  name="city"
                  value={(formData as any).city || ""}
                  onChange={handleCityChange}
                  disabled={!selectedState}
                  className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
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
                    value={(formData as any).aadhaar || ""}
                    readOnly
                    className="brutal-input border-2 border-black brutal-shadow hover:bg-[#f4f4f0] "
                    placeholder="Aadhaar"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-sm uppercase">PAN Number</label>
                  <input
                    name="pan"
                    value={(formData as any).pan || ""}
                    readOnly
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

            <button
              disabled={saving}
              className="brutal-btn brutal-btn-primary w-full border-2 border-black brutal-shadow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile Changes"}
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
                  {transactionLoading ? (
                    <>
                      {[...Array(4)].map((_, index) => (
                        <tr key={index} className="border-t-2 animate-pulse">
                          <td className="p-2">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                          </td>
                          <td className="p-2">
                            <div className="h-4 w-20 bg-gray-300 rounded"></div>
                          </td>
                          <td className="p-2">
                            <div className="h-4 w-28 bg-gray-300 rounded"></div>
                          </td>
                          <td className="p-2">
                            <div className="h-4 w-14 bg-gray-300 rounded"></div>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : transactions.length === 0 ? (
                    <tr className="border-t-2">
                      <td colSpan={4} className="p-4 text-center font-bold">
                        No wallet transactions found
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr key={t.id} className="border-t-2">
                        <td className="p-2">{t.id}</td>
                        <td className="p-2">{t.date}</td>
                        <td className="p-2">{t.description}</td>
                        <td
                          className={`p-2 font-bold ${t.type === "CREDIT" ? "text-green-500" : "text-red-500"
                            }`}
                        >
                          {t.type === "CREDIT" ? "+" : "-"}₹{t.amount}
                        </td>
                      </tr>
                    ))
                  )}
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