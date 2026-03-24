"use client";

import { Suspense } from "react";
import { ProductGrid } from "./product-grid";
import { Loader2 } from "lucide-react";

interface ProductGridWrapperProps {
  products: any[];
  currentPage: number;
  totalPages: number;
}

function ProductGridLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function ProductGridWrapper({ products, currentPage, totalPages }: ProductGridWrapperProps) {
  return (
    <Suspense fallback={<ProductGridLoading />}>
      <ProductGrid products={products} currentPage={currentPage} totalPages={totalPages} />
    </Suspense>
  );
}
