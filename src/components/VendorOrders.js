import React, { useEffect, useState } from "react";
import axios from "axios";

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/vendor/products/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error("Error fetching vendor orders:", err);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters whenever search/sort/dateRange changes
  useEffect(() => {
    let data = [...orders];

    // 🔍 Search filter
    if (search.trim()) {
      data = data.filter((order) =>
        order.items.some(
          (item) =>
            item.product.name.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // 📅 Date filter
    if (dateRange.start || dateRange.end) {
      data = data.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const start = dateRange.start ? new Date(dateRange.start) : null;
        const end = dateRange.end ? new Date(dateRange.end) : null;
        return (
          (!start || orderDate >= start) &&
          (!end || orderDate <= end)
        );
      });
    }

    // 🔽 Sorting
    if (sortBy === "date_desc") {
      data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
    } else if (sortBy === "date_asc") {
      data.sort(
        (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
      );
    }

    setFilteredOrders(data);
  }, [search, sortBy, dateRange, orders]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Vendor Orders</h2>

      {/* 🔎 Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product or customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-64"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="border rounded-lg px-2 py-1"
          />
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="border rounded-lg px-2 py-1"
          />
        </div>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-2xl shadow-md">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-600">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer Name</th>
              <th className="px-6 py-3">Customer Email</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Price (₹)</th>
              <th className="px-6 py-3">Total (₹)</th>
              <th className="px-6 py-3">Order Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.flatMap((order) =>
                order.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">{order.id}</td>
                    <td className="px-6 py-3">
                      {order.userName || "N/A"}
                    </td>
                    <td className="px-6 py-3">
                      {order.email || "N/A"}
                    </td>
                    <td className="px-6 py-3">{item.productName}</td>
                    <td className="px-6 py-3">{item.quantity}</td>
                    <td className="px-6 py-3">₹{item.priceAtPurchase}</td>
                    <td className="px-6 py-3">
                      ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorOrders;
