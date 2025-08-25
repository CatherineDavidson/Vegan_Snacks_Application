import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/api";
import {
  DollarSign,
  ShoppingCart,
  Star,
  Package,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// colors for PieChart
const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];

const OverviewTab = ({ vendorId }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeProducts, setActiveProducts] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Fetch products
      const productRes = await axios.get(
        `http://localhost:8080/api/vendor/products?vendorId=${vendorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProducts(productRes.data);

      // ✅ Active Products = total products count
      setActiveProducts(productRes.data.length);

      // ✅ Fetch orders
      const orderRes = await axios.get(
        `http://localhost:8080/api/vendor/products/orders?vendorId=${vendorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(orderRes.data);

    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  fetchData();
}, [vendorId]);

  // ---- Stats ----
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // ---- Orders grouped by date for BarChart ----
//   const orderData = Object.values(
//     orders.reduce((acc, order) => {
//       const date = new Date(order.orderDate).toLocaleDateString();
//       if (!acc[date]) acc[date] = { date, orders: 0 };
//       acc[date].orders += 1;
//       return acc;
//     }, {})
//   );
  const filteredOrders = orders.filter((order) => {
    if (!startDate || !endDate) return true;
    const orderDate = new Date(order.orderDate);
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
  });

  const orderData = filteredOrders.reduce((acc, order) => {
    const day = new Date(order.orderDate).toLocaleDateString();
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(orderData).map(([date, count]) => ({
    date,
    count,
  }));

  // ---- Revenue by product for PieChart ----
  const revenueData = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const productName = item.productName;
      const value = item.priceAtPurchase * item.quantity;
      revenueData[productName] = (revenueData[productName] || 0) + value;
    });
  });
  const revenueChartData = Object.entries(revenueData).map(([productName, value]) => ({
    productName,
    value,
  }));

  // ---- Recent Orders (last 5) ----
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Average Rating"
          value="—"
          icon={Star}
          color="orange"
        />
        <StatCard
          title="Active Products"
          value={activeProducts}
          icon={Package}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders BarChart */}


      {/* Orders Bar Chart */}
      <div className="bg-white rounded-xl shadow p-6 h-106">
        <h3 className="text-lg font-semibold mb-4">Orders (by Date)</h3>
                {/* Date Range Filter */}
      <div className="flex gap-4 items-center mb-4">
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
      </div>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

        {/* Revenue PieChart */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            Revenue by Product
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueChartData}
                dataKey="value"
                outerRadius={120}
                label
              >
                {revenueChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-semibold text-gray-600 border-b-2 border-gray-200">
                <th className="pb-4">Order ID</th>
                <th className="pb-4">Customer</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-5 font-semibold text-gray-800">
                    {order.id}
                  </td>
                  <td className="px-6 py-5 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>{order.userName}</span>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-800">
                    ${order.totalAmount}
                  </td>
                  <td className="px-6 py-5 text-gray-500 font-medium">
                    {new Date(order.orderDate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple stat card component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`p-6 rounded-xl bg-white border border-gray-200 shadow-md flex items-center space-x-4`}
  >
    <div
      className={`p-3 rounded-full bg-${color}-100 text-${color}-600 shadow`}
    >
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default OverviewTab;
