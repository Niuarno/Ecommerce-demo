"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, X } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface ProductFiltersProps {
  categories: any[]
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [expandedSections, setExpandedSections] = useState({ category: true })

  const selectedCategory = searchParams.get("category")

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (selectedCategory === categorySlug) {
      params.delete("category")
    } else {
      params.set("category", categorySlug)
    }
    params.delete("page")
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasActiveFilters = selectedCategory

  return (
    <div className="bg-card border rounded-2xl p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            Clear all <X className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>

      <div className="mb-4">
        <button onClick={() => setExpandedSections((prev) => ({ ...prev, category: !prev.category }))} className="flex items-center justify-between w-full py-2">
          <span className="font-medium text-sm">Categories</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", expandedSections.category && "rotate-180")} />
        </button>
        {expandedSections.category && (
          <div className="space-y-2 pt-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={category.slug} checked={selectedCategory === category.slug} onCheckedChange={() => handleCategoryChange(category.slug)} />
                <Label htmlFor={category.slug} className="text-sm cursor-pointer flex-1 flex justify-between">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">({category._count?.products || 0})</span>
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator className="my-4" />
    </div>
  )
}
