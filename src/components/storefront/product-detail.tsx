"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/helpers";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductDetailProps {
  product: any;
  avgRating: number;
}

export function ProductDetail({ product, avgRating }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { addItem, items } = useCartStore();

  const mainImage = product.images[selectedImage]?.url || "/placeholder-product.png";

  // Parse variant options
  const variantOptions: Record<string, string[]> = {};
  product.variants?.forEach((v: any) => {
    if (v.options) {
      const options = JSON.parse(v.options);
      Object.entries(options).forEach(([key, value]) => {
        if (!variantOptions[key]) {
          variantOptions[key] = [];
        }
        if (!variantOptions[key].includes(value as string)) {
          variantOptions[key].push(value as string);
        }
      });
    }
  });

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const isInCart = items.some((item) => item.productId === product.id);

  const handleAddToCart = () => {
    // Check if all variants are selected
    const requiredVariants = Object.keys(variantOptions);
    const selectedCount = Object.keys(selectedVariants).length;

    if (requiredVariants.length > 0 && selectedCount < requiredVariants.length) {
      toast.error("Please select all options");
      return;
    }

    // Find matching variant for price
    let variantPrice = product.price;
    let matchedVariant = null;

    if (product.variants?.length > 0) {
      matchedVariant = product.variants.find((v: any) => {
        if (!v.options) return false;
        const options = JSON.parse(v.options);
        return Object.entries(selectedVariants).every(
          ([key, value]) => options[key] === value
        );
      });

      if (matchedVariant) {
        variantPrice = matchedVariant.price || product.price;
      }
    }

    addItem({
      id: matchedVariant?.id || product.id,
      productId: product.id,
      variantId: matchedVariant?.id,
      name: product.name,
      slug: product.slug,
      price: variantPrice,
      quantity,
      image: mainImage,
      variant: matchedVariant
        ? {
            name: matchedVariant.name,
            options: selectedVariants,
          }
        : undefined,
    });

    toast.success("Added to cart!");
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image gallery */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="gradient-bg-pink border-0 text-white">
                  -{discount}%
                </Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                  Only {product.stock} left
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image: any, index: number) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground/50"
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.alt || `${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary">Products</Link>
            <span>/</span>
            <Link
              href={`/categories/${product.category?.slug}`}
              className="hover:text-primary"
            >
              {product.category?.name}
            </Link>
          </div>

          {/* Title & Rating */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(avgRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="ml-1">{avgRating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground">
                ({product._count?.reviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-muted-foreground line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Short description */}
          {product.shortDesc && (
            <p className="text-muted-foreground">{product.shortDesc}</p>
          )}

          <Separator />

          {/* Variant selection */}
          {Object.entries(variantOptions).map(([key, values]) => (
            <div key={key} className="space-y-2">
              <Label className="text-sm font-medium capitalize">{key}</Label>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={selectedVariants[key] === value ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setSelectedVariants((prev) => ({ ...prev, [key]: value }))
                    }
                    className={cn(
                      selectedVariants[key] === value && "gradient-bg"
                    )}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quantity</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gradient-bg h-12"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {isInCart ? "Add More" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12">
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Secure Payment</span>
            </div>
          </div>

          <Separator />

          {/* Product details tabs */}
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">
                Reviews ({product._count?.reviews || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {product.description}
              </div>
            </TabsContent>
            <TabsContent value="specs" className="mt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{product.weight || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="font-medium">{product.dimensions || "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{product.category?.name}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              {product.reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          by {review.user?.name || "Anonymous"}
                        </span>
                      </div>
                      {review.title && (
                        <p className="font-medium mb-1">{review.title}</p>
                      )}
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
