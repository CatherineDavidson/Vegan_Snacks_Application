
import React from "react";

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl border border-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          {product.name}
        </h3>
        <div className="flex justify-center mb-6">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-48 h-48 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
        <div className="space-y-2 text-gray-700">
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Ingredients:</strong> {product.ingredients}</p>
          <p><strong>Nutrition Info:</strong> {product.nutritionInfo}</p>
          <p><strong>Allergens:</strong> {product.allergens}</p>
          <p><strong>Weight:</strong> {product.weight} g</p>
          <p><strong>Package Size:</strong> {product.packageSize}</p>
          <p><strong>Shelf Life:</strong> {product.shelfLife} days</p>
          <p><strong>Storage:</strong> {product.storageInstructions}</p>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
