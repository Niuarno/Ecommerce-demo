import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/product-detail";
import { RelatedProducts } from "@/components/storefront/related-products";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      variants: { where: { isActive: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  // Fetch related products
  const relatedProducts = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" }, take: 2 },
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true } },
    },
    take: 4,
  });

  // Calculate average rating
  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="min-h-screen py-8">
      <ProductDetail product={product} avgRating={avgRating} />
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
