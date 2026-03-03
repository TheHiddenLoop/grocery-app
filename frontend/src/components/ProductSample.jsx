import { useState } from 'react';
import { useSelector } from 'react-redux';
import { HomeProductCard } from './HomeCard';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export default function TopDeals() {
  const products = useSelector((state) => state.product.products);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = activeCategory === 'All'
    ? products.slice(0, 8)
    : products.filter((p) => p.category === activeCategory).slice(0, 8);

  return (
    <section id="deals" className="min-h-screen bg-bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-3">Featured Deals</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">Handpicked fresh products just for you</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-bg-primary border-primary'
                  : 'bg-transparent text-text-secondary border-border hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <HomeProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-text-secondary">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try selecting a different category</p>
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-bg-primary font-semibold hover:opacity-90 transition-all active:scale-95"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}