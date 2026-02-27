import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export const HomeProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading);

  const discountPercentage =
    product.price !== product.offerPrice
      ? Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        )
      : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock || loading === "loading") return;
    dispatch(addToCart(product._id));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="relative flex flex-col w-full rounded-2xl overflow-hidden cursor-pointer bg-bg-secondary border border-border shadow-md transition-all duration-200 active:scale-[0.98] md:hover:-translate-y-1 md:hover:shadow-xl">
      <div className="relative w-full aspect-square overflow-hidden bg-bg-primary">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-bg-secondary" />
        )}

        <img
          src={product.image?.[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x400?text=Product";
            setImageLoaded(true);
          }}
        />

        {discountPercentage > 0 && product.inStock && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-error text-white">
            -{discountPercentage}%
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-error text-white">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg-secondary to-transparent" />
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          {product.category}
        </span>

        <h3 className="text-sm font-semibold line-clamp-2 leading-snug text-text-primary">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-bold text-text-primary">
            ₹{product.offerPrice}
          </span>
          {product.price !== product.offerPrice && (
            <span className="text-xs line-through text-text-secondary">
              ₹{product.price}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || loading === "loading"}
          className={`mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
            added
              ? "bg-success text-bg-primary"
              : product.inStock
              ? "bg-primary text-bg-primary active:scale-95"
              : "bg-bg-primary text-text-secondary cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {added
            ? "Added!"
            : loading === "loading"
            ? "Adding..."
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};