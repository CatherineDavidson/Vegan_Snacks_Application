import React, { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-10 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <p className="text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
