"use client"

import React, { useState } from 'react';
import { Heart, Share2, Star, ChevronRight } from 'lucide-react';
import { featuredProducts } from '@/app/data/featuredProduct';
import Button from '@/app/components/Button';

export default function ProductPage() {
    const [selectedProductId, setSelectedProductId] = useState('1');
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const product = featuredProducts.find(p => p._id === selectedProductId);
    const discount = Math.round(((product.price - product.offerPrice) / product.price) * 100);

    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="border-b border-border bg-bg-secondary py-4">
                <div className="mx-auto flex max-w-350 items-center gap-2 px-5 text-sm text-text-secondary">
                    <span className="cursor-pointer">Home</span>
                    <ChevronRight size={16} />
                    <span className="cursor-pointer">{product.category}</span>
                    <ChevronRight size={16} />
                    <span className="text-text-primary">{product.name}</span>
                </div>
            </div>

            <div className="mx-auto max-w-350 p-5">
                <div className="grid grid-cols-[650px_1fr] gap-10">
                    <div className="sticky top-5 h-fit">
                        <div className="mb-3 flex gap-3">
                            <div className="flex flex-col gap-3">
                                {product.images.map((image, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`h-18 w-18 cursor-pointer overflow-hidden rounded-lg bg-bg-secondary
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

                            <div className="relative flex-1 overflow-hidden rounded-lg border border-border bg-bg-secondary">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="h-145 w-full object-cover"
                                />

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

                    <div>
                        <div className="mb-2 text-sm text-text-secondary">
                            Category:{" "}
                            <span className="cursor-pointer font-medium text-primary">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="mb-3 text-2xl font-medium leading-snug text-text-primary">
                            {product.name}
                        </h1>

                        <div className="mb-4 flex items-center gap-4 border-b border-border py-3">
                            <div className="flex items-center gap-1 rounded-full bg-success-bg px-3 py-1">
                                <span className="font-semibold text-success">
                                    {product.rating}
                                </span>
                                <Star size={14} className="text-success" />
                            </div>
                            <span className="text-sm text-text-secondary">
                                {product.reviews.toLocaleString()} Ratings & Reviews
                            </span>
                        </div>

                        <div className="mb-5">
                            <div className="mb-2 flex items-baseline gap-3">
                                <span className="text-3xl font-semibold text-text-primary">
                                    ${product.offerPrice}
                                </span>
                                <span className="text-lg line-through text-text-secondary">
                                    ${product.price}
                                </span>
                                <span className="font-semibold text-success">
                                    {discount}% off
                                </span>
                            </div>
                            <p className="text-xs text-text-secondary">
                                + Free Shipping on orders over $25
                            </p>
                        </div>

                        <div
                            className={`mb-6 inline-block rounded-lg px-4 py-2 text-sm font-medium
              ${product.inStock
                                    ? "border border-success bg-success-bg text-success"
                                    : "border border-error bg-error-bg text-error"
                                }`}
                        >
                            {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                        </div>

                        <div className="mb-6">
                            <div className="mb-3 font-semibold text-text-primary">
                                Quantity
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={()=>setQuantity(prev => (prev > 1 ? prev - 1 : 1))} className="cursor-pointer h-10 w-10 rounded-lg border border-border bg-bg-secondary text-primary text-xl font-semibold">
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    className="h-10 w-20 rounded-lg border border-border bg-bg-secondary text-center text-text-primary"
                                />
                                <button onClick={()=>setQuantity(prev=>prev+1)} className="cursor-pointer h-10 w-10 rounded-lg border border-border bg-bg-secondary text-primary text-xl font-semibold">
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 rounded-lg border border-border bg-bg-secondary p-4">
                            <div className="mb-3 text-base font-semibold text-text-primary">
                                Product Details
                            </div>
                            {product.description.map((desc, i) => (
                                <div
                                    key={i}
                                    className="relative mb-2 pl-3 text-sm text-text-secondary"
                                >
                                    <span className="absolute left-0 text-primary">•</span>
                                    {desc}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                text="ADD TO CART"
                                className="flex-1 bg-warning text-bg-primary hover:opacity-90"
                            />
                            <Button
                                text="BUY NOW"
                                className="flex-1 bg-error text-white hover:opacity-90"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}