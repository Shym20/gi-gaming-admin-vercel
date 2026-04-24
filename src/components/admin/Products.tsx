import { useEffect, useState } from "react";
import AddProductModal from "../product/productModal";
import StoreProductApi from "../../apis/store-product.api";

const storeProductService = new StoreProductApi();

const Products = () => {

  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "rental">("store");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await storeProductService.getAllStoreProducts();

      if (res?.status === 200) {
        setProducts(res.data?.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <div className=" bg-[#f4f4f0] min-h-screen font-mono space-y-6">

      {/* TOP TABS */}
      <div className="flex gap-2 border-2 border-black p-4 bg-white shadow-[4px_4px_0px_#000]">

        {/* Store Products */}
        {/* Store Products */}
        <button
          onClick={() => setActiveTab("store")}
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
          onClick={() => setActiveTab("rental")}
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
              placeholder={
                activeTab === "store"
                  ? "Search Name / Category / Serial..."
                  : "Search Rental Product / Category..."
              }
              className="outline-none bg-transparent text-sm w-full"
            />
          </div>

          {/* BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#ffe600] border-2 border-black px-4 py-2 font-bold uppercase shadow-[4px_4px_0px_#000] w-full sm:w-auto text-sm md:text-base"
          >
            {activeTab === "store"
              ? "+ Add Product"
              : "+ Add Rental Product"}
          </button>

        </div>
      </div>
      {/* CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { title: "Accessory / PS2", products: 2, units: 19 },
          { title: "Accessory / PS3", products: 3, units: 35 },
          { title: "Console / PS2", products: 1, units: 3 },
          { title: "Console / PS3", products: 1, units: 4 },
          { title: "Mouse / PS3", products: 1, units: 6 },
        ].map((item, i) => (
          <div
            key={i}
            className="border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0px_#000]"
          >
            <h3 className="font-black uppercase text-sm">
              {item.title}
            </h3>
            <p className="text-xs mt-1">
              Products: {item.products} | Units: {item.units}
            </p>
          </div>
        ))}
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
                  "Serial",
                  "Condition",
                  "Availability",
                  "Price",
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
              {products.map((row: any, i) => (
                <tr
                  key={row.id}
                  className="border-b-2 border-black hover:bg-[#f4f4f0]"
                >
                  <td className="p-4 border-r-2 border-black font-bold">
                    {row.id}
                  </td>

                  <td className="p-4 border-r-2 border-black font-bold uppercase text-xs">
                    {row.name}
                  </td>

                  {/* SUB CATEGORY */}
                  <td className="p-4 border-r-2 border-black">
                    {row.categoryName}
                  </td>

                  {/* TYPE */}
                  <td className="p-4 border-r-2 border-black">
                    {row.productType || "-"}
                  </td>

                  {/* SERIAL */}
                  <td className="p-4 border-r-2 border-black">
                    {row.sku || "-"}
                  </td>

                  {/* CONDITION */}
                  <td className="p-4 border-r-2 border-black">
                    {row.condition || "-"}
                  </td>

                  {/* AVAILABILITY */}
                  <td className="p-4 border-r-2 border-black">
                    {row.stock > 0 ? "AVAILABLE" : "OUT_OF_STOCK"}
                  </td>

                  {/* PRICE */}
                  <td className="p-4 border-r-2 border-black font-bold">
                    ₹{row.price}
                  </td>

                  {/* STOCK */}
                  <td className="p-4 border-r-2 border-black font-bold">
                    {row.stock}
                  </td>

                  {/* STATUS */}
                  <td className="p-4 border-r-2 border-black">
                    <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
                      {row.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK"}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-4 flex justify-center">
                    <button onClick={() => {
                      setSelectedProduct(row);
                      setOpenModal(true);
                    }} className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_#000]">
                      <i className="ph ph-pencil text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  "Main",
                  "Sub",
                  "Console",
                  "Type",
                  "Store Products",
                  "Accessories",
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
              {[
                {
                  id: "RPD-201",
                  name: "PS3 WEEKEND COMBO",
                  main: "Console",
                  sub: "Ps3",
                  console: "Sony PS3 Slim Console",
                  type: "Pickup",
                  store: "Sony PS3 Slim Console x1",
                  accessories: "PS3 Wireless Controller x2",
                  price: "₹1500",
                  deposit: "₹2000",
                  stock: 3,
                },
              ].map((row, i) => (
                <tr key={i} className="border-b-2 border-black">
                  <td className="p-4 border-r-2 border-black font-bold">{row.id}</td>
                  <td className="p-4 border-r-2 border-black font-bold">{row.name}</td>
                  <td className="p-4 border-r-2 border-black">{row.main}</td>
                  <td className="p-4 border-r-2 border-black">{row.sub}</td>
                  <td className="p-4 border-r-2 border-black">{row.console}</td>
                  <td className="p-4 border-r-2 border-black">{row.type}</td>
                  <td className="p-4 border-r-2 border-black">{row.store}</td>
                  <td className="p-4 border-r-2 border-black">{row.accessories}</td>
                  <td className="p-4 border-r-2 border-black">{row.price}</td>
                  <td className="p-4 border-r-2 border-black">{row.deposit}</td>
                  <td className="p-4 border-r-2 border-black font-bold">{row.stock}</td>
                  <td className="p-4 border-r-2 border-black">
                    <span className="bg-[#00ff66] border-2 border-black px-3 py-1 text-xs font-bold shadow-[2px_2px_0px_#000]">
                      IN_STOCK
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex justify-center">
                    <button className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition">
                      <i className="ph ph-pencil text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {openModal && (
        <AddProductModal
          product={selectedProduct}
          onClose={() => {
            setOpenModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;