import React, { useEffect, useState } from 'react';
import { Heart, Loader2, Share2, Star } from 'lucide-react';
import Button from '../components/Button';
import Header from '../components/Header2';
import { useParams, useNavigate } from 'react-router';
import { viewProduct } from '../features/product/productSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectProductStatus, singleProduct } from '../features/product/productSelector';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const product = useSelector(singleProduct) || {};
    const loading = useSelector(selectProductStatus);
    const cartLoading = useSelector((state) => state.cart.loading);

    const discount = product.price && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;
    const { id } = useParams();

    useEffect(() => {
        dispatch(viewProduct(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
        if (!product.inStock) return;
        dispatch(addToCart(product._id));
    };

    const handleBuyNow = async () => {
        if (!product.inStock) return;
        await dispatch(addToCart(product._id));
        navigate('/cart');
    };

    if (loading === "loading" || loading === "idle") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-bg-primary font-robot">
                <Loader2 className="h-12 w-12 animate-spin text-primary" strokeWidth={2.5} />
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-bg-primary min-h-[calc(100vh-65px)]">
                <div className="mx-auto max-w-350 p-3 sm:p-8 lg:p-13">
                    <div className="grid grid-cols-1 lg:grid-cols-[650px_1fr] gap-4 sm:gap-6 lg:gap-10">
                        <div className="lg:sticky lg:top-5">
                            <div className="flex flex-col lg:flex-row gap-2 sm:gap-3">
                                <div className="flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                                    {product.image?.map((image, index) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`h-16 w-16 sm:h-18 sm:w-18 shrink-0 cursor-pointer overflow-hidden rounded-lg bg-bg-secondary
                                                ${selectedImage === index
                                                    ? "border-2 border-primary"
                                                    : "border border-border"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="relative overflow-hidden rounded-lg border border-border bg-bg-secondary">
                                    <div className="w-full h-72 sm:h-96 lg:h-135">
                                        <img
                                            src={product.image?.[selectedImage]}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {product.badge && (
                                        <div className="absolute left-3 top-3 rounded-md bg-error px-3 py-1 text-xs font-semibold text-white">
                                            {product.badge}
                                        </div>
                                    )}

                                    <div className="absolute right-3 top-3 flex gap-2">
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-primary text-text-primary">
                                            <Heart size={20} />
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-bg-primary text-text-primary">
                                            <Share2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 sm:space-y-5 pb-5">
                            <div className="text-sm text-text-secondary">
                                Category:{" "}
                                <span className="cursor-pointer font-medium text-primary">
                                    {product.category}
                                </span>
                            </div>

                            <h1 className="text-xl sm:text-2xl font-medium leading-snug text-text-primary">
                                {product.name}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 border-b border-border pb-3">
                                <div className="flex items-center gap-1 rounded-full bg-success-bg px-3 py-1">
                                    <span className="font-semibold text-success">{product.rating}</span>
                                    <Star size={14} className="text-success" />
                                </div>
                                <span className="text-sm text-text-secondary">
                                    {product.reviews?.toLocaleString()} Ratings & Reviews
                                </span>
                            </div>

                            <div>
                                <div className="mb-2 flex flex-wrap items-baseline gap-3">
                                    <span className="text-2xl sm:text-3xl font-semibold text-text-primary">
                                        ₹{product.offerPrice}
                                    </span>
                                    <span className="text-base sm:text-lg line-through text-text-secondary">
                                        ₹{product.price}
                                    </span>
                                    <span className="font-semibold text-success">{discount}% off</span>
                                </div>
                                <p className="text-xs text-text-secondary">
                                    + Free Shipping on orders over ₹500
                                </p>
                            </div>

                            <div
                                className={`inline-block rounded-lg px-4 py-2 text-sm font-medium
                                ${product.inStock
                                    ? "border border-success bg-success-bg text-success"
                                    : "border border-error bg-error-bg text-error"
                                }`}
                            >
                                {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                            </div>

                            <div>
                                <div className="mb-3 font-semibold text-text-primary">Quantity</div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                                        className="cursor-pointer h-10 w-10 rounded-lg border border-border bg-bg-secondary text-primary text-xl font-semibold"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="h-10 w-20 rounded-lg border border-border bg-bg-secondary text-center text-text-primary"
                                    />
                                    <button
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        className="cursor-pointer h-10 w-10 rounded-lg border border-border bg-bg-secondary text-primary text-xl font-semibold"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-lg border border-border bg-bg-secondary p-4">
                                <div className="mb-3 text-base font-semibold text-text-primary">
                                    Product Details
                                </div>
                                {product.description?.map((desc, i) => (
                                    <div key={i} className="relative mb-2 pl-3 text-sm text-text-secondary last:mb-0">
                                        <span className="absolute left-0 text-primary">•</span>
                                        {desc}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || cartLoading === "loading"}
                                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition
                                        ${product.inStock && cartLoading !== "loading"
                                            ? "bg-warning text-bg-primary hover:opacity-90 cursor-pointer"
                                            : "bg-border text-text-secondary cursor-not-allowed"
                                        }`}
                                >
                                    {cartLoading === "loading" ? "Adding..." : "ADD TO CART"}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock || cartLoading === "loading"}
                                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition
                                        ${product.inStock && cartLoading !== "loading"
                                            ? "bg-error text-white hover:opacity-90 cursor-pointer"
                                            : "bg-border text-text-secondary cursor-not-allowed"
                                        }`}
                                >
                                    BUY NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}