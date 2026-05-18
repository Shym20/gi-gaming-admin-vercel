import { useMemo, useState } from "react";
import { City, Country, State } from "country-state-city";

type CreateUserPayload = {
  phone: string;
  email: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
};

type CreateUserModalProps = {
  onClose: () => void;
  onSave: (payload: CreateUserPayload) => Promise<void> | void;
};

type FormErrors = Partial<Record<keyof CreateUserPayload, string>>;

const inputClass =
  "border-2 border-black px-3 py-2 font-bold outline-none shadow-[3px_3px_0px_#000]";

const errorInputClass = "border-red-600 bg-red-50";

const CreateUserModal = ({ onClose, onSave }: CreateUserModalProps) => {
  const india = Country.getCountryByCode("IN");

  const [selectedCountryCode, setSelectedCountryCode] = useState("IN");
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const [form, setForm] = useState<CreateUserPayload>({
    phone: "",
    email: "",
    name: "",
    city: "",
    state: "",
    country: india?.name || "India",
    address: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const countries = useMemo(() => Country.getAllCountries(), []);

  const states = useMemo(() => {
    if (!selectedCountryCode) return [];
    return State.getStatesOfCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  const cities = useMemo(() => {
    if (!selectedCountryCode || !selectedStateCode) return [];
    return City.getCitiesOfState(selectedCountryCode, selectedStateCode);
  }, [selectedCountryCode, selectedStateCode]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    const name = form.name.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const city = form.city.trim();
    const state = form.state.trim();
    const country = form.country.trim();
    const address = form.address.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indianPhoneRegex = /^[6-9]\d{9}$/;

    if (!name) {
      newErrors.name = "Name is required";
    } else if (name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (name.length > 60) {
      newErrors.name = "Name cannot exceed 60 characters";
    }

    if (!phone) {
      newErrors.phone = "Mobile number is required";
    } else if (!indianPhoneRegex.test(phone)) {
      newErrors.phone = "Enter valid 10-digit Indian mobile number";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter valid email address";
    }

    if (!country) {
      newErrors.country = "Country is required";
    }

    if (!state) {
      newErrors.state = "State is required";
    }

    if (!city) {
      newErrors.city = "City is required";
    }

    if (!address) {
      newErrors.address = "Address is required";
    } else if (address.length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    } else if (address.length > 200) {
      newErrors.address = "Address cannot exceed 200 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof CreateUserPayload, value: string) => {
    let updatedValue = value;

    if (key === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm((prev) => ({
      ...prev,
      [key]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = Country.getCountryByCode(countryCode);

    setSelectedCountryCode(countryCode);
    setSelectedStateCode("");

    setForm((prev) => ({
      ...prev,
      country: selectedCountry?.name || "",
      state: "",
      city: "",
    }));

    setErrors((prev) => ({
      ...prev,
      country: "",
      state: "",
      city: "",
    }));
  };

  const handleStateChange = (stateCode: string) => {
    const selectedState = State.getStateByCodeAndCountry(
      stateCode,
      selectedCountryCode
    );

    setSelectedStateCode(stateCode);

    setForm((prev) => ({
      ...prev,
      state: selectedState?.name || "",
      city: "",
    }));

    setErrors((prev) => ({
      ...prev,
      state: "",
      city: "",
    }));
  };

  const handleCityChange = (cityName: string) => {
    setForm((prev) => ({
      ...prev,
      city: cityName,
    }));

    setErrors((prev) => ({
      ...prev,
      city: "",
    }));
  };

  const getInputClass = (key: keyof CreateUserPayload) => {
    return `${inputClass} ${errors[key] ? errorInputClass : ""}`;
  };

  const renderError = (key: keyof CreateUserPayload) => {
    if (!errors[key]) return null;

    return (
      <p className="text-red-600 text-xs font-bold mt-1">{errors[key]}</p>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    try {
      setSaving(true);

      await onSave({
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        name: form.name.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        address: form.address.trim(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#ffe600] px-5 py-4 sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black uppercase">Create User</h2>
            <p className="text-xs font-bold uppercase">
              Add a new customer account
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="border-2 border-black bg-white px-3 py-1 font-black shadow-[3px_3px_0px_#000] disabled:opacity-60"
          >
            X
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">Name *</label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter name"
                className={getInputClass("name")}
              />
              {renderError("name")}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">
                Mobile Number *
              </label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter mobile number"
                className={getInputClass("phone")}
              />
              {renderError("phone")}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                className={getInputClass("email")}
              />
              {renderError("email")}
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">Country *</label>
              <select
                value={selectedCountryCode}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={getInputClass("country")}
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              {renderError("country")}
            </div>

            {/* State */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">State *</label>
              <select
                value={selectedStateCode}
                onChange={(e) => handleStateChange(e.target.value)}
                className={getInputClass("state")}
                disabled={!selectedCountryCode}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {renderError("state")}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1">
              <label className="font-black uppercase text-sm">City *</label>
              <select
                value={form.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className={getInputClass("city")}
                disabled={!selectedStateCode}
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={`${city.name}-${city.latitude}-${city.longitude}`} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {renderError("city")}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-black uppercase text-sm">Address *</label>
              <textarea
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Enter address"
                className={`${getInputClass("address")} min-h-[90px] resize-none`}
              />
              {renderError("address")}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="border-2 border-black bg-white px-4 py-2 font-black uppercase shadow-[3px_3px_0px_#000] disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="border-2 border-black bg-[#00ff66] px-4 py-2 font-black uppercase shadow-[3px_3px_0px_#000] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;