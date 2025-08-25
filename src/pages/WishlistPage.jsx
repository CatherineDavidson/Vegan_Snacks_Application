import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist, moveToCart } from "../api/wishlistApi";
import { Trash2, ShoppingCart } from "lucide-react";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await getWishlist();
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistItemId) => {
    try {
      await removeFromWishlist(wishlistItemId);
      fetchWishlist();
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  const handleMoveToCart = async (wishlistItemId) => {
    try {
      await moveToCart(wishlistItemId);
      fetchWishlist();
      alert("Item moved to cart!");
    } catch (error) {
      console.error("Error moving item to cart:", error);
    }
  };

  if (loading) return <p className="text-center py-10">Loading wishlist...</p>;

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-500">Browse products and save your favorites here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Wishlist</h1>

      <div className="bg-white rounded-xl shadow-md p-6 divide-y">
        {wishlist.map((item) => (
          <div
            key={item.wishlistItemId}
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

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleMoveToCart(item.wishlistItemId)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                <ShoppingCart className="w-4 h-4" />
                Move to Cart
              </button>
              <button
                onClick={() => handleRemove(item.wishlistItemId)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
