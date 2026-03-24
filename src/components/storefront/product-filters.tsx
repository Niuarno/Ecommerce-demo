"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  categories: any[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
  });

  const selectedCategory = searchParams.get("category");

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory === categorySlug) {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  const hasActiveFilters = selectedCategory || searchParams.get("minPrice");

  return (
    <div className="bg-card border rounded-2xl p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            Clear all
            <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-sm">Categories</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.category && "rotate-180"
            )}
          />
        </button>
        {expandedSections.category && (
          <div className="space-y-2 pt-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.slug}
                  checked={selectedCategory === category.slug}
                  onCheckedChange={() => handleCategoryChange(category.slug)}
                />
                <Label
                  htmlFor={category.slug}
                  className="text-sm cursor-pointer flex-1 flex justify-between"
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">
                    ({category._count?.products || 0})
                  </span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Price Range */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-sm">Price Range</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.price && "rotate-180"
            )}
          />
        </button>
        {expandedSections.price && (
          <div className="pt-4 px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              step={10}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={applyPriceFilter}
            >
              Apply
            </Button>
          </div>
        )}
      </div>

      <Separator className="my-4" />

      {/* Rating */}
      <div>
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-sm">Rating</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expandedSections.rating && "rotate-180"
            )}
          />
        </button>
        {expandedSections.rating && (
          <div className="space-y-2 pt-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
