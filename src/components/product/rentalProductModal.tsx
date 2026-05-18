import React, { useEffect, useMemo, useState } from "react";
import CategoryApi from "../../apis/category.api";
import StoreProductApi from "../../apis/store-product.api";
import CenterApi from "../../apis/centers.api";
import toast from "react-hot-toast";
import RentalApi from "../../apis/rental.api";


const rentalProductService = new RentalApi();

interface Props {
    onClose: () => void;
    product?: any;
    onSuccess?: () => void;
}

type RentalType = "PICKUP" | "DELIVERY";

type StoreProduct = {
    id: string;
    productId?: string;
    name: string;
    categoryId?: string;
    categoryName?: string;
    productType?: string;
    condition?: string;
    status?: string;
    stock?: number;
    price?: number;
};

type SelectedItem = {
    productId: string;
    qty: number;
};

const categoryService = new CategoryApi();
const storeProductService = new StoreProductApi();
const centerService = new CenterApi();

const inputClass =
    "w-full mt-1 border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000]";

const AddRentalProductModal: React.FC<Props> = ({
    onClose,
    product,
    onSuccess,
}) => {
    const [, setCategories] = useState<any[]>([]);
    const [centers, setCenters] = useState<any[]>([]);
    const [centerProducts, setCenterProducts] = useState<any[]>([]);
    const [, setProductsLoading] = useState(false);

    const [selectedStoreProducts, setSelectedStoreProducts] = useState<
        SelectedItem[]
    >([]);

    const [selectedAccessories, setSelectedAccessories] = useState<
        SelectedItem[]
    >([]);

    const [consoleManual] = useState(false);

    const [form, setForm] = useState({
        name: product?.name || "",
        mainCategoryId: product?.mainCategoryId || "",
        subCategoryId: product?.subCategoryId || "",
        rentalType: product?.rentalType || "PICKUP",
        console: product?.console || "",
        consoleName: product?.consoleName || "",
        stock: product?.stock ?? "",
        basePrice: product?.basePrice ?? "",
        deposit: product?.deposit ?? "",
        centerId: product?.centerId || "",
    });

    useEffect(() => {
        fetchCategories();
        fetchCenters();
    }, []);

    useEffect(() => {
        const loadEditData = async () => {
            if (!product) {
                setCenterProducts([]);
                setSelectedStoreProducts([]);
                setSelectedAccessories([]);
                return;
            }

            setForm({
                name: product?.name || "",
                mainCategoryId: product?.mainCategoryId || "",
                subCategoryId: product?.subCategoryId || "",
                rentalType: product?.rentalType || "PICKUP",
                console: product?.console || "",
                consoleName: product?.consoleName || "",
                stock: product?.stock ?? "",
                basePrice: product?.basePrice ?? "",
                deposit: product?.deposit ?? "",
                centerId: product?.centerId || "",
            });

            if (product?.centerId) {
                const productsByCenter = await fetchProductsByCenter(product.centerId);
                prefillSelectedItems(product, productsByCenter);
            }
        };

        loadEditData();
    }, [product]);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAllCategories(1, 100);

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

    const fetchProductsByCenter = async (centerId: string) => {
        try {
            setProductsLoading(true);

            const res = await storeProductService.getAllStoreProducts(
                1,
                100,
                centerId
            );

            if (res?.status === 200) {
                const products = res.data?.data || [];
                setCenterProducts(products);
                return products;
            } else {
                setCenterProducts([]);
                toast.error(res?.data?.message || "Failed to fetch products");
                return [];
            }
        } catch (error) {
            console.error(error);
            setCenterProducts([]);
            toast.error("Something went wrong while fetching products");
            return [];
        } finally {
            setProductsLoading(false);
        }
    };

    const handleCenterChange = async (centerId: string) => {
        try {
            setForm((prev) => ({
                ...prev,
                centerId,
                console: "",
            }));

            setCenterProducts([]);
            setSelectedStoreProducts([]);
            setSelectedAccessories([]);

            if (!centerId) return;

            // fetch products by center
            await fetchProductsByCenter(centerId);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load center data");
        }
    };

    const filteredStoreProducts = useMemo(() => {
        return centerProducts.filter((item) => {
            return item.productType === "CONSOLE";
        });
    }, [centerProducts]);

    const filteredAccessories = useMemo(() => {
        return centerProducts.filter((item) => {
            return item.productType === "ACCESSORY";
        });
    }, [centerProducts]);

    const selectedStoreProductDetails = useMemo(() => {
        return selectedStoreProducts
            .map((selected) => {
                const productItem = centerProducts.find(
                    (item) => item.id === selected.productId
                );

                return productItem
                    ? {
                        ...productItem,
                        qty: selected.qty,
                    }
                    : null;
            })
            .filter(Boolean) as Array<StoreProduct & { qty: number }>;
    }, [selectedStoreProducts, centerProducts]);

    const selectedAccessoryDetails = useMemo(() => {
        return selectedAccessories
            .map((selected) => {
                const productItem = centerProducts.find(
                    (item) => item.id === selected.productId
                );

                return productItem
                    ? {
                        ...productItem,
                        qty: selected.qty,
                    }
                    : null;
            })
            .filter(Boolean) as Array<StoreProduct & { qty: number }>;
    }, [selectedAccessories, centerProducts]);

    const prefillSelectedItems = (rentalProduct: any, productsByCenter: any[]) => {
        const rentalItems = rentalProduct?.items || rentalProduct?.rentalItems || [];

        const storeSelected: SelectedItem[] = [];
        const accessorySelected: SelectedItem[] = [];

        rentalItems.forEach((rentalItem: any) => {
            const productId = rentalItem.productId;

            const matchedProduct = productsByCenter.find(
                (item: any) => item.id === productId
            );

            if (!matchedProduct) return;

            const selectedItem = {
                productId,
                qty: rentalItem.quantity || rentalItem.qty || 1,
            };

            if (matchedProduct.productType === "CONSOLE") {
                storeSelected.push(selectedItem);
            }

            if (matchedProduct.productType === "ACCESSORY") {
                accessorySelected.push(selectedItem);
            }
        });

        setSelectedStoreProducts(storeSelected);
        setSelectedAccessories(accessorySelected);
    };

    const isOutOfStock = (item: any) => {
        return Number(item.stock || 0) <= 0;
    };

    useEffect(() => {
        if (!consoleManual && selectedStoreProductDetails.length > 0) {
            setForm((prev) => ({
                ...prev,
                console: selectedStoreProductDetails[0]?.name || "",
            }));
        }
    }, [selectedStoreProductDetails, consoleManual]);

    const toggleSelectedItem = (
        type: "store" | "accessory",
        productId: string,
        checked: boolean
    ) => {
        const productItem = centerProducts.find((item) => item.id === productId);

        if (checked && Number(productItem?.stock || 0) <= 0) {
            toast.error("This product is out of stock");
            return;
        }

        const setter =
            type === "store" ? setSelectedStoreProducts : setSelectedAccessories;

        setter((prev) => {
            if (checked) {
                return [...prev, { productId, qty: 1 }];
            }

            return prev.filter((item) => item.productId !== productId);
        });
    };

    const updateSelectedQty = (
        type: "store" | "accessory",
        productId: string,
        qty: number
    ) => {
        const setter =
            type === "store" ? setSelectedStoreProducts : setSelectedAccessories;

        setter((prev) =>
            prev.map((item) =>
                item.productId === productId
                    ? {
                        ...item,
                        qty,
                    }
                    : item
            )
        );
    };

    const isSelected = (type: "store" | "accessory", productId: string) => {
        const list =
            type === "store" ? selectedStoreProducts : selectedAccessories;

        return list.some((item) => item.productId === productId);
    };

    const getSelectedQty = (type: "store" | "accessory", productId: string) => {
        const list =
            type === "store" ? selectedStoreProducts : selectedAccessories;

        return list.find((item) => item.productId === productId)?.qty || 1;
    };

    const handleNumberChange = (
        key: "stock" | "basePrice" | "deposit",
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [key]: value === "" ? "" : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const items = [
                ...selectedStoreProducts,
                ...selectedAccessories,
            ].map((item) => ({
                productId: item.productId,
                quantity: item.qty,
            }));

            const payload = {
                name: form.name,
                centerId: form.centerId,
                rentalType: form.rentalType,
                basePrice: Number(form.basePrice || 0),
                deposit: Number(form.deposit || 0),
                stock: Number(form.stock || 0),
                items,
            };

            console.log("Rental Payload:", payload);

            let res;

            if (product) {
                res = await rentalProductService.updateRentals(
                    product.id,
                    payload
                );
            } else {
                res = await rentalProductService.createRental(payload);
            }

            if (res?.status === 200 || res?.status === 201) {
                toast.success(
                    product
                        ? "Rental product updated"
                        : "Rental product created"
                );

                onSuccess?.();
                onClose();
            } else {
                toast.error(res?.data?.message || "Failed to save rental product");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="w-[95%] max-w-6xl max-h-[92vh] overflow-y-auto bg-[#f4f4f0] border-4 border-black shadow-[6px_6px_0px_#000]">
                <div className="sticky top-0 z-10 bg-[#ffe600] border-b-4 border-black flex justify-between items-center px-6 py-4">
                    <h2 className="font-black uppercase text-lg">
                        {product ? "Update Rental Product" : "Add Rental Product"}
                    </h2>

                    <button onClick={onClose} className="text-xl font-bold">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Rental Product Name
                            </label>
                            <input
                                required
                                value={form.name}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="e.g. PS3 Weekend Combo"
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">Center</label>
                            <select
                                value={form.centerId}
                                onChange={(e) => handleCenterChange(e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select Center</option>
                                {centers.map((center: any) => (
                                    <option key={center.id} value={center.id}>
                                        {center.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">Rental Type</label>
                            <select
                                value={form.rentalType}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        rentalType: e.target.value as RentalType,
                                    })
                                }
                                className={inputClass}
                            >
                                <option value="PICKUP">Pickup</option>
                                <option value="DELIVERY">Delivery</option>

                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">Stock Units</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={form.stock}
                                onChange={(e) => handleNumberChange("stock", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">
                                Base Price (₹)
                            </label>
                            <input
                                type="number"
                                min="1"
                                required
                                value={form.basePrice}
                                onChange={(e) =>
                                    handleNumberChange("basePrice", e.target.value)
                                }
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="font-bold text-sm uppercase">Deposit (₹)</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={form.deposit}
                                onChange={(e) =>
                                    handleNumberChange("deposit", e.target.value)
                                }
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <div className="border-2 border-black p-4 bg-white">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                            <h3 className="font-black uppercase text-base">
                                Select Store Products
                            </h3>
                            <p className="font-mono text-[11px] text-gray-600">
                                {filteredStoreProducts.length} products shown
                            </p>
                        </div>

                        <div className="overflow-x-auto max-h-[220px] border-2 border-black">
                            <table className="w-full text-left border-collapse min-w-[1100px]">
                                <thead>
                                    <tr className="bg-[#00e5ff] border-b-2 border-black font-bold uppercase text-[11px]">
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Use
                                        </th>
                                        <th className="p-2 border-r-2 border-black">Product</th>
                                        <th className="p-2 border-r-2 border-black">Main</th>
                                        <th className="p-2 border-r-2 border-black">Sub</th>
                                        <th className="p-2 border-r-2 border-black">Serial</th>
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Condition
                                        </th>
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Availability
                                        </th>
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Stock
                                        </th>
                                        <th className="p-2 text-center">Qty</th>
                                    </tr>
                                </thead>

                                <tbody className="font-mono text-xs">
                                    {filteredStoreProducts.length ? (
                                        filteredStoreProducts.map((item) => (
                                            <tr key={item.id} className="border-b-2 border-black">
                                                <td className="p-2 border-r-2 border-black text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected("store", item.id)}
                                                        disabled={isOutOfStock(item)}
                                                        onChange={(e) =>
                                                            toggleSelectedItem(
                                                                "store",
                                                                item.id,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="p-2 border-r-2 border-black font-bold">
                                                    {item.name}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {item.mainCategory || item.categoryName || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {item.subCategory || item.categoryName || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {item.sku || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black text-center">
                                                    {item.condition || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black text-center">
                                                    {item.status || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black text-center">
                                                    {isOutOfStock(item) ? (
                                                        <span className="text-red-600 font-black uppercase">
                                                            Out of Stock
                                                        </span>
                                                    ) : (
                                                        item.stock
                                                    )}
                                                </td>

                                                <td className="p-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.stock || 1}
                                                        disabled={!isSelected("store", item.id) || isOutOfStock(item)}
                                                        value={getSelectedQty("store", item.id)}
                                                        onChange={(e) =>
                                                            updateSelectedQty(
                                                                "store",
                                                                item.id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-16 border-2 border-black px-2 py-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="p-4 text-center text-gray-500 font-bold uppercase"
                                            >
                                                {form.centerId
                                                    ? "No console products available for this center"
                                                    : "Select center to view console products"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-2 border-black p-4 bg-[#f4f4f0]">
                        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                            <h3 className="font-black uppercase text-base">
                                Compatible Accessories
                            </h3>
                            <p className="font-mono text-[11px] text-gray-600">
                                {filteredAccessories.length} accessories shown
                            </p>
                        </div>

                        <div className="overflow-x-auto max-h-[220px] border-2 border-black bg-white">
                            <table className="w-full text-left border-collapse min-w-[980px]">
                                <thead>
                                    <tr className="bg-[#ffea00] border-b-2 border-black font-bold uppercase text-[11px]">
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Use
                                        </th>
                                        <th className="p-2 border-r-2 border-black">
                                            Accessory
                                        </th>
                                        <th className="p-2 border-r-2 border-black">Sub</th>
                                        <th className="p-2 border-r-2 border-black">
                                            Compatible With
                                        </th>
                                        <th className="p-2 border-r-2 border-black">Serial</th>
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Condition
                                        </th>
                                        <th className="p-2 border-r-2 border-black text-center">
                                            Stock
                                        </th>
                                        <th className="p-2 text-center">Qty</th>
                                    </tr>
                                </thead>

                                <tbody className="font-mono text-xs">
                                    {filteredAccessories.length ? (
                                        filteredAccessories.map((item) => (
                                            <tr key={item.id} className="border-b-2 border-black">
                                                <td className="p-2 border-r-2 border-black text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected("accessory", item.id)}
                                                        disabled={isOutOfStock(item)}
                                                        onChange={(e) =>
                                                            toggleSelectedItem(
                                                                "accessory",
                                                                item.id,
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td className="p-2 border-r-2 border-black font-bold">
                                                    {item.name}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {item.subCategory || item.categoryName || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {form.console || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black">
                                                    {item.sku || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black text-center">
                                                    {item.condition || "-"}
                                                </td>

                                                <td className="p-2 border-r-2 border-black text-center">
                                                    {isOutOfStock(item) ? (
                                                        <span className="text-red-600 font-black uppercase">
                                                            Out of Stock
                                                        </span>
                                                    ) : (
                                                        item.stock
                                                    )}
                                                </td>

                                                <td className="p-2 text-center">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={item.stock || 1}
                                                        disabled={!isSelected("accessory", item.id) || isOutOfStock(item)}
                                                        value={getSelectedQty("accessory", item.id)}
                                                        onChange={(e) =>
                                                            updateSelectedQty(
                                                                "accessory",
                                                                item.id,
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-16 border-2 border-black px-2 py-1"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="p-4 text-center text-gray-500 font-bold uppercase"
                                            >
                                                {form.centerId
                                                    ? "No accessories available for this center"
                                                    : "Select center to view accessories"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-2 border-black p-4 bg-white">
                        <h3 className="font-black uppercase text-base border-b-2 border-black pb-2 mb-3">
                            Auto-Filled Combo Details
                        </h3>

                        <div className="overflow-x-auto">
                            {selectedStoreProductDetails.length ||
                                selectedAccessoryDetails.length ? (
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-black uppercase text-xs mb-2">
                                            Store Products
                                        </h4>

                                        {selectedStoreProductDetails.length ? (
                                            selectedStoreProductDetails.map((item) => (
                                                <p key={item.id} className="font-mono text-xs">
                                                    {item.name} x {item.qty}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="font-mono text-xs text-gray-500 uppercase">
                                                No store products selected
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-black uppercase text-xs mb-2">
                                            Accessories
                                        </h4>

                                        {selectedAccessoryDetails.length ? (
                                            selectedAccessoryDetails.map((item) => (
                                                <p key={item.id} className="font-mono text-xs">
                                                    {item.name} x {item.qty}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="font-mono text-xs text-gray-500 uppercase">
                                                No accessories selected
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="font-mono text-xs text-gray-500 uppercase">
                                    Select products to auto-fill combo details.
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#ffe600] border-4 border-black py-3 font-black uppercase shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        {product ? "Update Rental Product" : "Save Rental Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRentalProductModal;