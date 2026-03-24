"use client";

import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface TrendingSectionProps {
  products: any[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const displayProducts = products.length > 0 ? products : [];

  if (displayProducts.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <TrendingUp className="h-4 w-4" />
                Hot right now
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Trending Products</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Empty state */}
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <p className="text-muted-foreground">No products available yet.</p>
            <Button asChild className="mt-4 gradient-bg">
              <Link href="/admin/products">Add Products (Admin)</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <TrendingUp className="h-4 w-4" />
              Hot right now
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Trending Products</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
