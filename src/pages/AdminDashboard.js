// import React, { useState } from "react";
// import {
//   BellIcon,
//   CheckBadgeIcon,
//   ClipboardDocumentListIcon,
//   UserGroupIcon,
// } from "@heroicons/react/24/outline";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("requests");

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
//       {/* Navbar */}
//       <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
//           <div className="flex items-center space-x-6">
//             <button className="relative">
//               <BellIcon className="w-6 h-6 text-gray-600" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
//                 4
//               </span>
//             </button>
//             <img
//               src="https://i.pravatar.cc/40"
//               alt="Admin"
//               className="w-10 h-10 rounded-full border border-gray-300"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Stats */}
//       <section className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <StatCard
//           icon={<UserGroupIcon className="w-8 h-8 text-indigo-600" />}
//           title="Total Vendors"
//           value="120"
//         />
//         <StatCard
//           icon={<ClipboardDocumentListIcon className="w-8 h-8 text-yellow-500" />}
//           title="Pending Requests"
//           value="8"
//         />
//         <StatCard
//           icon={<CheckBadgeIcon className="w-8 h-8 text-green-500" />}
//           title="Docs to Verify"
//           value="15"
//         />
//         <StatCard
//           icon={<BellIcon className="w-8 h-8 text-red-500" />}
//           title="Notifications"
//           value="4"
//         />
//       </section>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
//         {/* Left column: Requests + Verification */}
//         <div className="lg:col-span-2 space-y-6">
//           <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
//           <div className="bg-white rounded-xl shadow p-4">
//             {activeTab === "requests" && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Vendor Requests</h2>
//                 <TablePlaceholder message="List of pending vendor requests" />
//               </div>
//             )}
//             {activeTab === "verify" && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">
//                   Document Verification
//                 </h2>
//                 <TablePlaceholder message="Documents awaiting verification" />
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right column: Notifications */}
//         <div className="space-y-6">
//           <div className="bg-white rounded-xl shadow p-4">
//             <h2 className="text-lg font-semibold mb-4">Notifications</h2>
//             <ul className="space-y-3">
//               {["New vendor registered", "Document uploaded", "Vendor approved"].map(
//                 (note, idx) => (
//                   <li
//                     key={idx}
//                     className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
//                   >
//                     {note}
//                   </li>
//                 )
//               )}
//             </ul>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ icon, title, value }) {
//   return (
//     <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow hover:shadow-md transition flex items-center space-x-4">
//       <div className="p-3 bg-gray-100 rounded-lg">{icon}</div>
//       <div>
//         <p className="text-gray-500 text-sm">{title}</p>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// }

// function TabSwitcher({ activeTab, setActiveTab }) {
//   return (
//     <div className="flex space-x-4 border-b border-gray-200">
//       {[
//         { key: "requests", label: "Requests" },
//         { key: "verify", label: "Verification" },
//       ].map((tab) => (
//         <button
//           key={tab.key}
//           className={`pb-2 px-2 ${
//             activeTab === tab.key
//               ? "border-b-2 border-indigo-600 text-indigo-600 font-medium"
//               : "text-gray-500 hover:text-indigo-600"
//           }`}
//           onClick={() => setActiveTab(tab.key)}
//         >
//           {tab.label}
//         </button>
//       ))}
//     </div>
//   );
// }

// function TablePlaceholder({ message }) {
//   return (
//     <div className="text-center text-gray-500 py-6 border-2 border-dashed border-gray-200 rounded-lg">
//       {message}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Shield, 
  Headphones,
  Settings,
  Home,
  Store,
  TrendingUp,
  Bell,
  Search,
  Sun,
  Moon,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Activity,
  UserCheck,
  Package2,
  ArrowRight,
  Filter,
  Download,
  Tag,
  Grid3X3,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import AdminVendorApprovals from '../components/AdminVendorApproval';
import { handleLogout } from '../App';
import PopUp from '../components/PopUp';
import AdminProducts from '../components/AdminProducts';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { useMemo } from 'react';
import cartgirl from '../images/cartgirl.png'
import OrdersDashboard from '../components/OrdersDashboard';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useRef } from 'react';


const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('vendors');
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, ADMIN, VENDOR, CUSTOMER
  const categoriesRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");


  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

    const [stats, setStats] = useState({
    totalVendors: 0,
    pendingApprovals: 0,
    activeVendors: 0,
  });
    const goBack = () => {
    navigate(-1); // goes one step back in browser history
  };
const filteredUsers = users.filter(user => {
  const matchesSearch = 
    user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

  return matchesSearch && matchesRole;
});


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/api/vendor/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    }; 
    let ignore = false;

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/user/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!ignore) {
        setUsers(res.data);
        setLoadingUsers(false);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setLoadingUsers(false);
    }
  };

  fetchUsers();
  fetchStats();
  
  return () => { ignore = true; }
  }, []);
  // Theme classes
  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white/70 backdrop-blur-sm',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-white/20',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-white/50',
    navBg: isDarkMode ? 'bg-gray-800/95 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md',
    tabActive: isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-lg',
    tabInactive: isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
  };

  const navigationTabs = [
    { 
      id: 'vendors', 
      icon: Store, 
      label: 'Vendors',
      gradient: 'from-emerald-500 to-green-500',
      description: 'Vendor Management',
      badge: 12
    },
    { 
      id: 'products', 
      icon: Package, 
      label: 'Products',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Product Catalog',
      badge: 8
    },
    { 
      id: 'categories', 
      icon: Tag, 
      label: 'Categories',
      gradient: 'from-orange-500 to-red-500',
      description: 'Category Management'
    },
    { 
      id: 'users', 
      icon: Users, 
      label: 'Users',
      gradient: 'from-indigo-500 to-purple-500',
      description: 'User Accounts'
    },
    { 
      id: 'orders', 
      icon: ShoppingCart, 
      label: 'Orders',
      gradient: 'from-pink-500 to-rose-500',
      description: 'Order Processing',
      badge: 3
    },
    { 
      id: 'analytics', 
      icon: BarChart3, 
      label: 'Analytics',
      gradient: 'from-teal-500 to-cyan-500',
      description: 'Reports & Insights'
    },
  ];

  const quickActions = [
    { icon: UserCheck, label: 'Approve Vendors', count: 12, color: 'from-blue-500 to-blue-600' },
    { icon: Package2, label: 'Review Products', count: 8, color: 'from-green-500 to-green-600' },
    { icon: Tag, label: 'Manage Categories', count: 3, color: 'from-orange-500 to-orange-600' },
    { icon: Zap, label: 'Quick Actions', count: 5, color: 'from-purple-500 to-purple-600' }
  ];

const StatCard = ({ title, value, icon: Icon, trend, gradient, className = "" }) => (
  <div
    className={`rounded-3xl p-6 shadow-sm ${themeClasses.cardBg} ${themeClasses.border} border hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${className}`}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
    <div className="relative flex items-center gap-4">
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`${themeClasses.textSecondary} text-sm font-medium mb-1`}>{title}</p>
        <p className={`text-3xl font-bold ${themeClasses.text}`}>
          {value !== undefined && value !== null ? value.toLocaleString() : "0"}
        </p>
      </div>
    </div>
  </div>
);



  const TabButton = ({ tab, isActive }) => (
    <button
      onClick={() => setActiveSection(tab.id)}
      className={`relative group w-[50vh] px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border ${
        isActive ? themeClasses.tabActive : themeClasses.tabInactive
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Icon */}
        <div
          className={`p-2 rounded-lg transition-all duration-300 transform ${
            isActive
              ? 'bg-white/20 scale-125'   // enlarge when active
              : `bg-gradient-to-br ${tab.gradient} text-white group-hover:scale-110`
          }`}
        >
          <tab.icon size={isActive ? 20 : 15} className="transition-all duration-300" />
        </div>

        {/* Label */}
        <div className="text-left">
          <div className="flex items-center space-x-2">
            <span
              className={`font-semibold transition-all duration-300 ${
                isActive ? 'text-lg' : 'text-base'
              }`}
            >
              {tab.label}
            </span>
          </div>
        </div>
      </div>

    </button>
  );

  const QuickActionCard = ({ action }) => (
    <div className={`${themeClasses.cardBg} rounded-2xl p-6 ${themeClasses.border} border hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
            <action.icon size={20} />
          </div>
          <span className={`text-2xl font-bold ${themeClasses.text}`}>{action.count}</span>
        </div>
        <h4 className={`font-semibold ${themeClasses.text} mb-2`}>{action.label}</h4>
        <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700">
          <span>Take Action</span>
          <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ item }) => {
    const getIcon = () => {
      switch(item.type) {
        case 'vendor': return { icon: <Store size={16} />, color: 'text-blue-500' };
        case 'product': return { icon: <Package size={16} />, color: 'text-green-500' };
        case 'order': return { icon: <ShoppingCart size={16} />, color: 'text-purple-500' };
        case 'category': return { icon: <Tag size={16} />, color: 'text-orange-500' };
        case 'user': return { icon: <Users size={16} />, color: 'text-indigo-500' };
        default: return { icon: <Activity size={16} />, color: 'text-gray-500' };
      }
    };

    const iconData = getIcon();

    return (
      <div className={`flex items-center space-x-4 p-4 ${themeClasses.hover} rounded-xl transition-all duration-200 group`}>
        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} group-hover:scale-110 transition-transform duration-200`}>
          <span className={iconData.color}>{iconData.icon}</span>
        </div>
        <div className="flex-1">
          <p className={`font-medium ${themeClasses.text} mb-1`}>{item.action}</p>
          <p className={`text-sm ${themeClasses.textSecondary}`}>{item.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Clock size={14} className={themeClasses.textSecondary} />
          <span className={`text-sm ${themeClasses.textSecondary}`}>{item.time}</span>
        </div>
      </div>
    );
  };

    const renderVendorsContent = () => (
    <div className="space-y-8">
      {/* Vendor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Total Vendors"
        value={stats.totalVendors}
        icon={Store}
        trend={8}
        gradient="from-emerald-500 to-green-500"
      />
      <StatCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={AlertTriangle}
        trend={-2}
        gradient="from-yellow-500 to-orange-500"
      />
      <StatCard
        title="Active Vendors"
        value={stats.activeVendors}
        icon={UserCheck}
        trend={5}
        gradient="from-blue-500 to-cyan-500"
      />
    </div>

      {/* Vendor Management */}
      <div className={`${themeClasses.cardBg} rounded-3xl p-8 ${themeClasses.border} border shadow-sm`}>
        <AdminVendorApprovals/>
      </div>
    </div>
  );
  
const CategoriesDashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({ categoryProducts: [], categoriesByDate: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    let ignore = false;

    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!ignore) {
          const categoriesWithCount = res.data.map(category => ({
            ...category,
            noOfProducts: (category.products?.length || 0) + (category.snacks?.length || 0),
          }));
          setCategories(categoriesWithCount);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching category data", err);
          setLoading(false);
        }
      }
    };

    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/category/summary", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!ignore) setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch category summary", err);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await axios.get("/api/category/chart-data", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!ignore) setChartData(res.data);
      } catch (err) {
        console.error("Error fetching chart data", err);
      }
    };

    fetchCategories();
    fetchStats();
    fetchChartData();

    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        setShowModal(false);
        setNewCategory({ name: "", description: "" });
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };
  // inside your component
const getBarChartData = () => {
  if (!stats.categoryNames || !stats.categoryProductCounts) return [];

  // Aggregate counts by category name
  const map = {};
  stats.categoryNames.forEach((name, i) => {
    const count = stats.categoryProductCounts[i] ?? 0;
    if (map[name]) {
      map[name] += count;
    } else {
      map[name] = count;
    }
  });

  // Transform to array for BarChart
  return Object.entries(map).map(([name, products]) => ({ name, products }));
};

const aggregatedBarData = () => {
  const map = {};

  chartData.categoryNames?.forEach((name, i) => {
    if (!map[name]) map[name] = 0;
    map[name] += chartData.categoryProductCounts[i] ?? 0;
  });

  return Object.entries(map).map(([name, products]) => ({ name, products }));
};

  return (
    <div className="space-y-8">
      {/* Big Box Container */}
      <div>
        <div className="grid grid-cols-5 gap-8">
          {/* Left Section: Stat Cards */}
          {/* <div className="col-span-1 space-y-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r w-[37vh] from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Add Category
            </button>

            <StatCard
              title="Total Categories"
              value={stats.totalCategories ?? categories.length}
              icon={Tag}
              trend={5}
              gradient="from-orange-500 to-red-500"
            />

            <StatCard
              title="Top Category Sales"
              value={stats.topCategory?.noOfProducts ?? 0}
              icon={Star}
              trend={8}
              gradient="from-yellow-500 to-orange-500"
            />

            <StatCard
              title="New This Month"
              value={stats.newThisMonth ?? 0}
              icon={Zap}
              trend={25}
              gradient="from-purple-500 to-pink-500"
            />
          </div> */}
<div className="col-span-1 space-y-4">
  <button
    onClick={() => setShowModal(true)}
    className="bg-gradient-to-r w-[37vh] from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
  >
    Add Category
  </button>

  <StatCard
    title="Total Categories"
    value={stats.totalCategories ?? categories.length}
    icon={Tag}
    trend={5}
    gradient="from-orange-500 to-red-500"
  />

  <StatCard
    title="Top Category Sales"
    value={stats.topCategory?.noOfProducts ?? 0}
    icon={Star}
    trend={8}
    gradient="from-yellow-500 to-orange-500"
  />

  <StatCard
    title="New This Month"
    value={stats.newThisMonth ?? 0}
    icon={Zap}
    trend={25}
    gradient="from-purple-500 to-pink-500"
  />

  {/* ✅ Detailed Line Chart */}
<div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-2xl shadow-lg h-[56vh] flex flex-col justify-between">
  <div>
    <h3 className="text-xl font-bold mb-2">✨ Category Insights</h3>
    <p className="text-sm opacity-90 pt-5">
      Stay updated with your latest categories and trends. Add new categories to keep your product list fresh and engaging.
    </p>
  </div>
  
  <button
    onClick={() => {
      document.getElementById("categories-section")?.scrollIntoView({
        behavior: "smooth",
      });
    }}
    className="mb-5 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all self-start"
  >
    View Details
  </button>
</div>


</div>
          {/* Right Section: Add Category + Charts */}
          <div className="col-span-4 flex flex-col justify-between">
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Category</h2>

                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-orange-500"
                  />

                  <textarea
                    placeholder="Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="w-full p-3 border rounded-lg mb-3 focus:ring-2 focus:ring-orange-500"
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateCategory}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 space-y-8">
              {/* Bar Chart: Products per Category */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Products per Category</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={aggregatedBarData()} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="products" fill="#FF7F50" />
                  </BarChart>
                </ResponsiveContainer>


              </div>

              {/* Line Chart: New Categories Last 30 Days */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">New Categories Last 30 Days</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={chartData.categoriesByDate
                      ? Object.entries(chartData.categoriesByDate).map(([date, count]) => ({ date, count }))
                      : []
                    }
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div ref={categoriesRef} id="categories-section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Tag className="text-white" size={20} />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{category.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{category.noOfProducts} products</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

  const renderContent = () => {
    if (activeSection === "vendors") return renderVendorsContent();

    if (activeSection === 'categories') return <CategoriesDashboard/>;

    if (activeSection === 'orders') return <OrdersDashboard/>;

    if (activeSection === 'analytics') return <AnalyticsDashboard/>;

    if (activeSection === 'users') return (
<div className="bg-white p-6 rounded-xl shadow-lg">
  <h3 className="text-xl font-bold mb-4">All Users</h3>

  {/* Search + Role Filter */}
  <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
    <input
      type="text"
      placeholder="Search by name or email"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full md:w-1/3 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 mb-2 md:mb-0"
    />

    <select
      value={roleFilter}
      onChange={(e) => setRoleFilter(e.target.value)}
      className="w-full md:w-1/5 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
    >
      <option value="ALL">All Roles</option>
      <option value="ADMIN">Admin</option>
      <option value="VENDOR">Vendor</option>
      <option value="CUSTOMER">Customer</option>
    </select>
  </div>

  {loadingUsers ? (
    <p>Loading users...</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">{user.role}</td>
                <td className="px-4 py-2 border">
                  {user.enabled ? "Active" : "Disabled"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>


  );

    if (activeSection === 'products') return <AdminProducts/>;

  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-all duration-500`}>
      {/* Header */}
      <div >
        <div className={`${themeClasses.navBg} ${themeClasses.border}shadow-2xl transition-all duration-300 mb-3`}>
          <div className="px-2 py-2">
            <div className="flex items-center justify-between mb-6">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="text-white" size={20} />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${themeClasses.text}`}>FreshBites</h1>
                  <p className={`${themeClasses.textSecondary}`}>Advanced Admin Control Center</p>
                </div>
              </div>
                
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
                ADMIN
              </div>


              {/* Right Controls */}
              <div className="flex items-center space-x-4">
                
                <button
                  onClick={toggleTheme}
                  className={`p-4 rounded-2xl ${themeClasses.hover} transition-all duration-300 group`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="text-yellow-500 group-hover:rotate-180 transition-transform duration-500" size={24} />
                  ) : (
                    <Moon className={`${themeClasses.textSecondary} group-hover:rotate-180 transition-transform duration-500`} size={24} />
                  )}
                </button>

                <button className={`p-4 ${themeClasses.hover} rounded-2xl transition-all duration-300 relative group`}>
                  <Bell className={`${themeClasses.textSecondary} group-hover:animate-bounce`} size={24} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">3</span>
                </button>

                <button
                  class="
                    relative inline-flex items-center justify-center px-4 py-2 font-medium text-white rounded-lg shadow-md
                    bg-gradient-to-r from-red-400 via-pink-500 to-purple-600
                    hover:from-red-500 hover:via-pink-600 hover:to-purple-700
                    transition-all duration-300
                    group
                    text-sm
                  " onClick={()=>handleLogout(navigate)}
                >
                  <span class="absolute inset-0 w-full h-full bg-white opacity-10 blur rounded-lg transition-all duration-300 group-hover:opacity-30"></span>

                  <span class="relative flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0H5m2 0h12" />
                    </svg>
                    Logout
                  </span>
                </button>

              </div>
            </div>
            

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {navigationTabs.map((tab) => (
                <TabButton key={tab.id} tab={tab} isActive={activeSection === tab.id} />
              ))}
            </div>
            
          </div>
        </div>
      </div>
      {/* Popups */}
      {/* <PopUp message={success} type="success" onClose={() => setSuccess("")} />       
      <PopUp message={error} type="error" onClose={() => setError("")} /> */}

      {/* Main Content */}
      <main className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;