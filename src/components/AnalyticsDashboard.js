import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch orders, products, categories from backend
    axios.get("/api/orders/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setOrders(res.data));
    axios.get("/api/admin/products/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setProducts(res.data));
    axios.get("/api/category/all", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => setCategories(res.data));
  }, []);

  // 1️⃣ Orders per Day
  const ordersPerDayData = () => {
    const dailyCounts = {};
    orders.forEach(order => {
      const date = new Date(order.orderDate).toLocaleDateString();
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return {
      labels: Object.keys(dailyCounts),
      datasets: [
        {
          label: "Orders per Day",
          data: Object.values(dailyCounts),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.3,
        }
      ]
    };
  };

  // 2️⃣ Top Selling Products
  const topSellingProductsData = () => {
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        productSales[item.productName] =
          (productSales[item.productName] || 0) + item.quantity;
      });
    });

    const sortedProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedProducts.map(([name]) => name),
      datasets: [
        {
          label: "Quantity Sold",
          data: sortedProducts.map(([, qty]) => qty),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        }
      ]
    };
  };

const revenueOverTimeData = () => {
  const revenueMap = {};
  orders.forEach(order => {
    const date = new Date(order.orderDate).toLocaleDateString();
    let orderRevenue = 0;
    order.items.forEach(item => {
      const price = item.priceAtPurchase || 0;
      const quantity = item.quantity || 0;
      orderRevenue += price * quantity;
    });
    revenueMap[date] = (revenueMap[date] || 0) + orderRevenue;
  });

  return {
    labels: Object.keys(revenueMap),
    datasets: [
      {
        label: "Revenue Over Time",
        data: Object.values(revenueMap),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.3,
      }
    ]
  };
};

const usersOverTimeData = () => {
  const dailyUsers = {};
  orders.forEach(order => {
    const date = new Date(order.user?.createdAt).toLocaleDateString();
    dailyUsers[date] = (dailyUsers[date] || 0) + 1;
  });

  return {
    labels: Object.keys(dailyUsers),
    datasets: [
      {
        label: "New Users Over Time",
        data: Object.values(dailyUsers),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.3
      }
    ]
  };
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Orders per Day</h2>
          <Line data={ordersPerDayData()} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
          <Bar data={topSellingProductsData()} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Top Vendor Sales</h2>
          <Line data={revenueOverTimeData ()} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">User Registration</h2>
          <Bar data={usersOverTimeData ()} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
