import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Star, Edit3, Trash2, Search, Eye } from "lucide-react";
import PopUp from "./PopUp";
import ProductDetailsModal from "./ProductDetailsModal";

const VendorProduct = ({ vendor }) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  // filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // wizard
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    ingredients: "",
    nutritionInfo: "",
    allergens: "",
    weight: "",
    packageSize: "",
    shelfLife: "",
    storageInstructions: "",
    file: null,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/category/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch vendor products
  const fetchVendorProducts = async () => {
    if (!vendor?.vendorId) return;
    try {
        const res = await axios.get(`/api/vendor/products?vendorId=${vendor.vendorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(res.data || []);

    } catch (err) {
      console.error("Error fetching products:", err);
      setShowPopup({ message: "Failed to fetch products", type: "error" });
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [vendor.vendorId]);

const filteredProducts = products.filter((p) => {
  const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesFilter = filterCategory === "all" || String(p.category.id) === filterCategory;
  return matchesSearch && matchesFilter;
});


  // Save / Update product
const handleSaveProduct = async () => {
  const missingFields = [];

  if (!newProduct.name?.trim()) missingFields.push("Product Name");
  if (!newProduct.price?.toString().trim()) missingFields.push("Price");
  if (!newProduct.stock?.toString().trim()) missingFields.push("Stock");
  if (!newProduct.description?.trim()) missingFields.push("Description");
  if (!newProduct.ingredients?.trim()) missingFields.push("Ingredients");
  if (!newProduct.nutritionInfo?.trim()) missingFields.push("Nutrition Info");
  if (!newProduct.allergens?.trim()) missingFields.push("Allergens");
  if (!newProduct.weight?.toString().trim()) missingFields.push("Weight");
  if (!newProduct.packageSize?.trim()) missingFields.push("Package Size");
  if (!newProduct.shelfLife?.toString().trim()) missingFields.push("Shelf Life");
  if (!newProduct.storageInstructions?.trim()) missingFields.push("Storage Instructions");

  // ✅ Fix here
  const categoryValid = editingProduct ? newProduct.categoryId : selectedCategory;
  if (!categoryValid) missingFields.push("Category");

  const categoryId = editingProduct ? newProduct.categoryId : selectedCategory?.id;

 const needsImage = (!editingProduct && !newProduct.file) || 
                   (editingProduct && !editingProduct.imageUrl && !newProduct.file);
  if (needsImage) missingFields.push("Product Image");
  
  if (missingFields.length > 0) {
    const message = `Please fill in the following required fields: ${missingFields.join(", ")}`;
    setShowPopup({ message, type: "error" });
    return;
  }

    try {
      const formData = new FormData();
      formData.append(
        "product",
        new Blob(
          [
            JSON.stringify({
              vendorId: vendor.vendorId,
              categoryId: categoryId,
              name: newProduct.name,
              price: parseFloat(newProduct.price),
              stock: parseInt(newProduct.stock),
              description: newProduct.description,
              ingredients: newProduct.ingredients,
              nutritionInfo: newProduct.nutritionInfo,
              allergens: newProduct.allergens,
              weight: parseFloat(newProduct.weight),
              packageSize: newProduct.packageSize,
              shelfLife: parseInt(newProduct.shelfLife),
              storageInstructions: newProduct.storageInstructions,
            }),
          ],
          { type: "application/json" }
        )
      );

      if (newProduct.file) {
        formData.append("file", newProduct.file);
      }

      let res;
      if (editingProduct) {
        res = await axios.put(`/api/vendor/products/${editingProduct.productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setShowPopup({ message: "Product updated successfully!", type: "success" });
      } else {
        res = await axios.post("/api/vendor/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setShowPopup({ message: "Product created successfully!", type: "success" });
      }

      resetWizard();
      fetchVendorProducts(); // refresh product list
    } catch (err) {
      console.error("Error saving product:", err);
      setShowPopup({ message: "Failed to save product", type: "error" });
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/vendor/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowPopup({ message: "Product deleted", type: "success" });
      fetchVendorProducts();
    } catch (err) {
      console.error("Delete failed:", err);
      setShowPopup({ message: "Failed to delete product", type: "error" });
    }
  };

  const resetWizard = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
    setStep(1);
    setSelectedCategory(null);
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      description: "",
      ingredients: "",
      nutritionInfo: "",
      allergens: "",
      weight: "",
      packageSize: "",
      shelfLife: "",
      storageInstructions: "",
      file: null,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, file });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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
>
  <option value="all">All Categories</option>
  {categories.map((cat) => (
    <option key={cat.id} value={String(cat.id)}>
      {cat.name}
    </option>
  ))}
</select>


      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, idx) => (
          <div
            key={product.id || `product-${idx}`}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg shadow"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">{product.name}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{product.name}</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-400 mr-1" />
                  <span className="font-medium">{product.rating || "No rating"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-gray-800">${product.price}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    product.status === "active"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : product.status === "out_of_stock"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {product.status?.replace("_", " ")}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-6">
                Stock:{" "}
                <span className={`font-semibold ${product.lowStock ? "text-red-600" : "text-emerald-600"}`}>
                  {product.stock} units
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setShowAddProduct(true);
                    setStep(2);
                    setSelectedCategory(categories.find((c) => c.id === product.categoryId));
                    setNewProduct({ ...product, file: null,categoryId: product.categoryId, });
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.productId)}
                  className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewingProduct(product)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wizard Modal */}
      {showAddProduct && (
       <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl border border-gray-200 
            max-h-[90vh] flex flex-col">
  <div className="p-8 overflow-y-auto">
            {step === 1 && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Select a Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {categories.map((cat, idx) => {
                    const productCount = cat.noOfProducts ?? cat.productCount ?? cat.products?.length ?? 0;
                    return (
                      <div
                        key={cat.id || `cat-${idx}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`p-4 border rounded-xl cursor-pointer hover:shadow-md transition ${
                          selectedCategory?.id === cat.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200"
                        }`}
                      >
                        <h4 className="font-bold text-gray-800">{cat.name}</h4>
                        <p className="text-sm text-gray-500">{cat.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{productCount} products</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-end gap-4">
                  <button onClick={resetWizard} className="px-4 py-2 bg-gray-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    disabled={!selectedCategory}
                    onClick={() => setStep(2)}
                    className={`px-6 py-2 rounded-xl text-white font-medium shadow-md ${
                      selectedCategory ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-2xl font-bold mb-6 text-gray-800">
                  {editingProduct ? "Edit Product" : "Enter Product Details"}
                </h3>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <span className="font-semibold text-gray-800">{selectedCategory?.name}</span>
                  </div>

                  {/* Product Image */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Show existing image if editing and no new file selected */}
                    {editingProduct?.imageUrl && !newProduct.file ? (
                      <div className="flex flex-col items-center space-y-3">
                        <img
                          src={editingProduct.imageUrl}
                          alt={editingProduct.name}
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <div className="text-sm text-gray-600">Current Image</div>
                        <label className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                          Replace Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {newProduct.file && (
                          <div className="text-sm text-green-600">
                            Selected: {newProduct.file.name}
                          </div>
                        )}
                        {editingProduct?.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setNewProduct({ ...newProduct, file: null })}
                            className="text-sm text-gray-600 hover:text-gray-800"
                          >
                            Keep current image
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  {editingProduct && 
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Category</label>
    <select
    value={newProduct.categoryId || ""}
    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
    >
    <option value="">-- Select Category --</option>
    {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
        {cat.name}
        </option>
    ))}
    </select>

</div>
}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.name?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Enter description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.description?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredients <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ingredients"
                      value={newProduct.ingredients}
                      onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.ingredients?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nutrition Info <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter nutrition info"
                      value={newProduct.nutritionInfo}
                      onChange={(e) => setNewProduct({ ...newProduct, nutritionInfo: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.nutritionInfo?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergens <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter allergens"
                      value={newProduct.allergens}
                      onChange={(e) => setNewProduct({ ...newProduct, allergens: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.allergens?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (grams) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter weight"
                      value={newProduct.weight}
                      onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.weight?.toString().trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter package size"
                      value={newProduct.packageSize}
                      onChange={(e) => setNewProduct({ ...newProduct, packageSize: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.packageSize?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shelf Life (days) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter shelf life"
                      value={newProduct.shelfLife}
                      onChange={(e) => setNewProduct({ ...newProduct, shelfLife: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.shelfLife?.toString().trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Storage Instructions <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter storage instructions"
                      value={newProduct.storageInstructions}
                      onChange={(e) => setNewProduct({ ...newProduct, storageInstructions: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        !newProduct.storageInstructions?.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          !newProduct.price?.toString().trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter stock quantity"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          !newProduct.stock?.toString().trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={resetWizard} className="px-4 py-2 bg-gray-100 rounded-xl">
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-6 py-2 rounded-xl text-white font-medium shadow-md bg-emerald-600 hover:bg-emerald-700"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </>
            )}
          </div>
          </div>
        </div>
      )}

      {viewingProduct && (
        <ProductDetailsModal product={viewingProduct} onClose={() => setViewingProduct(null)} />
      )}

      {showPopup && (
        <PopUp
          message={showPopup.message}
          type={showPopup.type}
          onClose={() => setShowPopup(null)}
        />
      )}
    </div>
  );
};

export default VendorProduct;