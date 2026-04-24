import React, { useEffect, useState } from "react";
import CategoryApi from "../../apis/category.api";
import StoreProductApi from "../../apis/store-product.api";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
    product?: any;
    onSuccess?: () => void;
}

const categoryService = new CategoryApi();
const storeProductService = new StoreProductApi();

const AddProductModal: React.FC<Props> = ({ onClose, product, onSuccess }) => {

    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [subCategories, setSubCategories] = useState<any[]>([]);

    const [form, setForm] = useState({
        name: product?.name || "",
        categoryId: product?.categoryId || "",
        productType: product?.productType || "CONSOLE",
        serialNumber: product?.sku || "",
        condition: product?.condition || "NEW",
        price: Number(product?.price) || 0,
        stock: product?.stock || 0,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name || "",
                categoryId: product.categoryId || "",
                productType: product.productType || "CONSOLE",
                serialNumber: product.sku || "",
                condition: product.condition || "NEW",
                price: Number(product.price) || 0,
                stock: product.stock || 0,
            });
        }
    }, [product]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories();

            if (res?.status === 200) {
                const categories = res.data?.data || [];

                // 🔥 flatten all subcategories
                const allSubs = categories.flatMap((cat: any) =>
                    cat.subCategories.map((sub: any) => ({
                        ...sub,
                        parentName: cat.name, // optional (useful for label)
                    }))
                );

                setSubCategories(allSubs);
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
                productType: form.productType,
                serialNumber: form.serialNumber,
                condition: form.condition,
                price: form.price,
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
                                Category (Subcategory)
                            </label>

                            <select
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm({ ...form, categoryId: e.target.value })
                                }
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            >
                                <option value="">Select Category</option>

                                {subCategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.parentName} / {sub.name}
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

                    {/* SERIAL + CONDITION */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-bold uppercase">Serial Number</label>
                            <input
                                value={form.serialNumber}
                                onChange={(e) =>
                                    setForm({ ...form, serialNumber: e.target.value })
                                }
                                placeholder="Unique unit serial"
                                className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold uppercase">Condition</label>
                            <select value={form.condition}
                                onChange={(e) =>
                                    setForm({ ...form, condition: e.target.value })
                                } className="w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]">
                                <option>GOOD</option>
                                <option>NEW</option>
                            </select>
                        </div>

                    </div>

                    {/* PRICE + STOCK */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-bold uppercase">Price (₹)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: Number(e.target.value) })
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
                                    setForm({ ...form, stock: Number(e.target.value) })
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