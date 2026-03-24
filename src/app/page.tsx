import { db } from "@/lib/db";
import { HeroSection } from "@/components/storefront/hero-section";
import { FeaturedProducts } from "@/components/storefront/featured-products";
import { CategoriesSection } from "@/components/storefront/categories-section";
import { FeaturesSection } from "@/components/storefront/features-section";
import { NewsletterSection } from "@/components/storefront/newsletter-section";
import { TrendingSection } from "@/components/storefront/trending-section";

export default async function HomePage() {
  // Fetch featured products
  const featuredProducts = await db.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
        take: 2,
      },
      reviews: {
        select: { rating: true },
      },
    },
    take: 8,
  });

  // Fetch all products for trending
  const trendingProducts = await db.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      images: {
        orderBy: { order: "asc" },
        take: 2,
      },
      reviews: {
        select: { rating: true },
      },
      _count: {
        select: { reviews: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  // Fetch categories
  const categories = await db.category.findMany({
    where: {
      isActive: true,
      parentId: null,
    },
    include: {
      children: true,
      _count: {
        select: { products: true },
      },
    },
    take: 6,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Bar */}
      <FeaturesSection />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Categories */}
      <CategoriesSection categories={categories} />

      {/* Trending Products */}
      <TrendingSection products={trendingProducts} />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
