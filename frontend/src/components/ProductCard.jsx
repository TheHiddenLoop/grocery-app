import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { useState } from 'react';

export const ProductCard = ({ product, onAddToCart, onBuyNow, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Best Seller': return 'bg-[#FFB84D]';
      case 'Trending': return 'bg-[#FF6B6B]';
      case 'Fresh': return 'bg-[#4FD1A8]';
      case 'New': return 'bg-[#5FB3E8]';
      case 'Premium': return 'bg-[#6BB8E8]';
      default: return 'bg-[#2A4052]';
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.inStock) onAddToCart?.(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (product.inStock) onBuyNow?.(product);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((v) => !v);
    onToggleFavorite?.(product);
  };

  return (
    <div className="group bg-bg-secondary rounded-3xl overflow-hidden border border-border hover:shadow-xl transition max-w-sm">
      <div className="relative aspect-square overflow-hidden bg-primary-bg">
        {!imageLoaded && <div className="absolute inset-0 bg-border animate-pulse" />}

        <img
          src={product.images?.[currentImageIndex]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Product';
            setImageLoaded(true);
          }}
        />

        {product.badge && (
          <span
            className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-text-primary shadow ${getBadgeColor(
              product.badge
            )}`}
          >
            {product.badge}
          </span>
        )}

        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 right-4 bg-bg-secondary/90 p-2.5 rounded-full border border-border opacity-0 group-hover:opacity-100 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-error text-error' : 'text-text-secondary'
            }`}
          />
        </button>

        {product.images?.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(i);
                  setImageLoaded(false);
                }}
                className={`h-2 rounded-full transition ${
                  i === currentImageIndex ? 'w-5 bg-text-primary' : 'w-2 bg-text-primary/40'
                }`}
              />
            ))}
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-error text-text-primary px-5 py-2 rounded-xl font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="font-bold text-base text-text-primary line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-text-secondary">{product.category}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-primary">
              ₹{product.offerPrice}
            </span>
            {product.price !== product.offerPrice && (
              <span className="text-sm line-through text-text-secondary">
                ₹{product.price}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className={`p-2.5 rounded-lg border transition ${
                product.inStock
                  ? 'border-border bg-secondary-bg hover:bg-border'
                  : 'bg-border cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                product.inStock
                  ? 'bg-success hover:bg-success/90 text-text-primary'
                  : 'bg-border text-text-secondary cursor-not-allowed'
              }`}
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
