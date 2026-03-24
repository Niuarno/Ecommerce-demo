"use client";

import { Suspense } from "react";
import { ProductFilters } from "./product-filters";
import { Loader2 } from "lucide-react";

interface ProductFiltersWrapperProps {
  categories: any[];
}

function ProductFiltersLoading() {
  return (
    <div className="bg-card border rounded-2xl p-4 flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

export function ProductFiltersWrapper({ categories }: ProductFiltersWrapperProps) {
  return (
    <Suspense fallback={<ProductFiltersLoading />}>
      <ProductFilters categories={categories} />
    </Suspense>
  );
}
