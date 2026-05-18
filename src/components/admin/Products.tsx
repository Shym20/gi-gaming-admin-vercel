import { useEffect, useState } from "react";
import AddProductModal from "../product/productModal";
import StoreProductApi from "../../apis/store-product.api";
import toast from "react-hot-toast";
import ConfirmModal from "../shared/confirmModal";
import AddRentalProductModal from "../product/rentalProductModal";
import RentalApi from "../../apis/rental.api";
import CategoryApi from "../../apis/category.api";
import Centers from "../../apis/centers.api";

const storeProductService = new StoreProductApi();
const rentalProductService = new RentalApi();
const categoryService = new CategoryApi();
const centerService = new Centers();

const Products = () => {

  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "rental">("store");
  const [products, setProducts] = useState<any[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [rentalLoading, setRentalLoading] = useState(false);

  const [rentalPage, setRentalPage] = useState(1);
  const [rentalLimit] = useState(5);
  const [rentalTotalPages, setRentalTotalPages] = useState(1);
  const [totalRentals, setTotalRentals] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [openRentalModal, setOpenRentalModal] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [centers, setCenters] = useState<any[]>([]);

  // Store filters
  const [storeCategoryId, setStoreCategoryId] = useState("");
  const [storeCenterId, setStoreCenterId] = useState("");
  const [storeStatus, setStoreStatus] = useState("");
  const [storeProductType, setStoreProductType] = useState("");

  // Rental filters
  const [rentalTypeFilter, setRentalTypeFilter] = useState("");
  const [rentalStatusFilter, setRentalStatusFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);

      if (activeTab === "store") {
        setPage(1);
      } else {
        setRentalPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, activeTab]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      const [categoryRes, centerRes] = await Promise.all([
        categoryService.getAllCategories(1, 100),
        centerService.getAllCenters(1, 100),
      ]);

      if (categoryRes?.status === 200) {
        setCategories(categoryRes.data?.data || []);
      }

      if (centerRes?.status === 200) {
        setCenters(centerRes.data?.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async (
    currentPage = page,
    searchValue = debouncedSearch
  ) => {
    try {
      setLoading(true);

      const res = await storeProductService.getAllStoreProducts(
        currentPage,
        limit,
        storeCenterId,
        searchValue,
        storeCategoryId,
        storeStatus,
        storeProductType
      );

      if (res?.status === 200) {
        setProducts(res.data?.data || []);

        // backend pagination data
        setTotalPages(res.data?.pagination?.totalPages || 1);
        setTotalProducts(res.data?.pagination?.total || 0);

        setPage(currentPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async (
    currentPage = rentalPage,
    searchValue = debouncedSearch
  ) => {
    try {
      setRentalLoading(true);

      const res = await rentalProductService.getAllRentals(
        currentPage,
        rentalLimit,
        searchValue,
        rentalTypeFilter,
        rentalStatusFilter
      );

      if (res?.status === 200) {
        setRentals(res.data?.data || []);

        setRentalTotalPages(
          res.data?.pagination?.totalPages ||
          res.data?.pagination?.lastPage ||
          1
        );

        setTotalRentals(res.data?.pagination?.total || 0);
        setRentalPage(currentPage);
      } else {
        toast.error(res?.data?.message || "Failed to fetch rental products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching rental products");
    } finally {
      setRentalLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "store") {
      fetchProducts(page, debouncedSearch);
    }
  }, [
    page,
    activeTab,
    debouncedSearch,
    storeCategoryId,
    storeCenterId,
    storeStatus,
    storeProductType,
  ]);

  useEffect(() => {
    if (activeTab === "rental") {
      fetchRentals(rentalPage, debouncedSearch);
    }
  }, [
    rentalPage,
    activeTab,
    debouncedSearch,
    rentalTypeFilter,
    rentalStatusFilter,
  ]);

  // DELETE HANDLER
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);

      const res =
        activeTab === "store"
          ? await storeProductService.deleteStoreProducts(deleteId)
          : await rentalProductService.deleteRentals(deleteId);

      if (res?.status === 200) {
        toast.success(
          res?.data?.message ||
          (activeTab === "store"
            ? "Product deleted successfully"
            : "Rental product deleted successfully")
        );

        setDeleteId(null);

        if (activeTab === "store") {
          await fetchProducts(page, debouncedSearch);
        } else {
          await fetchRentals(rentalPage, debouncedSearch);
        }
      } else {
        toast.error(
          res?.data?.message ||
          (activeTab === "store"
            ? "Failed to delete product"
            : "Failed to delete rental product")
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetStoreFilters = () => {
    setStoreCategoryId("");
    setStoreCenterId("");
    setStoreStatus("");
    setStoreProductType("");
    setPage(1);
  };

  const resetRentalFilters = () => {
    setRentalTypeFilter("");
    setRentalStatusFilter("");
    setRentalPage(1);
  };

  return (
    <div className=" bg-[#f4f4f0] min-h-screen font-mono space-y-6">

      {/* TOP TABS */}
      <div className="flex gap-2 border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">

        {/* Store Products */}
        <button
          onClick={() => {
            setActiveTab("store");
            setPage(1);
            setSearch("");
            setDebouncedSearch("");

            setRentalTypeFilter("");
            setRentalStatusFilter("");
          }}
          className={`px-2 py-1 text-sm font-bold uppercase border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 ${activeTab === "store"
            ? "bg-black text-white"
            : "bg-white"
            }`}
        >
          <i className="ph ph-cube text-lg"></i>
          Store Products
        </button>

        {/* Rental Products */}
        <button
          onClick={() => {
            setActiveTab("rental");
            setRentalPage(1);
            setSearch("");
            setDebouncedSearch("");

            setStoreCategoryId("");
            setStoreCenterId("");
            setStoreStatus("");
            setStoreProductType("");
          }}
          className={`px-2 py-1 text-sm font-bold uppercase border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2 ${activeTab === "rental"
            ? "bg-black text-white"
            : "bg-white"
            }`}
        >
          <i className="ph ph-game-controller text-lg"></i>
          Rental Products
        </button>

      </div>

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center border-2 border-black px-4 md:px-6 py-4 bg-white shadow-[4px_4px_0px_#000]">

        {/* TITLE */}
        <h1 className="text-lg md:text-2xl font-black uppercase text-center md:text-left">
          {activeTab === "store"
            ? "Store Products & Inventory"
            : "Rental Products Catalog"}
        </h1>

        {/* RIGHT SECTION */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

          {/* SEARCH */}
          <div className="flex items-center border-2 border-black px-3 py-2 bg-white shadow-[4px_4px_0px_#000] w-full sm:w-auto">
            <i className="ph ph-magnifying-glass text-lg mr-2"></i>

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                if (activeTab === "store") {
                  setPage(1);
                } else {
                  setRentalPage(1);
                }
              }}
              placeholder={
                activeTab === "store"
                  ? "Search by Product ID / Name..."
                  : "Search by Rental ID / Name / Product name..."
              }
              className="outline-none bg-transparent text-sm w-full"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => {
              if (activeTab === "store") {
                setSelectedProduct(null);
                setOpenModal(true);
              } else {
                setOpenRentalModal(true);
              }
            }}
            className="bg-[#ffe600] border-2 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_#000] w-full sm:w-auto text-sm md:text-base"
          >
            {activeTab === "store"
              ? "+ Add Product"
              : "+ Add Rental Product"}
          </button>

        </div>
      </div>

      {/* FILTERS */}
      <div className="py-4 ">
        {activeTab === "store" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Category */}
            <select
              value={storeCategoryId}
              onChange={(e) => {
                setStoreCategoryId(e.target.value);
                setPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Categories</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Center */}
            <select
              value={storeCenterId}
              onChange={(e) => {
                setStoreCenterId(e.target.value);
                setPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Centers</option>
              {centers.map((center: any) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>

            {/* Status */}
            <select
              value={storeStatus}
              onChange={(e) => {
                setStoreStatus(e.target.value);
                setPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            {/* Product Type */}
            <select
              value={storeProductType}
              onChange={(e) => {
                setStoreProductType(e.target.value);
                setPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Product Types</option>
              <option value="CONSOLE">CONSOLE</option>
              <option value="ACCESSORY">ACCESSORY</option>
            </select>

            <button
              onClick={resetStoreFilters}
              className="border-2 border-black px-3 py-2 font-bold text-sm uppercase bg-[#ffe600] shadow-[3px_3px_0px_#000]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Rental Type */}
            <select
              value={rentalTypeFilter}
              onChange={(e) => {
                setRentalTypeFilter(e.target.value);
                setRentalPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Rental Types</option>
              <option value="PICKUP">PICKUP</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>

            {/* Status */}
            <select
              value={rentalStatusFilter}
              onChange={(e) => {
                setRentalStatusFilter(e.target.value);
                setRentalPage(1);
              }}
              className="border-2 border-black px-3 py-2 font-bold text-sm bg-white shadow-[3px_3px_0px_#000]"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            <button
              onClick={resetRentalFilters}
              className="border-2 border-black px-3 py-2 font-bold text-sm uppercase bg-[#ffe600] shadow-[3px_3px_0px_#000]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* TABLE */}
      {activeTab === "store" && (
        <div className="border-2 border-black shadow-[4px_4px_0px_#000] overflow-x-auto">
          <table className="w-full border-collapse">

            {/* HEADER */}
            <thead>
              <tr className="bg-[#ff3366] text-white uppercase text-sm font-black">
                {[
                  "ID",
                  "Name",
                  "Category",
                  "Type",
                  "Center",
                  "Serial",
                  "Availability",
                  "Price",
                  "Rent Price (per day)",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="p-4 border-r-2 border-black text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* BODY */}
            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="p-10 text-center font-bold text-lg"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="p-10 text-center font-bold text-lg"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((row: any) => (
                  <tr
                    key={row.id}
                    className="border-b-2 border-black hover:bg-[#f4f4f0]"
                  >
                    <td className="p-4 border-r-2 border-black font-bold">
                      {row.productId}
                    </td>

                    <td className="p-4 border-r-2 border-black font-bold uppercase text-xs">
                      {row.name}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      {row.categoryName}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      {row.productType || "-"}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      {row.centerName || "-"}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      {row.sku || "-"}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      {row.status}
                    </td>

                    <td className="p-4 border-r-2 border-black font-bold">
                      ₹{row.price}
                    </td>

                    <td className="p-4 border-r-2 border-black font-bold">
                      ₹{row.rentPrice || 0}
                    </td>

                    <td className="p-4 border-r-2 border-black font-bold">
                      {row.stock}
                    </td>

                    <td className="p-4 border-r-2 border-black">
                      <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
                        {row.stockStatus || "IN_STOCK"}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(row);
                          setOpenModal(true);
                        }}
                        className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_#000]"
                      >
                        <i className="ph ph-pencil text-lg"></i>
                      </button>
                      <button
                        onClick={() => setDeleteId(row.id)}
                        className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                      >
                        <i className="ph ph-trash text-lg text-red-500"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]">

            {/* LEFT */}
            <div className="text-sm font-bold uppercase">
              Total Products: {totalProducts}
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">

              {/* PREV */}
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

              {/* PAGE */}
              <div className="border-2 border-black px-4 py-2 font-bold bg-black text-white shadow-[3px_3px_0px_#000]">
                {page} / {totalPages}
              </div>

              {/* NEXT */}
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

      )}

      {activeTab === "rental" && (
        <div className="border-2 border-black shadow-[4px_4px_0px_#000] overflow-x-auto">
          <table className="w-full border-collapse">

            <thead>
              <tr className="bg-[#00c2d1] text-black uppercase text-sm font-black">
                {[
                  "ID",
                  "Name",
                  "Center",
                  "Type",
                  "Products",
                  "Base Price",
                  "Deposit",
                  "Stock",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th key={i} className="p-4 border-r-2 border-black text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rentalLoading ? (
                <tr>
                  <td colSpan={11} className="p-10 text-center font-bold text-lg">
                    Loading rental products...
                  </td>
                </tr>
              ) : rentals.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-10 text-center font-bold text-lg">
                    No rental products found
                  </td>
                </tr>
              ) : (
                rentals.map((row: any) => {
                  const items = row.items || row.rentalItems || [];

                  const consoleText =
                    items
                      .map((item: any) => {
                        const productName =
                          item.product?.name || item.productName || item.name || "-";

                        return `${productName} x${item.quantity || item.qty || 1}`;
                      })
                      .join(", ") || "-";

                  return (
                    <tr key={row.id} className="border-b-2 border-black">
                      <td className="p-4 border-r-2 border-black font-bold">
                        {row.rentalProductId || row.rentalId || row.id}
                      </td>

                      <td className="p-4 border-r-2 border-black font-bold uppercase text-xs">
                        {row.name}
                      </td>

                      <td className="p-4 border-r-2 border-black">
                        {row.centerName || row.center?.name || "-"}
                      </td>

                      <td className="p-4 border-r-2 border-black">
                        {row.rentalType || "-"}
                      </td>

                      <td className="p-4 border-r-2 border-black">
                        {consoleText}
                      </td>

                      <td className="p-4 border-r-2 border-black font-bold">
                        ₹{row.basePrice}
                      </td>

                      <td className="p-4 border-r-2 border-black font-bold">
                        ₹{row.deposit}
                      </td>

                      <td className="p-4 border-r-2 border-black font-bold">
                        {row.stock}
                      </td>

                      <td className="p-4 border-r-2 border-black">
                        <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
                          {row.stockStatus || row.status || "ACTIVE"}
                        </span>
                      </td>

                      <td className="p-4 flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(row);
                            setOpenRentalModal(true);
                          }}
                          className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_#000]"
                        >
                          <i className="ph ph-pencil text-lg"></i>
                        </button>

                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="bg-white border-2 border-black p-2 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition"
                        >
                          <i className="ph ph-trash text-lg text-red-500"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>

          {/* RENTAL PAGINATION */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]">

            <div className="text-sm font-bold uppercase">
              Total Rentals: {totalRentals}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={rentalPage === 1}
                onClick={() => setRentalPage((prev) => prev - 1)}
                className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
      ${rentalPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#ffe600]"
                  }`}
              >
                Prev
              </button>

              <div className="border-2 border-black px-4 py-2 font-bold bg-black text-white shadow-[3px_3px_0px_#000]">
                {rentalPage} / {rentalTotalPages}
              </div>

              <button
                disabled={rentalPage === rentalTotalPages}
                onClick={() => setRentalPage((prev) => prev + 1)}
                className={`border-2 border-black px-4 py-2 font-bold uppercase shadow-[3px_3px_0px_#000]
      ${rentalPage === rentalTotalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#ffe600]"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {openModal && (
        <AddProductModal
          product={selectedProduct}
          onClose={() => {
            setOpenModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={async () => {
            await fetchProducts(page, debouncedSearch);
          }}
        />
      )}

      {openRentalModal && (
        <AddRentalProductModal
          product={selectedProduct}
          onClose={() => {
            setOpenRentalModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => fetchRentals(rentalPage, debouncedSearch)}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmModal
          message={
            activeTab === "store"
              ? "Are you sure you want to delete this product?"
              : "Are you sure you want to delete this rental product?"
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default Products;