import React, { useState } from "react";
import {
  ShoppingCart, ShoppingBag, X, ArrowRight, Plus, Minus
} from "lucide-react";

const CartSidebar = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  setPopup,
  onCheckout,
  setShowQuickView,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Update selectedItems if cart changes (optional, robust for deleting items)
  React.useEffect(() => {
    setSelectedItems((sel) =>
      sel.filter((id) => cartItems.some((item) => item.cartItemId === id))
    );
  }, [cartItems]);

  // ---- Logic for total/count only for selected ----
  const getTotalPrice = () =>
    cartItems
      .filter((item) => selectedItems.includes(item.cartItemId))
      .reduce(
        (sum, item) => sum + (item.product.price * item.quantity),
        0
      )
      .toFixed(2);

  const getTotalItems = () =>
    cartItems
      .filter((item) => selectedItems.includes(item.cartItemId))
      .reduce((sum, item) => sum + item.quantity, 0);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  // ---- Quantity logic ----
  const updateCartQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove from cart
      setCartItems((prev) =>
        prev.filter((ci) => ci.cartItemId !== item.cartItemId)
      );
      setSelectedItems((prev) =>
        prev.filter((id) => id !== item.cartItemId)
      );
      setPopup?.({
        message: `"${item.product.name}" removed from cart.`,
        type: "success",
      });
    } else {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.cartItemId === item.cartItemId
            ? { ...ci, quantity: newQuantity }
            : ci
        )
      );
    }
  };

  // ---- Checkout logic ----
  const handleCheckout = () => {
    if (getTotalItems() === 0) {
      setPopup?.({ message: "Select products to checkout.", type: "error" });
      return;
    }
    if (typeof onCheckout === "function") {
      onCheckout(selectedItems);
    }
    onClose();
  };

  // ---- Visual Component ----
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-30 flex">
      {/* Overlay */}
      <div
        className="flex-1 bg-gradient-to-br from-black/70 via-blue-900/30 to-emerald-900/30 backdrop-blur-md"
        onClick={onClose}
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
            onClick={onClose}
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
                  onClick={handleCheckout}
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
  );
};

export default CartSidebar;
