import React, { useEffect, useState } from "react"
import RentalScreenTabs from "./RentalScreenTabs"
import toast from "react-hot-toast"
import UserRentalApi from "../../apis/user-rental.api"
import UserApi from "../../apis/user.api"
import RentalApi from "../../apis/rental.api"
import StoreProductApi from "../../apis/store-product.api"



interface Accessory {
    productId: string
    qty: number
}

const userRentalService = new UserRentalApi();
const userService = new UserApi();
const rentalProductService = new RentalApi();
const storeProductService = new StoreProductApi();

const RentalsCreateScreen: React.FC = () => {

    type CustomerOption = {
        id: string;
        userId?: string;
        name?: string;
        phone?: string;
        email?: string;
        status?: string;
        role?: string;
    };

    const [customers, setCustomers] = useState<CustomerOption[]>([]);
    const [customersLoading, setCustomersLoading] = useState(false);
    const [accessories, setAccessories] = useState<Accessory[]>([]);

    type RentalProductOption = {
        id: string;
        rentalProductId?: string;
        name: string;
        rentalType: "PICKUP" | "DELIVERY";
        basePrice: string | number;
        deposit: string | number;
        stock: number;
        status: string;
        centerId?: string;
        centerName?: string;
        items?: {
            id: string;
            productId: string;
            productName: string;
            quantity?: number;
        }[];
    };

    const [rentalProducts, setRentalProducts] = useState<RentalProductOption[]>([]);
    const [rentalProductsLoading, setRentalProductsLoading] = useState(false);

    type StoreProductOption = {
        id: string;
        productId?: string;
        name: string;
        categoryId?: string;
        categoryName?: string;
        centerId?: string;
        centerName?: string;
        price?: string | number;
        rentPrice?: string | number;
        stock: number;
        status: string;
        productType?: "CONSOLE" | "ACCESSORY" | string;
        stockStatus?: string;
    };

    const [storeProducts, setStoreProducts] = useState<StoreProductOption[]>([]);
    const [storeProductsLoading, setStoreProductsLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
        fetchRentalProducts();
        fetchStoreProducts();
    }, []);

    const [formData, setFormData] = useState({
        user: "",
        rentalProductId: "",
        type: "PICKUP",
        console: "",
        basePrice: 0,
        deposit: 0,
        startDate: "",
        endDate: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const fetchCustomers = async () => {
        try {
            setCustomersLoading(true);

            // use higher limit so dropdown gets enough users
            const res = await userService.getAllUsers(1, 500);

            if (res?.status === 200 && res?.data?.success) {
                const users = res.data.data || [];

                // keep only customers if role exists in response
                const onlyCustomers = users.filter((u: CustomerOption) => {
                    return !u.role || u.role === "CUSTOMER";
                });

                setCustomers(onlyCustomers);
            } else {
                toast.error(res?.data?.message || "Failed to fetch customers");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while fetching customers");
        } finally {
            setCustomersLoading(false);
        }
    };

    const fetchRentalProducts = async () => {
        try {
            setRentalProductsLoading(true);

            // status ACTIVE only, higher limit for dropdown
            const res = await rentalProductService.getAllRentals(
                1,
                500,
                "",
                "",
                "ACTIVE"
            );

            if (res?.status === 200 && res?.data?.success) {
                setRentalProducts(res.data.data || []);
            } else {
                toast.error(res?.data?.message || "Failed to fetch rental products");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while fetching rental products");
        } finally {
            setRentalProductsLoading(false);
        }
    };

    const fetchStoreProducts = async () => {
        try {
            setStoreProductsLoading(true);

            const res = await storeProductService.getAllStoreProducts(
                1,
                500,
                "",
                "",
                "",
                "ACTIVE"
            );

            if (res?.status === 200 && res?.data?.success) {
                setStoreProducts(res.data.data || []);
            } else {
                toast.error(res?.data?.message || "Failed to fetch store products");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while fetching store products");
        } finally {
            setStoreProductsLoading(false);
        }
    };

    const toggleExtraAccessory = (productId: string) => {
        setAccessories((prev) => {
            const exists = prev.some((acc) => acc.productId === productId);

            if (exists) {
                return prev.filter((acc) => acc.productId !== productId);
            }

            return [...prev, { productId, qty: 1 }];
        });
    };

    const updateExtraAccessoryQty = (productId: string, qty: number) => {
        setAccessories((prev) =>
            prev.map((acc) =>
                acc.productId === productId
                    ? { ...acc, qty: Math.max(1, qty || 1) }
                    : acc
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.user) {
            toast.error("Please select customer");
            return;
        }

        if (!formData.rentalProductId) {
            toast.error("Please select rental product");
            return;
        }

        if (!formData.startDate) {
            toast.error("Please select start date");
            return;
        }

        if (!formData.endDate) {
            toast.error("Please select end date");
            return;
        }

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            toast.error("End date cannot be before start date");
            return;
        }

        try {
            const payload = {
                userId: formData.user,
                rentalProductId: formData.rentalProductId,
                startDate: formData.startDate,
                endDate: formData.endDate,
                basePrice: Number(formData.basePrice),
                deposit: Number(formData.deposit),
                items: accessories.map((acc) => ({
                    productId: acc.productId,
                    quantity: Number(acc.qty || 1),
                })),
            };

            const res = await userRentalService.createUserRental(payload);

            if (res?.status === 200 || res?.status === 201) {
                toast.success("Rental created successfully");

                setFormData({
                    user: "",
                    rentalProductId: "",
                    type: "PICKUP",
                    console: "",
                    basePrice: 0,
                    deposit: 0,
                    startDate: "",
                    endDate: "",
                });

                setAccessories([]);
            } else {
                toast.error(res?.data?.message || "Failed to create rental");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleRentalProductChange = (rentalProductId: string) => {
        const selectedProduct = rentalProducts.find(
            (p) => p.id === rentalProductId
        );

        if (!selectedProduct) {
            setFormData((prev) => ({
                ...prev,
                rentalProductId: "",
                type: "PICKUP",
                console: "",
                basePrice: 0,
                deposit: 0,
            }));

            setAccessories([]);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            rentalProductId: selectedProduct.id,
            type: selectedProduct.rentalType,
            basePrice: Number(selectedProduct.basePrice || 0),
            deposit: Number(selectedProduct.deposit || 0),
            console:
                selectedProduct.items
                    ?.map((item) => item.productName)
                    .filter(Boolean)
                    .join(", ") || "",
        }));

        // Important:
        // Do not add rental product's own products into accessories.
        // Backend already knows products through rentalProductId.
        // Accessories are only extra selected products.
        setAccessories([]);
    };

    const selectedCustomer = customers.find(
        (u) => u.id === formData.user
    );

    const selectedRentalProduct = rentalProducts.find(
        (p) => p.id === formData.rentalProductId
    );

    const selectedExtraAccessories = accessories
        .map((acc) => {
            const product = storeProducts.find((p) => p.id === acc.productId);

            return {
                ...acc,
                product,
                rentPrice: Number(product?.rentPrice || 0),
                total: Number(product?.rentPrice || 0) * Number(acc.qty || 1),
            };
        })
        .filter((item) => item.product);

    const basePriceTotal = Number(formData.basePrice || 0);
    const depositTotal = Number(formData.deposit || 0);

    const extraAccessoriesTotal = selectedExtraAccessories.reduce(
        (sum, item) => sum + item.total,
        0
    );

    // const overallTotal =
    //     basePriceTotal + depositTotal + extraAccessoriesTotal;

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
                                value={formData.user}
                                className="brutal-input bg-white"
                                onChange={handleChange}
                                disabled={customersLoading}
                                required
                            >
                                <option value="">
                                    {customersLoading ? "Loading customers..." : "Select Customer"}
                                </option>

                                {customers.map((u) => (
                                    <option
                                        key={u.id}
                                        value={u.id}
                                        disabled={u.status !== "ACTIVE"}
                                    >
                                        {u.name || "Unknown"} ({u.userId || u.id})
                                        {u.phone ? ` - ${u.phone}` : ""}
                                        {u.status !== "ACTIVE" ? " - Inactive" : ""}
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
                                id="rentalProductId"
                                value={formData.rentalProductId}
                                className="brutal-input bg-white"
                                onChange={(e) => handleRentalProductChange(e.target.value)}
                                disabled={rentalProductsLoading}
                                required
                            >
                                <option value="">
                                    {rentalProductsLoading ? "Loading rental products..." : "Custom Entry"}
                                </option>

                                {rentalProducts.map((p) => (
                                    <option
                                        key={p.id}
                                        value={p.id}
                                        disabled={p.status !== "ACTIVE" || Number(p.stock || 0) <= 0}
                                    >
                                        {p.name} ({p.rentalProductId || p.id}) - ₹{p.basePrice}
                                        {p.rentalType ? ` - ${p.rentalType}` : ""}
                                        {Number(p.stock || 0) <= 0 ? " - Out of Stock" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {/* TYPE */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Rental Type
                            </label>

                            <select
                                id="type"
                                value={formData.type}
                                className="brutal-input bg-white"
                                onChange={handleChange}
                                disabled={!!formData.rentalProductId}
                            >
                                <option value="PICKUP">PICKUP</option>
                                <option value="DELIVERY">DELIVERY</option>
                            </select>
                        </div>

                        {/* Star Date */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Start Date
                            </label>
                            <input
                                id="startDate"
                                type="date"
                                className="brutal-input"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* End Date */}
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                End Date
                            </label>
                            <input
                                id="endDate"
                                type="date"
                                className="brutal-input"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
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
                            disabled={!!formData.rentalProductId}
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

                    {/* EXTRA ACCESSORIES */}
                    <div className="border-2 border-black p-4 bg-[#ffea00]/20">
                        <div className="flex flex-row justify-between gap-4 border-b-2 border-black pb-2 mb-3">
                            <div>
                                <h3 className="font-black uppercase text-base">
                                    Extra Accessories
                                </h3>
                                <p className="text-xs font-mono text-gray-600 mt-1">
                                    Rental product items are included automatically. Select only extra accessories if required.
                                </p>
                            </div>

                            <span className="font-black text-xs uppercase border-2 border-black bg-white px-2 py-1 h-fit">
                                {accessories.length} Selected
                            </span>
                        </div>

                        {storeProductsLoading ? (
                            <div className="space-y-2">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-12 border-2 border-black bg-gray-200 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : storeProducts.length === 0 ? (
                            <div className="border-2 border-black bg-white p-4 text-center font-black uppercase text-sm">
                                No store products found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                                {storeProducts.map((product) => {
                                    const selected = accessories.find(
                                        (acc) => acc.productId === product.id
                                    );

                                    const isOutOfStock =
                                        Number(product.stock || 0) <= 0 ||
                                        product.status !== "ACTIVE" ||
                                        product.stockStatus === "OUT_OF_STOCK";

                                    return (
                                        <div
                                            key={product.id}
                                            className={`border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000] ${isOutOfStock ? "opacity-50" : ""
                                                }`}
                                        >
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!selected}
                                                    disabled={isOutOfStock}
                                                    onChange={() => toggleExtraAccessory(product.id)}
                                                    className="mt-1 h-4 w-4 accent-black"
                                                />

                                                <div className="flex-1">
                                                    <div className="font-black uppercase text-sm leading-tight">
                                                        {product.name}
                                                    </div>

                                                    <div className="text-[11px] font-mono text-gray-600 mt-1">
                                                        {product.productId || product.id}
                                                        {product.productType ? ` • ${product.productType}` : ""}
                                                    </div>

                                                    <div className="text-[11px] font-bold mt-1">
                                                        Rent: ₹{product.rentPrice || 0} | Stock: {product.stock || 0}
                                                    </div>

                                                    {isOutOfStock && (
                                                        <div className="text-[11px] font-black text-red-600 uppercase mt-1">
                                                            Out of stock
                                                        </div>
                                                    )}
                                                </div>
                                            </label>

                                            {selected && (
                                                <div className="mt-3 flex items-center gap-2">
                                                    <label className="text-xs font-black uppercase">
                                                        Qty
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={Number(product.stock || 1)}
                                                        value={selected.qty}
                                                        onChange={(e) =>
                                                            updateExtraAccessoryQty(
                                                                product.id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="brutal-input w-20 text-xs py-1"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExtraAccessory(product.id)}
                                                        className="ml-auto brutal-btn bg-[#ff3366] text-white px-2 py-1 text-xs shadow-none border-b-2 flex items-center justify-center"
                                                    >
                                                        <i className="ph ph-trash text-base"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* OVERALL SUMMARY */}
                    <div className="border-4 border-black bg-white shadow-[6px_6px_0px_#000]">
                        {/* Header */}
                        <div className="bg-[#00e5ff] border-b-4 border-black px-4 py-3 flex items-center justify-between">
                            <div>
                                <h3 className="font-black uppercase text-lg flex items-center gap-2">
                                    <i className="ph ph-receipt text-xl"></i>
                                    Rental Summary
                                </h3>
                                <p className="text-xs font-mono text-gray-700 mt-1">
                                    Review products and total payable amount before creating rental.
                                </p>
                            </div>

                            <span className="border-2 border-black bg-white px-3 py-1 font-black text-xs uppercase shadow-[3px_3px_0px_#000]">
                                Preview
                            </span>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Customer + Rental Product */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="border-2 border-black bg-[#f4f4f0] p-3">
                                    <p className="text-[11px] font-black uppercase text-gray-500">
                                        Customer
                                    </p>

                                    <p className="font-black uppercase text-sm mt-1">
                                        {selectedCustomer?.name || "Not selected"}
                                    </p>

                                    <p className="text-xs font-mono text-gray-600 mt-1">
                                        {selectedCustomer?.phone || "-"}
                                        {selectedCustomer?.userId ? ` • ${selectedCustomer.userId}` : ""}
                                    </p>
                                </div>

                                <div className="border-2 border-black bg-[#f4f4f0] p-3">
                                    <p className="text-[11px] font-black uppercase text-gray-500">
                                        Rental Product
                                    </p>

                                    <p className="font-black uppercase text-sm mt-1">
                                        {selectedRentalProduct?.name || "Not selected"}
                                    </p>

                                    <p className="text-xs font-mono text-gray-600 mt-1">
                                        {selectedRentalProduct?.rentalProductId || "-"}
                                        {selectedRentalProduct?.rentalType
                                            ? ` • ${selectedRentalProduct.rentalType}`
                                            : ""}
                                    </p>
                                </div>
                            </div>

                            {/* Included Products */}
                            <div className="border-2 border-black bg-white">
                                <div className="bg-[#ffea00] border-b-2 border-black px-3 py-2 flex items-center justify-between">
                                    <h4 className="font-black uppercase text-sm flex items-center gap-2">
                                        <i className="ph ph-package text-base"></i>
                                        Included Rental Products
                                    </h4>

                                    <span className="font-black text-xs">
                                        {selectedRentalProduct?.items?.length || 0} Items
                                    </span>
                                </div>

                                <div className="p-3">
                                    {!selectedRentalProduct ? (
                                        <div className="text-sm font-bold text-gray-500">
                                            Select rental product to view included items.
                                        </div>
                                    ) : selectedRentalProduct.items?.length ? (
                                        <div className="space-y-2">
                                            {selectedRentalProduct.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between border-2 border-black px-3 py-2 bg-[#f4f4f0]"
                                                >
                                                    <div>
                                                        <p className="font-black uppercase text-xs">
                                                            {item.productName}
                                                        </p>
                                                        <p className="text-[11px] font-mono text-gray-600">
                                                            {item.productId}
                                                        </p>
                                                    </div>

                                                    <span className="border-2 border-black bg-white px-2 py-1 font-black text-xs">
                                                        Qty {item.quantity || 1}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm font-bold text-gray-500">
                                            No included products found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Extra Accessories */}
                            <div className="border-2 border-black bg-white">
                                <div className="bg-[#ffe600] border-b-2 border-black px-3 py-2 flex items-center justify-between">
                                    <h4 className="font-black uppercase text-sm flex items-center gap-2">
                                        <i className="ph ph-game-controller text-base"></i>
                                        Extra Accessories
                                    </h4>

                                    <span className="font-black text-xs">
                                        {selectedExtraAccessories.length} Selected
                                    </span>
                                </div>

                                <div className="p-3">
                                    {selectedExtraAccessories.length === 0 ? (
                                        <div className="text-sm font-bold text-gray-500">
                                            No extra accessories selected.
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedExtraAccessories.map((item) => (
                                                <div
                                                    key={item.productId}
                                                    className="flex items-center justify-between border-2 border-black px-3 py-2 bg-[#f4f4f0]"
                                                >
                                                    <div>
                                                        <p className="font-black uppercase text-xs">
                                                            {item.product?.name}
                                                        </p>

                                                        <p className="text-[11px] font-mono text-gray-600">
                                                            ₹{item.rentPrice} × {item.qty}
                                                        </p>
                                                    </div>

                                                    <span className="border-2 border-black bg-white px-2 py-1 font-black text-xs">
                                                        ₹{item.total}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Calculation */}
                            <div className="border-4 border-black bg-black text-white">
                                <div className="px-4 py-3 space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-black uppercase">Base Price</span>
                                        <span className="font-mono font-black">
                                            ₹{basePriceTotal}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-black uppercase">Deposit</span>
                                        <span className="font-mono font-black">
                                            ₹{depositTotal}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-black uppercase">
                                            Extra Accessories
                                        </span>
                                        <span className="font-mono font-black">
                                            ₹{extraAccessoriesTotal}
                                        </span>
                                    </div>
                                </div>

                                {/* <div className="border-t-4 border-white bg-[#00ff66] text-black px-4 py-3 flex items-center justify-between">
                                    <span className="font-black uppercase text-lg">
                                        Overall Total
                                    </span>

                                    <span className="font-mono font-black text-2xl">
                                        ₹{overallTotal}
                                    </span>
                                </div> */}
                            </div>
                        </div>
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