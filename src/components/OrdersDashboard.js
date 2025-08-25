import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/orders/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setOrders(res.data);
        setFilteredOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  // Filter orders based on search and date
  useEffect(() => {
    let filtered = orders.filter((order) => {
      const searchMatch =
        order.id.toString().includes(search.toLowerCase()) ||
        order.userName.toLowerCase().includes(search.toLowerCase()) ||
        order.email.toLowerCase().includes(search.toLowerCase());

      const orderDate = new Date(order.orderDate);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const dateMatch =
        (!from || orderDate >= from) && (!to || orderDate <= to);

      return searchMatch && dateMatch;
    });
    setFilteredOrders(filtered);
  }, [search, fromDate, toDate, orders]);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Orders Dashboard</h1>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by Order ID, Name or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 mb-4 md:mb-0 w-full md:w-1/3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* From Date */}
        <label>From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border border-gray-300 p-3 mb-4 md:mb-0 w-full md:w-1/4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* To Date */}
        <label>To</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border border-gray-300 p-3 w-full md:w-1/4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Order Date</th>
                <th className="px-6 py-3 text-left">Items</th>
                <th className="px-6 py-3 text-left">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr
                  key={order.id}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {order.userName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.email}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.items.length === 0 ? (
                      "No items"
                    ) : (
                      <ul className="list-disc pl-5">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.productName} x {item.quantity} (${item.priceAtPurchase})
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ${order.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
