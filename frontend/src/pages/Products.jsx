import { useState, useMemo, useEffect } from 'react';
import { Tag, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../features/product/productSlice';



const page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);  

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const badges = ['All', ...new Set(products.map(p => p.badge).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBadge = selectedBadge === 'All' || product.badge === selectedBadge;
      
      let matchesPrice = true;
      if (priceRange === 'Under $50') matchesPrice = product.offerPrice < 50;
      else if (priceRange === '$50 - $100') matchesPrice = product.offerPrice >= 50 && product.offerPrice <= 100;
      else if (priceRange === 'Over $100') matchesPrice = product.offerPrice > 100;

      return matchesSearch && matchesCategory && matchesBadge && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedBadge, priceRange, products]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBadge('All');
    setPriceRange('All');
  };

  const activeFiltersCount = [selectedCategory !== 'All', selectedBadge !== 'All', priceRange !== 'All', searchQuery !== ''].filter(Boolean).length;

  return (
    <>
    <Header />
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-text-secondary">Discover amazing deals on quality products</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-secondary-bg border border-border rounded-lg hover:border-primary transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6 p-6 bg-bg-secondary border border-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-primary-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Badge</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-4 py-2 bg-primary-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  {badges.map(badge => (
                    <option key={badge} value={badge}>{badge}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-2 bg-primary-bg border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="All">All Prices</option>
                  <option value="Under $50">Under $50</option>
                  <option value="$50 - $100">$50 - $100</option>
                  <option value="Over $100">Over $100</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 text-text-secondary">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-text-secondary mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary hover:bg-accent text-text-primary rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default page;