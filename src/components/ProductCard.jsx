import React from "react";
import { addToCart } from "../api/cartApi";
import { addToWishlist } from "../api/wishlistApi";

const ProductCard = ({ product }) => {
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);
      alert("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover rounded"
      />
      <h3 className="text-lg font-bold mt-3">{product.name}</h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <p className="font-semibold mt-2">₹{product.price}</p>

      <div className="flex justify-between mt-3">
        <button
          onClick={handleAddToCart}
          className="px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Add to Cart
        </button>
        <button
          onClick={handleAddToWishlist}
          className="px-4 py-2 bg-yellow-400 text-white rounded-lg"
        >
          Wishlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
