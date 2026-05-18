import React, { useEffect, useState } from "react";
import CategoryApi from "../../apis/category.api";
import StoreProductApi from "../../apis/store-product.api";
import CenterApi from "../../apis/centers.api";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    product?: any;
    onSuccess?: () => void;
}

const categoryService = new CategoryApi();
const storeProductService = new StoreProductApi();
const centerService = new CenterApi();

const AddProductModal: React.FC<Props> = ({ onClose, product, onSuccess }) => {

    const [categories, setCategories] = useState<any[]>([]);
    const [centers, setCenters] = useState<any[]>([]);
    // const [selectedCategoryId, setSelectedCategoryId] = useState("");
    // const [categories, setCategories] = useState("");

    const [form, setForm] = useState({
        name: product?.name || "",
        categoryId: product?.categoryId || "",
        centerId: product?.centerId || "",
        productType: product?.productType || "CONSOLE",
        sku: product?.sku || "",
        price: product?.price ?? "",
        rentPrice: product?.rentPrice ?? "",
        stock: product?.stock ?? "",
        deposit: product?.deposit || 0,
    });

    useEffect(() => {
        fetchCategories();
        fetchCenters();
    }, []);

    useEffect(() => {
        if (product) {
            setForm({
                name: product?.name || "",
                categoryId: product?.categoryId || "",
                centerId: product?.centerId || "",
                productType: product?.productType || "CONSOLE",
                sku: product?.sku || "",
                price: product?.price ?? "",
                rentPrice: product?.rentPrice ?? "",
                stock: product?.stock ?? "",
                deposit: product?.deposit || 0,
            });
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories();

            if (res?.status === 200) {
                setCategories(res.data?.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchCenters = async () => {
        try {
            const res = await centerService.getAllCenters();

            if (res?.status === 200) {
                setCenters(res.data?.data || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name: form.name,
                categoryId: form.categoryId,
                centerId: form.centerId,
                productType: form.productType,
                sku: form.sku,
                price: form.price,
                rentPrice: form.rentPrice,
                deposit: 0,
                stock: form.stock,
                availability: form.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
            };

            let res;

            if (product) {
                // ✅ UPDATE
                res = await storeProductService.updateStoreProduct({
                    id: product.id,
                    ...payload,
                });
            } else {
                // ✅ CREATE
                res = await storeProductService.createStoreProduct(payload);
            }

            if (res?.status === 200 || res?.status === 201) {
                toast.success(product ? "Product updated" : "Product created");

                onSuccess?.(); // refresh list
                onClose();
            } else {
                toast.error(res?.data?.message || "Failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleCenterChange = async (centerId: string) => {
        try {
            // update selected center
            setForm((prev) => ({
                ...prev,
                centerId,
            }));

            // call SKU api
            const res = await storeProductService.getSKU(centerId);

            if (res?.status === 200) {
                setForm((prev) => ({
                    ...prev,
                    centerId,
                    sku:
                        res?.data?.data?.sku || "",
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate SKU");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

            {/* MODAL */}
            <div className="w-[95%] max-w-2xl bg-[#f4f4f0] border-4 border-black shadow-[6px_6px_0px_#000]">

                {/* HEADER */}
                <div className="bg-[#ffe600] border-b-4 border-black flex justify-between items-center px-6 py-4">
                    <h2 className="font-black uppercase text-lg">
                        {product ? "Update Product" : "Add Store Product"}
                    </h2>

                    <button onClick={onClose} className="text-xl font-bold">✕</button>
                </div>

                {/* BODY */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* PRODUCT NAME */}
                    <div>
                        <label className="text-sm font-bold uppercase">Product Name</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                        />
                    </div>

                    {/* CATEGORY ROW */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-bold uppercase">
                                Category
                            </label>

                            <select
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm({ ...form, categoryId: e.target.value })
                                }
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            >
                                <option value="">Select Category</option>

                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold uppercase">Product Type</label>
                            <select value={form.productType}
                                onChange={(e) =>
                                    setForm({ ...form, productType: e.target.value })
                                } className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
                                <option>CONSOLE</option>
                                <option>ACCESSORY</option>
                            </select>
                        </div>

                    </div>

                    {/* CENTER + SKU */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-bold uppercase">
                                Center
                            </label>

                            <select
                                value={form.centerId}
                                onChange={(e) =>
                                    handleCenterChange(e.target.value)
                                }
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            >
                                <option value="">Select Center</option>

                                {centers.map((center: any) => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-bold uppercase">SKU</label>
                            <input
                                value={form.sku}
                                readOnly
                                placeholder="Auto generated SKU"
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-gray-100 shadow-[4px_4px_0px_#000]"
                            />
                        </div>

                    </div>

                    {/* PRICE + STOCK */}
                    <div className="grid md:grid-cols-3 gap-4">

                        <div>
                            <label className="text-sm font-bold uppercase">Price (₹)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        price: e.target.value === "" ? "" : Number(e.target.value),
                                    })
                                }
                                defaultValue={0}
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold uppercase">Rent Price (per day)</label>
                            <input
                                type="number"
                                value={form.rentPrice}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        rentPrice: e.target.value === "" ? "" : Number(e.target.value),
                                    })
                                }
                                defaultValue={0}
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold uppercase">Stock Qty</label>
                            <input
                                value={form.stock}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        stock: e.target.value === "" ? "" : Number(e.target.value),
                                    })
                                }
                                type="number"
                                defaultValue={0}
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            />
                        </div>

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        className="w-full bg-[#ffe600] border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        {product ? "Update Product" : "Save Product"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddProductModal;