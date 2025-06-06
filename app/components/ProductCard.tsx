"use client";

import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { formatPrice } from "../lib/formatters";
import { usePathname } from "next/navigation";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        originalPrice?: number;
        image: string;
        category: string;
        slug?: string;
        stockQuantity?: number;
    };
    hideAddToCart?: boolean;
}

export default function ProductCard({ product, hideAddToCart = false }: ProductCardProps) {
    const isOnSale = product.originalPrice && product.originalPrice > product.price;
    const slug = product.slug || product.id;
    const productUrl = `/products/${slug}`;
    const pathname = usePathname();


    const showAddToCartButton = pathname.includes('/products/') && !hideAddToCart;

    const stockStatus = () => {
        const stock = product.stockQuantity;

        if (stock === undefined) return null;
        if (stock <= 0) return <span className="text-xs text-destructive font-medium">Out of stock</span>;
        if (stock <= 5) return <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">Low stock: {stock} left</span>;
        return <span className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">In stock: {stock}</span>;
    };

    return (
        <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md">
            {/* Product image - reduced height on mobile */}
            <Link href={productUrl} className="relative block h-48 sm:h-64 overflow-hidden bg-secondary">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />

                {/* Sale badge */}
                {isOnSale && (
                    <div className="absolute left-0 top-4 bg-destructive text-destructive-foreground text-xs font-medium px-3 py-1 rounded-r-md shadow-sm flex items-center gap-1">
                        <Tag size={14} />
                        Sale
                    </div>
                )}
            </Link>

            {/* Product info - reduced padding on mobile */}
            <div className="p-2 sm:p-4">
                <Link href={productUrl} className="block">
                    <h3 className="mb-1 font-medium text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                    {product.category}
                </p>

                {/* Price and stock in same row */}
                <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <div>
                        {isOnSale ? (
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm sm:text-base">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice as number)}
                                </span>
                            </div>
                        ) : (
                            <span className="font-medium text-sm sm:text-base">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>

                    {/* Stock status */}
                    <div>
                        {stockStatus()}
                    </div>
                </div>

                {/* Add to cart button in its own row if visible */}
                {showAddToCartButton && (
                    <div className="flex justify-end">
                        <AddToCartButton
                            product={product}
                            variant="subtle"
                            size="sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
} 