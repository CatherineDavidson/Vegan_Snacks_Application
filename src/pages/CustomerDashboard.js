import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Heart, Star, Plus, Minus, Moon, Sun, Filter, Eye, ShoppingBag, Zap, Award, Truck, Shield, ArrowRight, X, User, Package, Calendar, AlertCircle } from 'lucide-react';
import axios from "axios";
import api from '../api/api';
import PopUp from '../components/PopUp';
import CustomerProfile from '../components/CustomerProfile';
import { handleLogout } from '../App';
import { useNavigate } from 'react-router-dom';
import CartSidebar from '../components/CartSideBar';

const CustomerDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [showQuickView, setShowQuickView] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popup, setPopup] = useState({ message: '', type: 'success' });
  const [selectedItems, setSelectedItems] = useState([]); 
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showProfile, setShowProfile] = useState(false);  
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

const filteredProducts =
  selectedCategory === "All"
    ? products
    : products.filter((p) => p.categoryName === selectedCategory);

const addToCart = async (product) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "https://vegan-snacks.onrender.com/api/cart/items",
      {
        productId: product.productId,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update frontend cart state
    const addedItem = { ...product, quantity: 1 }; // You can also use response.data if API returns cart item
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, addedItem];
      }
    });

    setPopup({ message: '${product.productName} added to cart successfully!', type: 'success' });
    fetchCartItems();
  } catch (error) {
    console.error("Error adding to cart:", error);
    setPopup({ message: 'Failed to add to cart.', type: 'error' });
  }
};

// Toggle cart item selection
const toggleCartItemSelection = (cartItemId) => {
  setCartItems(prev =>
    prev.map(item =>
      item.cartItemId === cartItemId ? { ...item, selected: !item.selected } : item
    )
  );
};

// Calculate total price for selected items
const getSelectedTotalPrice = () => 
  cartItems
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    .toFixed(2);

// Calculate total quantity for selected items
const getSelectedTotalItems = () =>
  cartItems.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0);



  // const updateCartQuantity = (productId, newQuantity) => {
  //   if (newQuantity === 0) {
  //     setCartItems(prev => prev.filter(item => item.id !== productId));
  //   } else {
  //     setCartItems(prev => 
  //       prev.map(item => 
  //         item.id === productId ? { ...item, quantity: newQuantity } : item
  //       )
  //     );
  //   }
  // };
  const fetchCartItems = async () => {
    try {
      const res = await fetch('https://vegan-snacks.onrender.com/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      } else {
        setPopup({ message: 'Failed to fetch cart items', type: 'error' });
      }
    } catch (err) {
      setPopup({ message: 'Something went wrong while fetching cart!', type: 'error' });
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

const updateCartQuantity = async (cartItem, newQuantity) => {
  const token = localStorage.getItem("token");
  try {
    if (newQuantity <= 0) {
      await axios.delete(`https://vegan-snacks.onrender.com/api/cart/items/${cartItem.cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(prev => prev.filter(ci => ci.cartItemId !== cartItem.cartItemId));
    } else {
      await axios.put(
        `https://vegan-snacks.onrender.com/api/cart/items/${cartItem.cartItemId}?quantity=${newQuantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(prev =>
        prev.map(ci =>
          ci.cartItemId === cartItem.cartItemId ? { ...ci, quantity: newQuantity } : ci
        )
      );
    }
  } catch (err) {
    console.error("Error updating cart:", err);
  }
};

const handlePlaceOrder = async () => {
  if (selectedItems.length === 0) {
    setPopup({ message: 'Please select at least one item to place the order.', type: 'error' })
    return;
  }

  try {
    const token = localStorage.getItem("token"); // or wherever you store JWT
console.log("Sending cartItemIds for checkout:", selectedItems);

    await axios.post(
      "/api/orders/place",
      selectedItems,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setPopup({ message: 'Order placed successfully!', type: 'success' })
    fetchCartItems(); // refresh cart
    setSelectedItems([]); // clear selection
    setShowCheckout(false);
  } catch (error) {
    console.error(error);
    setPopup({ message: 'Failed to place order.', type: 'error' })
  }
};

// const handlePlaceOrder = async () => {
//   try {
//     if (selectedItems.length === 0) {
//       alert("Please select items to checkout");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     // ✅ Send cartItemIds, not productIds
//     const cartItemIds = selectedItems.map(item => item.cartItemId);

//     console.log("Sending cartItemIds for checkout:", cartItemIds);

//     const response = await axios.post(
//       "/api/orders/place",
//       cartItemIds,
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     alert("Order placed successfully!");
//     console.log("Order response:", response.data);

//     // Optionally refresh cart after placing order
//     fetchCartItems();

//   } catch (error) {
//     console.error("Error placing order:", error);
//     alert("Failed to place order. Please try again.");
//   }
// };

const toggleSelectItem = (cartItemId) => {
    setSelectedItems(prev =>
      prev.includes(cartItemId)
        ? prev.filter(id => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

const getTotalPrice = () =>
  cartItems
    .filter(item => selectedItems.includes(item.cartItemId))
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0)
    .toFixed(2);

const getTotalItems = () =>
  cartItems
    .filter(item => selectedItems.includes(item.cartItemId))
    .reduce((sum, item) => sum + item.quantity, 0);


  const addToCheckout = () => {
    const checkoutItems = cartItems.filter(item => selectedItems.includes(item.cartItemId));
    console.log("Items for checkout:", checkoutItems);
    // Redirect or call backend checkout API
  };


  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  // const getTotalPrice = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50',
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    headerBg: isDarkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200',
    inputBg: isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
  };

useEffect(() => {
  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products/all"),
        api.get("/category/all")
      ]);
      setProducts(productsRes.data);
      setCategories([{ id: "all", name: "All" }, ...categoriesRes.data]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
}, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOrdersClick = () => {
    fetchOrders();
    setShowOrders(true);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses.bg}`}>
      {/* Futuristic Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-xl border-b transition-all duration-300 ${themeClasses.headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
                  <span className="text-white font-bold text-xl transform -rotate-12">V</span>
                </div>
              </div>
              <div>
                <h1 className={`text-2xl font-black ${themeClasses.text}`}>VERDANT</h1>
                <p className={`text-xs ${themeClasses.textSecondary} tracking-wider`}>FUTURE OF SNACKING</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${themeClasses.textSecondary}`} />
                <input
                  type="text"
                  placeholder="Discover your next favorite snack..."
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all ${themeClasses.inputBg} ${themeClasses.text}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all hover:scale-110 ${isDarkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative p-3 rounded-xl transition-all hover:scale-110 ${themeClasses.cardBg} border`}
              >
                <ShoppingCart className={`h-5 w-5 ${themeClasses.text}`} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <button onClick={handleOrdersClick}
              className={`relative p-3 rounded-xl transition-all hover:scale-110 ${themeClasses.cardBg} border`}>
                <ShoppingBag className={`h-5 w-5 ${themeClasses.text}`}/>
              </button>

              <button
                onClick={() => setShowProfile(true)}
                className={`relative p-3 rounded-xl transition-all hover:scale-110 ${themeClasses.cardBg} border`}>
                 <User className={`h-5 w-5 ${themeClasses.text}`} />
              </button>

                <button
                  className="
                    relative inline-flex items-center justify-center px-4 py-2 font-medium text-white rounded-lg shadow-md
                    bg-gradient-to-r from-red-400 via-pink-500 to-purple-600
                    hover:from-red-500 hover:via-pink-600 hover:to-purple-700
                    transition-all duration-300
                    group
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

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Plant-Powered Innovation
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-black mb-6 ${themeClasses.text}`}>
            Snack Like The
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent"> Future</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
            Revolutionary plant-based snacks engineered for peak performance and extraordinary taste
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className={`flex items-center px-4 py-2 rounded-full ${themeClasses.cardBg} border`}>
              <Award className="h-5 w-5 mr-2 text-emerald-500" />
              <span className={`text-sm ${themeClasses.text}`}>Award Winning</span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full ${themeClasses.cardBg} border`}>
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              <span className={`text-sm ${themeClasses.text}`}>100% Plant-Based</span>
            </div>
            <div className={`flex items-center px-4 py-2 rounded-full ${themeClasses.cardBg} border`}>
              <Truck className="h-5 w-5 mr-2 text-purple-500" />
              <span className={`text-sm ${themeClasses.text}`}>Carbon Neutral Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`group relative overflow-hidden px-6 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.gradient} text-blue-400 shadow-2xl scale-105`
                    : `${themeClasses.cardBg} border ${themeClasses.text} hover:shadow-xl`
                }`}
              >
                <span className="text-xl mr-2">{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.name && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          <PopUp
        message={popup.message}
        type={popup.type}
        onClose={() => setPopup({ message: '', type: 'success' })}
      />

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${themeClasses.cardBg} border`}>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.productId)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110 ${
                    favorites.has(product.productId)
                      ? 'bg-red-500 text-white'
                      : `${themeClasses.cardBg} ${themeClasses.text}`
                  }`}
                >
                  <Heart className="h-4 w-4" fill={favorites.has(product.productId) ? 'currentColor' : 'none'} />
                </button>
                

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  {/* <div className="mb-4 flex justify-center"> */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-cover h-64 rounded-lg shadow"
                  />
                ) : (
                  
                    <span className="text-gray-400 flex items-center justify-center h-64">No Image</span>
                  
                )}
              {/* </div> */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => setShowQuickView(product)}
                    className="absolute bottom-4 right-4 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <Eye className="h-4 w-4 text-gray-800" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  {/* Badges */}
                  {/* <div className="flex flex-wrap gap-2 mb-3">
                    {product.badges.map(badge => (
                      <span key={badge.id} className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-xs rounded-full font-medium">
                        {badge}
                      </span>
                    ))}
                  </div> */}

                  <h3 className={`text-xl font-bold mb-2 ${themeClasses.text}`}>{product.name}</h3>
                  <p className={`text-sm mb-4 ${themeClasses.textSecondary} line-clamp-2`}>{product.description}</p>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm ${themeClasses.textSecondary}`}>({product.reviews})</span>
                  </div>

                  {/* Nutrition Quick Info */}
                  {/* <div className={`flex justify-between text-xs mb-4 p-3 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-center">
                      <div className={`font-bold ${themeClasses.text}`}>{product.nutrition.calories}</div>
                      <div className={themeClasses.textSecondary}>Cal</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${themeClasses.text}`}>{product.nutrition.protein}g</div>
                      <div className={themeClasses.textSecondary}>Protein</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${themeClasses.text}`}>{product.nutrition.carbs}g</div>
                      <div className={themeClasses.textSecondary}>Carbs</div>
                    </div>
                  </div> */}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-2xl font-black ${themeClasses.text}`}>${product.price}</span>
                      {product.originalPrice && (
                        <span className={`text-sm line-through ml-2 ${themeClasses.textSecondary}`}>${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                    >
                      <Plus className="h-4 w-4 inline mr-1 group-hover:rotate-90 transition-transform" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl ${themeClasses.cardBg} border`}>
            <button
              onClick={() => setShowQuickView(null)}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full ${themeClasses.cardBg} border`}
            >
              <X className={`h-5 w-5 ${themeClasses.text}`} />
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Product Image */}
              <div>
                {showQuickView.imageUrl ? (
                  <img
                    src={showQuickView.imageUrl}
                    alt={showQuickView.name}
                    className="h-64 object-cover rounded-lg shadow"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>{showQuickView.name}</h3>
                <p className={`mb-2 ${themeClasses.textSecondary}`}>{showQuickView.description}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Ingredients:</strong> {showQuickView.ingredients}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Nutrition Info:</strong> {showQuickView.nutritionInfo}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Allergens:</strong> {showQuickView.allergens}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Weight:</strong> {showQuickView.weight}g</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Package Size:</strong> {showQuickView.packageSize}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Shelf Life:</strong> {showQuickView.shelfLife} days</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Storage Instructions:</strong> {showQuickView.storageInstructions}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Status:</strong> {showQuickView.status}</p>
                <p className={`mb-2 ${themeClasses.textSecondary}`}><strong>Category:</strong> {showQuickView.category?.name}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`text-2xl font-black ${themeClasses.text}`}>${showQuickView.price}</span>
                  <button
                    onClick={() => { addToCart(showQuickView); setShowQuickView(null); }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Cart Sidebar */}
{/*     
{isCartOpen && (
  <div className="fixed inset-0 z-50 flex">
    <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
    <div className={`w-96 h-full overflow-y-auto ${themeClasses.cardBg} border-l`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold ${themeClasses.text}`}>Your Cart</h3>
          <button onClick={() => setIsCartOpen(false)}>
            <X className={`h-5 w-5 ${themeClasses.text}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className={`h-12 w-12 mx-auto mb-4 ${themeClasses.textSecondary}`} />
            <p className={themeClasses.textSecondary}>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.cartItemId} className={`flex items-start space-x-4 p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  
                 
                  <input
                    type="checkbox"
                    checked={item.selected || false}
                    onChange={() => toggleCartItemSelection(item.cartItemId)}
                    className="mt-2"
                  />

                  <div className="w-24 h-24 flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-24 w-24 object-cover rounded-lg shadow"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <h4 className={`font-semibold ${themeClasses.text}`}>{item.product.name}</h4>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>${item.product.price}</p>
                    <p className={`text-xs ${themeClasses.textSecondary}`}>Weight: {item.product.weight}g | Shelf Life: {item.product.shelfLife} days</p>

                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className={`p-1 rounded-full ${themeClasses.cardBg} border`}
                      >
                        <Minus className={`h-4 w-4 ${themeClasses.text}`} />
                      </button>
                      <span className={`w-8 text-center ${themeClasses.text}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className={`p-1 rounded-full ${themeClasses.cardBg} border`}
                      >
                        <Plus className={`h-4 w-4 ${themeClasses.text}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-lg font-bold ${themeClasses.text}`}>Total: ${getSelectedTotalPrice()}</span>
                <span className={`text-sm ${themeClasses.textSecondary}`}>{getSelectedTotalItems()} items</span>
              </div>
              <button
                disabled={getSelectedTotalItems() === 0}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-semibold flex items-center justify-center disabled:opacity-50"
              >
                Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)} */}
{/* Cart Sidebar */}
{isCartOpen && (
  <div className="fixed inset-0 z-30 flex">
    {/* Overlay */}
    <div
      className="flex-1 bg-gradient-to-br from-black/70 via-blue-900/30 to-emerald-900/30 backdrop-blur-md"
      onClick={() => setIsCartOpen(false)}
    ></div>

    {/* Sidebar */}
    <aside className="relative w-full max-w-2xl h-full border-l shadow-2xl bg-white/90 dark:bg-gray-900/85 backdrop-blur-xl ring-1 ring-inset ring-gray-200/40 dark:ring-gray-700/40 animate-slideInRight overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg">
        <h3 className="text-2xl font-extrabold tracking-tight text-gray-800 dark:text-white flex items-center gap-3 drop-shadow">
          <ShoppingCart className="text-emerald-500 w-7 h-7" />
          Cart
        </h3>
        <button
          onClick={() => setIsCartOpen(false)}
          className="p-2 rounded-full hover:bg-emerald-500/20 transition-colors"
          aria-label="Close cart"
        >
          <X className="h-6 w-6 text-gray-500 dark:text-white" />
        </button>
      </div>

      {/* Cart Body */}
      <div className="flex-1 px-8 py-8 space-y-5">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="h-20 w-20 text-emerald-300 dark:text-emerald-500 mb-4" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
              Your cart is empty
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5 mb-8">
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center gap-6 p-4 bg-white/90 dark:bg-gray-800/85 rounded-2xl shadow-sm border border-emerald-100 dark:border-gray-700 group transition cursor-pointer"
                >
                  {/* Select */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.cartItemId)}
                    onChange={() => toggleSelectItem(item.cartItemId)}
                    className="accent-emerald-500 w-5 h-5 rounded focus:ring-2 focus:ring-emerald-400"
                  />

                  {/* Image */}
                  <div
                    className="flex-shrink-0 w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-emerald-400/20 group-hover:border-emerald-500 transition-all"
                    onClick={() => setShowQuickView?.(item.product)}
                  >
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* Info */}
                  <div
                    className="flex-1 space-y-1"
                    onClick={() => setShowQuickView?.(item.product)}
                  >
                    <div className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                      {item.product.name}
                    </div>
                    <div className="text-md font-bold text-emerald-600 dark:text-emerald-400">
                      ${item.product.price}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.product.weight}g • {item.product.shelfLife}d
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() =>
                        updateCartQuantity(item, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-full text-emerald-600 hover:bg-emerald-200 transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-emerald-100 dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-full text-emerald-600 hover:bg-emerald-200 transition"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4 pb-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Total:
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  ${getTotalPrice()}
                </span>
              </div>
              <div className="text-right text-md text-gray-500 dark:text-gray-400 mb-2">
                {getTotalItems()} item{getTotalItems() !== 1 && "s"} selected
              </div>
              <button
                onClick={() => {
                  if (getTotalItems() === 0) {
                    setPopup({ message: "Select products to checkout.", type: "error" });
                  } else {
                    setIsCartOpen(false);
                    setShowCheckout(true);
                  }
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-blue-600 hover:to-emerald-500 text-white text-lg rounded-2xl font-extrabold flex items-center justify-center shadow-lg transition-all focus:ring-4 focus:ring-emerald-300 active:scale-95 disabled:opacity-50"
              >
                Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  </div>
)}

      {/* <CartSidebar
  isOpen={isCartOpen}
  onClose={() => setIsCartOpen(false)}
  cartItems={cartItems}
  setCartItems={setCartItems}
  setPopup={setPopup}
  setShowQuickView={setShowQuickView}
/> */}

      {showCheckout && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[200] ">
    <div className={`relative max-w-3xl z-70 w-full max-h-[90vh] overflow-y-auto rounded-3xl ${themeClasses.cardBg} border p-6`}>
      <button
        onClick={() => setShowCheckout(false)}
        className={`absolute top-4 right-4 p-2 rounded-full ${themeClasses.cardBg} border`}
      >
        <X className={`h-5 w-5 ${themeClasses.text}`} />
      </button>

      <h2 className={`text-2xl font-bold mb-4 ${themeClasses.text}`}>Review Your Order</h2>

    <div className="space-y-4 mb-6">
      {cartItems
        .filter(item => selectedItems.includes(item.cartItemId))
        .map(item => (
          <div key={item.cartItemId} className="flex justify-between items-center p-4 rounded-xl border">
            <div className="flex items-center space-x-4">
              {item.product.imageUrl && (
                <img src={item.product.imageUrl} alt={item.product.name} className="h-16 w-16 object-cover rounded-lg" />
              )}
              <div>
                <h4 className={`font-semibold ${themeClasses.text}`}>{item.product.name}</h4>
                <p className={`text-sm ${themeClasses.textSecondary}`}>${item.product.price} × {item.quantity}</p>
              </div>
            </div>
            <span className={`text-lg font-bold ${themeClasses.text}`}>${getTotalPrice()}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className={`text-lg font-bold ${themeClasses.text}`}>Total:</span>
        <span className={`text-lg font-bold ${themeClasses.text}`}>${getTotalPrice()}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-semibold"
      >
        Place Order
      </button>
    </div>
  </div>
)}
{showProfile && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowProfile(false)} // close on overlay click
  >
    <div
      className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto"
      onClick={e => e.stopPropagation()} // prevent closing when clicking inside
    >
      <button
        onClick={() => setShowProfile(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
      >
        X
      </button>
      <CustomerProfile />
    </div>
  </div>
)}

{showOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 mx-4">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Package className="w-6 h-6 mr-3 text-blue-600" />
                Your Orders
              </h2>
              <button
                onClick={() => setShowOrders(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No orders yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Your order history will appear here once you make a purchase.</p>
                </div>
              ) : (
                <div className="space-y-6">
                 {orders?.map(order => (
                  <div key={order.id} className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{order.id}</span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white text-lg">Order #{order.id}</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                        Completed
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-600">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-gray-500" />
                        Order Items
                      </h4>
                      {order.items?.length > 0 ? (
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                              <div className="flex-1">
                                <span className="font-medium text-gray-900 dark:text-white">{item.product.name}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">× {item.quantity}</span>
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-white">${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          No items in this order
                        </p>
                      )}
                    </div>
                    
                  </div>
                ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}




    </div>
  );
};

export default CustomerDashboard;