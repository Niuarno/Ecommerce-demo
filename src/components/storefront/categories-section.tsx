"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoriesSectionProps {
  categories: any[];
}

const categoryImages: Record<string, string> = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop",
  fashion: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop",
  "home-living": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
  sports: "https://images.unsplash.com/photo-1461896836934- voices?w=400&h=400&fit=crop",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
};

const defaultColors = [
  "from-purple-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-teal-500",
  "from-violet-500 to-purple-500",
  "from-rose-500 to-pink-500",
];

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const displayCategories = categories.length > 0 ? categories : [
    { id: "1", name: "Electronics", slug: "electronics", _count: { products: 150 } },
    { id: "2", name: "Fashion", slug: "fashion", _count: { products: 230 } },
    { id: "3", name: "Home & Living", slug: "home-living", _count: { products: 180 } },
    { id: "4", name: "Sports", slug: "sports", _count: { products: 95 } },
    { id: "5", name: "Beauty", slug: "beauty", _count: { products: 120 } },
    { id: "6", name: "Accessories", slug: "accessories", _count: { products: 200 } },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-primary mb-2">Browse by</p>
          <h2 className="text-3xl md:text-4xl font-bold">Popular Categories</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayCategories.map((category, index) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <Card className="group overflow-hidden border-0 bg-transparent hover:shadow-xl transition-all duration-300">
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${defaultColors[index % defaultColors.length]} p-6 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                  {/* Decorative circle */}
                  <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-8 -right-8 group-hover:scale-150 transition-transform duration-500" />
                  
                  <div className="relative z-10 text-center">
                    <p className="text-2xl font-bold mb-1">{category.name}</p>
                    <p className="text-sm text-white/80">
                      {category._count?.products || 0} products
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
