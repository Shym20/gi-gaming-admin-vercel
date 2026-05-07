import React, { useState } from "react"
import { useApp } from "../../context/AppContext"
import RentalScreenTabs from "./RentalScreenTabs"
// import CreateAccessoriesRows from "./CreateAccessoriesRows"
import { getAvailableRentalProducts, getRentalCatalogProducts } from "../../utils/rentalUtils"
import RentalApi from "../../apis/rental.api"
import toast from "react-hot-toast"



interface Accessory {
    productId: string
    qty: number
}

const rentalService = new RentalApi();

const RentalsCreateScreen: React.FC = () => {
    const state = useApp()
    const rentalProducts = getRentalCatalogProducts(state)
    const defaultProduct = getAvailableRentalProducts(state)[0] || null
    const [accessories, setAccessories] = useState<Accessory[]>(
      defaultProduct?.accessories || [{ productId: "", qty: 1 }]
    )
    console.log("Default Product:", defaultProduct)
    const [formData, setFormData] = useState({
        user: "",
        product: defaultProduct?.id || "",
        type: defaultProduct?.type || "PICKUP",
        console: defaultProduct?.console || "",
        basePrice: defaultProduct?.basePrice || 1000,
        deposit: defaultProduct?.deposit || 3000,
        due: ""
    })
    const addRow = () => {
      setAccessories((prev) => [
    ...prev,
    { productId: "", qty: 1 }
])
    }
    const removeRow = (index: number) => {
        setAccessories((prev: Accessory[]) =>
            prev.filter((_: Accessory, i: number) => i !== index)
        )
    }

    const updateItem = (index: number, value: string) => {
        setAccessories((prev: Accessory[]) =>
            prev.map((acc: Accessory, i: number) =>
                i === index ? { ...acc, item: value } : acc
            )
        )
    }

    const updateQty = (index: number, value: number) => {
        setAccessories((prev: Accessory[]) =>
            prev.map((acc: Accessory, i: number) =>
                i === index ? { ...acc, qty: value } : acc
            )
        )
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      name: formData.product || "Custom Rental",
      categoryId: "cmmotl3il0008uzx0ukdnr3q2", // hard-coded category for now, will be dynamic later
      rentalType: formData.type,
      status: "ACTIVE",
      basePrice: Number(formData.basePrice),
      deposit: Number(formData.deposit),
      stock: 1, // or dynamic later

      items: accessories.map((acc) => ({
        productId: acc.productId, // ⚠️ must be productId, not name
        quantity: acc.qty,
      })),
    };

    const res = await rentalService.createRental(payload);

    if (res?.status === 200 || res?.status === 201) {
      toast.success("Rental created successfully");
    } else {
      toast.error(res?.data?.message || "Failed to create rental");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong");
  }
};

    return (
        <div className="space-y-6">
            <RentalScreenTabs activeScreen="create" />

            <div className="brutal-card p-6 space-y-6 bg-white border-2 border-black">
                <div className="border-b-2 border-black pb-3">
                    <h2 className="text-2xl font-black uppercase">
                        Create New Rental
                    </h2>

                    <p className="text-xs font-mono text-gray-500 mt-1">
                        Create rental request before pickup handover.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* USER */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Customer
                            </label>

                            <select
                                id="user"
                                className="brutal-input bg-white"
                                onChange={handleChange}
                            >
                                {state.users.map((u: any) => (
                                    <option
                                        key={u.id}
                                        value={u.id}
                                        disabled={u.status !== "ACTIVE"}
                                    >
                                        {u.name} ({u.id})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* PRODUCT */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Rental Product
                            </label>

                            <select
                                id="productId"
                                className="brutal-input bg-white"
                                onChange={handleChange}
                            >
                                <option value="">Custom Entry</option>

                                {rentalProducts.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (₹{p.basePrice})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {/* TYPE */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Rental Type
                            </label>

                            <select
                                id="type"
                                className="brutal-input bg-white"
                                onChange={handleChange}
                            >
                                <option value="PICKUP">PICKUP</option>
                                <option value="DELIVERY">DELIVERY</option>
                            </select>
                        </div>

                        {/* Due Date */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Due Date
                            </label>
                            <input
                                id="due"
                                type="datetime-local"
                                className="brutal-input"
                                value={formData.due}
                                onChange={handleChange}
                            />
                        </div>


                    </div>
                    {/* CONSOLE */}
                    <div className="flex flex-col gap-1">
                        <label className="font-bold text-sm uppercase">
                            Console
                        </label>

                        <input
                            id="console"
                            className="brutal-input"
                            value={formData.console}
                            onChange={handleChange}
                        />
                    </div>
                    {/* PRICE */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Base Price (₹)
                            </label>

                            <input
                                id="basePrice"
                                type="number"
                                className="brutal-input"
                                value={formData.basePrice}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Deposit (₹)
                            </label>

                            <input
                                id="deposit"
                                type="number"
                                className="brutal-input"
                                value={formData.deposit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ACCESSORIES */}
                    <div className="border-2 border-black p-4 bg-[#ffea00]/20">
                        <div className="flex flex-row justify-between gap-4 border-b-2 border-black pb-2 mb-3">
                            <h3 className="font-black uppercase text-base mb-3">
                                Accessories
                            </h3>
                            <button
                                type="button"
                                onClick={addRow}
                                className="font-bold uppercase bg-white text-xs px-2 py-1 shadow-none  border-2 border-black border-dashed"
                            >
                                <i className="ph ph-plus"></i> Add Item
                            </button>
                        </div>
                        {accessories.map((acc, index) => (
                            <div key={index} className="flex gap-2 mb-2 items-center">
                                <input
                                    type="text"
                                    value={acc.productId}
                                    onChange={(e) => updateItem(index, e.target.value)}
                                    className="brutal-input flex-1 text-xs"
                                    required
                                />

                                <input
                                    type="number"
                                    value={acc.qty}
                                    min={1}
                                    onChange={(e) => updateQty(index, Number(e.target.value))}
                                    className="brutal-input w-20 text-xs"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    className="brutal-btn bg-[#ff3366] text-white px-2 py-1 text-xs shadow-none border-b-2"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}

                        {/* <CreateAccessoriesRows
                            accessories={accessories}
                            setAccessories={setAccessories}
                        /> */}
                    </div>

                    {/* BUTTONS */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="brutal-btn brutal-btn-secondary w-full"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="brutal-btn brutal-btn-success w-full"
                        >
                            Create Rental
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RentalsCreateScreen