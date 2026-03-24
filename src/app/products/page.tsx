import { db } from "@/lib/db";
import { ProductGridWrapper } from "@/components/storefront/product-grid-wrapper";
import { ProductFiltersWrapper } from "@/components/storefront/product-filters-wrapper";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    search?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where: any = {
    isActive: true,
  };

  if (searchParams.category) {
    where.category = { slug: searchParams.category };
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {};
    if (searchParams.minPrice) {
      where.price.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.price.lte = parseFloat(searchParams.maxPrice);
    }
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ];
  }

  // Build sort
  let orderBy: any = { createdAt: "desc" };
  if (searchParams.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (searchParams.sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (searchParams.sort === "name") {
    orderBy = { name: "asc" };
  } else if (searchParams.sort === "popular") {
    orderBy = { reviews: { _count: "desc" } };
  }

  // Fetch products
  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { order: "asc" }, take: 2 },
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    db.product.count({ where }),
    db.category.findMany({
      where: { isActive: true },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-r from-violet-50 to-cyan-50 dark:from-violet-950/20 dark:to-cyan-950/20 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {searchParams.search
              ? `Search results for "${searchParams.search}"`
              : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <ProductFiltersWrapper categories={categories} />
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            <ProductGridWrapper
              products={products}
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
