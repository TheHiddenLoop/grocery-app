import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { useNavigate } from 'react-router';

export const ProductCard = ({ product, onAddToCart, onBuyNow, onToggleFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nevigate =useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.inStock) onAddToCart?.(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (product.inStock) onBuyNow?.(product);
    nevigate(`/product/${product._id}`)
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite((v) => !v);
    onToggleFavorite?.(product);
  };

  const discountPercentage = product.price !== product.offerPrice 
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-bg-secondary rounded-3xl overflow-hidden border border-border hover:shadow-xl transition max-w-sm flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-primary-bg">
        {!imageLoaded && <div className="absolute inset-0 bg-border animate-pulse" />}

        <img
          src={product.image?.[currentImageIndex]}
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

        {discountPercentage > 0 && product.inStock && (
          <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-text-primary shadow bg-[#FF6B6B]">
            -{discountPercentage}% OFF
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

        {product.image?.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
            {product.image.map((_, i) => (
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

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <span className="inline-block bg-border text-text-secondary px-3 py-1 rounded-full text-xs font-semibold uppercase">
            {product.category}
          </span>
        </div>

        <h3 className="font-bold text-base text-text-primary line-clamp-2 mb-3">
          {product.name}
        </h3>

        {product.inStock && (
          <p className="text-xs text-success font-medium mb-4">
            {product.stock} {product.unit}s available
          </p>
        )}

        <div className="flex-1"></div>

        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div className="flex flex-col">
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
            <span className="text-xs text-text-secondary">per {product.unit}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={!product.inStock}
              onClick={handleAddToCart}
              className={`p-2.5 rounded-lg border transition cursor-pointer ${
                product.inStock
                  ? 'border-border bg-secondary-bg hover:bg-border'
                  : 'bg-border cursor-not-allowed'
              }`}
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>

            <button
              disabled={!product.inStock}
              onClick={handleBuyNow}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
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