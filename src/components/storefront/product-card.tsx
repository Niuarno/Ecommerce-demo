"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Eye } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/helpers";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: { url: string; alt?: string | null }[];
    category?: { name: string; slug: string };
    stock?: number;
    reviews?: { rating: number }[];
    _count?: { reviews: number };
  };
  variant?: "default" | "compact" | "horizontal";
  showQuickAdd?: boolean;
}

export function ProductCard({ product, variant = "default", showQuickAdd = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { addItem, items } = useCartStore();

  const mainImage = product.images[0]?.url || "/placeholder-product.png";
  const hoverImage = product.images[1]?.url || mainImage;
  
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const isInCart = items.some((item) => item.productId === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: mainImage,
    });
  };

  if (variant === "horizontal") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/products/${product.slug}`} className="flex gap-4 p-4">
          <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">{product.category?.name}</p>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-primary">{formatCurrency(product.price)}</span>
              {product.comparePrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden border-0 shadow-none bg-transparent",
        variant === "compact" && "scale-95"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          {/* Main image */}
          <img
            src={isHovered && product.images.length > 1 ? hoverImage : mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="gradient-bg-pink border-0 text-white text-xs">
                -{discount}%
              </Badge>
            )}
            {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
                Only {product.stock} left
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="destructive" className="text-xs">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Hover actions */}
          <div
            className={cn(
              "absolute inset-x-3 bottom-3 flex gap-2 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <Button
              size="sm"
              className="flex-1 gradient-bg text-white"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {isInCart ? "Added" : "Add"}
            </Button>
            <Button size="sm" variant="secondary" className="w-9 p-0">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="w-9 p-0">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-0 pt-4">
          {product.category && (
            <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          )}
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {avgRating > 0 && (
            <div className="flex items-center gap-1 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product._count?.reviews || product.reviews?.length || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-semibold text-lg text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
