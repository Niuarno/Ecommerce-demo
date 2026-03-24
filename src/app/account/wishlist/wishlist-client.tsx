"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/helpers";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useState } from "react";

interface WishlistClientProps {
  wishlist: any[];
}

export function WishlistClient({ wishlist: initialWishlist }: WishlistClientProps) {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const { addItem, items } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || "/placeholder.png",
    });
    toast.success("Added to cart!");
  };

  const handleRemove = async (productId: string) => {
    try {
      const response = await fetch(`/api/user/wishlist/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      setWishlist(wishlist.filter((w) => w.productId !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const isInCart = (productId: string) => items.some((item) => item.productId === productId);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by clicking the heart icon on product pages.
            </p>
            <Button asChild className="gradient-bg">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((item) => {
            const product = item.product;
            const discount = product.comparePrice
              ? Math.round(
                  ((product.comparePrice - product.price) / product.comparePrice) * 100
                )
              : 0;

            return (
              <Card key={item.id} className="group overflow-hidden">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={product.images[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-3 left-3 gradient-bg-pink border-0 text-white">
                        -{discount}%
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(product.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product.slug}`}>
                    <p className="text-xs text-muted-foreground mb-1">
                      {product.category?.name}
                    </p>
                    <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-semibold text-primary">
                        {formatCurrency(product.price)}
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {formatCurrency(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-3 gradient-bg"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(product.id) ? "In Cart" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
