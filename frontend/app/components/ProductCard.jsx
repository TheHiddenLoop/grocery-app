import { Tag } from 'lucide-react';

export const ProductCard = ({ product }) => {
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

    const calculateDiscount = (price, offerPrice) => {
        return Math.round(((price - offerPrice) / price) * 100);
    };

    return (
        <div
            className={`bg-bg-secondary rounded-2xl border border-border overflow-hidden hover:border-border-dark transition-all duration-300 ${!product.inStock ? 'opacity-75' : ''
                }`}
        >
            <div className="relative h-48 overflow-hidden bg-primary-bg">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                    }}
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                        <div className={`${getBadgeColor(product.badge)} text-text-primary px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
                            {product.badge}
                        </div>
                    )}
                    <div className="bg-error text-text-primary px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                        -{calculateDiscount(product.price, product.offerPrice)}%
                    </div>
                </div>

                {!product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="bg-error text-text-primary px-4 py-2 rounded-lg font-bold shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )}

                <div className="absolute bottom-3 right-3 bg-secondary-bg border border-border px-3 py-1 rounded-full text-xs font-semibold text-text-secondary flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {product.category}
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-bold text-base text-text-primary mb-3">{product.name}</h3>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold text-success">${product.offerPrice}</span>
                    <span className="text-xs text-text-secondary line-through">${product.price}</span>
                </div>

                <button
                    disabled={!product.inStock}
                    className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm ${product.inStock
                            ? 'bg-primary hover:bg-accent text-text-primary cursor-pointer'
                            : 'bg-border text-text-secondary cursor-not-allowed'
                        }`}
                >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};