import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Eye,
  Star,
  Users,
  User,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Search,
  Download,
  Bell,
  Settings,
  LogOut,
  Leaf,
  Award
} from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { Button } from 'react-scroll';
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { handleLogout } from './App';
import VendorProduct from './components/VendorProduct';
import VendorOrders from './components/VendorOrders';
import OverviewTab from './components/OverviewTab';

const VendorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await axios.get("/api/vendor/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVendor(res.data);
        localStorage.setItem("vendorId", res.data.vendorId); // store globally if needed
      } catch (err) {
        console.error("Error fetching vendor profile", err);
      }
    };
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };
  fetchVendor();
  fetchCategories();
}, []);



  // Mock data - in real app this would come from API
  const vendorInfo = {
    name: "Green Munch Co.",
    email: "vendor@greenmunch.com",
    joinDate: "March 2023",
    rating: 4.8,
    totalProducts: 24,
    verified: true
  };

  const analytics = {
    totalRevenue: 3420.50,
    monthlyGrowth: 12.5,
    totalOrders: 89,
    averageRating: 4.6,
    lowStockItems: 2,
    pendingOrders: 7
  };

  const recentOrders = [
    { id: "#ORD-001", customer: "Sarah J.", product: "Kale Chips", amount: 17.98, status: "shipped", date: "2 hours ago" },
    { id: "#ORD-002", customer: "Mike R.", product: "Energy Balls", amount: 25.98, status: "processing", date: "4 hours ago" },
    { id: "#ORD-003", customer: "Emma L.", product: "Date Bars", amount: 31.98, status: "delivered", date: "1 day ago" },
    { id: "#ORD-004", customer: "John D.", product: "Quinoa Mix", amount: 19.98, status: "pending", date: "2 days ago" }
  ];

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "🥜",
    ingredients: "",
    nutritionInfo: "",
    allergens: "",
    weight: "",
    packageSize: "",
    shelfLife: "",
    storageInstructions: "",
  });


  // const handleAddProduct = () => {
  //   if (newProduct.name && newProduct.category && newProduct.price && newProduct.stock) {
  //     const product = {
  //       id: products.length + 1,
  //       ...newProduct,
  //       price: parseFloat(newProduct.price),
  //       stock: parseInt(newProduct.stock),
  //       sold: 0,
  //       rating: 0,
  //       status: 'active',
  //       lowStock: parseInt(newProduct.stock) < 10
  //     };
  //     setProducts([...products, product]);
  //     setNewProduct({ name: '', category: '', price: '', stock: '', description: '', image: '🥜' });
  //     setShowAddProduct(false);
  //   }
  // };

  // const handleDeleteProduct = (id) => {
  //   setProducts(products.filter(p => p.id !== id));
  // };

  // const handleUpdateStock = (id, newStock) => {
  //   setProducts(products.map(p => 
  //     p.id === id 
  //       ? { 
  //           ...p, 
  //           stock: newStock, 
  //           lowStock: newStock < 10,
  //           status: newStock === 0 ? 'out_of_stock' : 'active'
  //         }
  //       : p
  //   ));
  // };

  // const filteredProducts = products.filter(product => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesFilter = filterCategory === 'all' || product.category === filterCategory;
  //   return matchesSearch && matchesFilter;
  // });




  // const categories = ['all', ...new Set(products.map(p => p.category))];

  const StatCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-white",
      green: "bg-emerald-500 text-white", 
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      red: "bg-red-500 text-white",
      indigo: "bg-indigo-500 text-white"
    };

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
            {change && (
              <p className={`text-sm mt-2 flex items-center font-medium ${change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {change > 0 ? '+' : ''}{change}%
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${colorClasses[color]} shadow-lg`}>
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </div>
    );
  };

  // const ProductModal = ({ product, onClose, onSave }) => (
  //   <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
  //     <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-200">
  //       <h3 className="text-2xl font-bold mb-6 text-gray-800">
  //         {product ? 'Edit Product' : 'Add New Product'}
  //       </h3>
  //       <div className="space-y-5">
  //         <input
  //           type="text"
  //           placeholder="Product Name"
  //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
  //           value={product ? product.name : newProduct.name}
  //           onChange={(e) => product 
  //             ? setEditingProduct({...product, name: e.target.value})
  //             : setNewProduct({...newProduct, name: e.target.value})
  //           }
  //         />
  //         <select
  //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
  //           value={product ? product.category : newProduct.category}
  //           onChange={(e) => product
  //             ? setEditingProduct({...product, category: e.target.value})
  //             : setNewProduct({...newProduct, category: e.target.value})
  //           }
  //         >
  //           <option value="">Select Category</option>
  //           <option value="Chips">Chips</option>
  //           <option value="Bars">Bars</option>
  //           <option value="Energy">Energy</option>
  //           <option value="Mix">Mix</option>
  //           <option value="Cookies">Cookies</option>
  //         </select>
  //         <input
  //           type="number"
  //           step="0.01"
  //           placeholder="Price"
  //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
  //           value={product ? product.price : newProduct.price}
  //           onChange={(e) => product
  //             ? setEditingProduct({...product, price: e.target.value})
  //             : setNewProduct({...newProduct, price: e.target.value})
  //           }
  //         />
  //         <input
  //           type="number"
  //           placeholder="Stock Quantity"
  //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
  //           value={product ? product.stock : newProduct.stock}
  //           onChange={(e) => product
  //             ? setEditingProduct({...product, stock: e.target.value})
  //             : setNewProduct({...newProduct, stock: e.target.value})
  //           }
  //         />
  //         <textarea
  //           placeholder="Product Description"
  //           rows="3"
  //           className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
  //           value={product ? product.description || '' : newProduct.description}
  //           onChange={(e) => product
  //             ? setEditingProduct({...product, description: e.target.value})
  //             : setNewProduct({...newProduct, description: e.target.value})
  //           }
  //         />
  //       </div>
  //       <div className="flex gap-4 mt-8">
  //         <button
  //           onClick={onClose}
  //           className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={onSave}
  //           className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
  //         >
  //           {product ? 'Save Changes' : 'Add Product'}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-xl shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">VeganSnacks</h1>
                <p className="text-sm text-gray-500 font-medium">Vendor Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button className="p-3 text-gray-500 hover:text-gray-700 relative bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button onClick = {()=>{navigate('/vendor/profile')}} className="p-3 text-gray-500 hover:text-gray-700 relative bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <User className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <button
              className="
              relative inline-flex items-center justify-center px-4 py-2 font-medium text-white rounded-lg shadow-md
              bg-gradient-to-r from-red-400 via-pink-500 to-purple-600
              hover:from-red-500 hover:via-pink-600 hover:to-purple-700
              transition-all duration-300
              group h-[20]
              text-sm
              " onClick={()=>handleLogout(navigate)}
              >
              <span className="absolute inset-0 w-full h-full bg-white opacity-10 blur rounded-lg transition-all duration-300 group-hover:opacity-30"></span>
                
              <span className="relative flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 0H5m2 0h12" />
              </svg>
                Logout
              </span>
              </button>
              
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-xl shadow-lg border border-gray-200 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (<OverviewTab vendorId = {localStorage.getItem("vendorId")}/>)}



        {/* {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
                <p className="text-gray-600 font-medium">Manage your vegan snack products</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>


            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           
              <select 
  value={filterCategory} 
  onChange={(e) => setFilterCategory(e.target.value)} 
  className="p-2 border rounded"
>
  <option value="all">Categories</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.name}>{cat.name}</option>
  ))}
</select>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="p-6">
                    <div className="text-5xl mb-4 text-center">{product.image}</div>
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">{product.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 mr-1" />
                        <span className="font-medium">{product.rating || 'No rating'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        product.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        product.status === 'out_of_stock' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Stock: <span className={`font-semibold ${product.lowStock ? 'text-red-600' : 'text-emerald-600'}`}>
                        {product.stock} units
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {activeTab === 'products' && (
  <VendorProduct
    vendor={vendor}
  />
)}


    
      {/* {(showAddProduct || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            if (editingProduct) {
              setProducts(products.map(p => 
                p.id === editingProduct.id 
                  ? { ...editingProduct, price: parseFloat(editingProduct.price), stock: parseInt(editingProduct.stock) }
                  : p
              ));
              setEditingProduct(null);
            } else {
              handleAddProduct();
            }
          }}
        />

      )} */}

       {activeTab === 'orders' && ( <VendorOrders/> )}
    </div>
    </div>
  );
};

export default VendorDashboard;