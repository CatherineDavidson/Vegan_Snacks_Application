import React, { useState } from "react";
import { addToWishlist, removeFromWishlist } from "../api/wishlistApi";
import { Heart } from "lucide-react";

const WishlistButton = ({ productId, isInWishlist = false }) => {
  const [inWishlist, setInWishlist] = useState(isInWishlist);

  const toggleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
        setInWishlist(false);
      } else {
        await addToWishlist(productId);
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full transition ${
        inWishlist ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-600"
      }`}
    >
      <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-500" : ""}`} />
    </button>
  );
};

export default WishlistButton;
