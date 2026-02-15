import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { categories } from "../data/categories";
import Button from "./Button";
import CategoryCard from "./CategoryCard";
import { Link, useNavigate } from "react-router";

export default function GroceryCategories() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (name) => {
    navigate("/products");
  };

  return (
    <section id="products" className="bg-bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 mb-4 bg-primary-bg rounded-full border-2 border-border">
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl font-bold text-text-primary">
            Shop by Category
          </h2>

          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Discover fresh groceries and daily essentials delivered fast
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              onClick={handleCategoryClick}
            />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            text="View All Products"
            to={"/products"}
            className="px-8 bg-primary text-text-primary hover:bg-accent font-semibold py-3 rounded-lg transition-skin focus:outline-none transform hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
          >View All Products</Link>
        </div>
      </div>
    </section>
  );
}
