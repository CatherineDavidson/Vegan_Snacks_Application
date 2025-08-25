import React, { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem, checkout } from "../api/cartApi";
import { Trash2, Plus, Minus } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(itemId, newQty);
      fetchCart();
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout();
      alert("Order placed successfully!");
      fetchCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order");
    }
  };

  if (loading) return <p className="text-center py-10">Loading cart...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500">Browse products and add them to your cart.</p>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-md p-6 divide-y">
        {cart.items.map((item) => (
          <div
            key={item.cartItemId}
            className="flex justify-between items-center py-4"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={item.product.imageUrl || "https://via.placeholder.com/80"}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-gray-500">₹{item.product.price}</p>
              </div>
            </div>

            {/* Quantity Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                className="p-2 rounded-full border hover:bg-gray-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                className="p-2 rounded-full border hover:bg-gray-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price & Remove */}
            <div className="flex items-center gap-4">
              <p className="font-semibold">₹{item.product.price * item.quantity}</p>
              <button
                onClick={() => handleRemoveItem(item.cartItemId)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Footer */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ₹{totalPrice}</p>
        <button
          onClick={handleCheckout}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
