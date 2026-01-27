import { featuredProducts } from '../data/featuredProduct';
import { ProductCard } from './ProductCard';



export default function FeaturedSection() {
  

  return (
    <div className="min-h-screen bg-bg-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">Featured Deals</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">Handpicked fresh products just for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}