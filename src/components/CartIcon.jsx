import React, { useEffect, useState } from "react";
import { getCart } from "../api/cartApi";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        setCartCount(response.data.items.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {cartCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
