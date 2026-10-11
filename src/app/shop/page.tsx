import { fetchStorefront } from "@/lib/api/client";
import { CatalogUI } from "./catalog-ui";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  // 1. Your original API logic remains exactly as is
  const products = await fetchStorefront("products") || [];

  return (
    <div className="min-h-screen bg-background">
      
      {/* Premium Page Header - Perfectly aligned to 1700px */}
      <div className="mx-auto w-full max-w-[1700px] px-5 pt-8 md:px-10 lg:px-16 lg:pt-12">
        <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between lg:pb-12">
          
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Our Collection
            </p>
            <h1 className="mt-5 text-balance font-serif text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              The Colour <span className="italic text-terracotta">Catalog.</span>
            </h1>
          </div>
          
          <div className="max-w-sm sm:text-right">
            <p className="text-pretty leading-relaxed text-muted-foreground">
              Explore our complete collection of premium emulsions, weatherproof coatings, and designer textures.
            </p>
          </div>
          
        </div>
      </div>

      {/* 
        The Client Component handles filters, sorting, and displaying the grid.
        It already contains its own max-w-[1700px] wrapper from our previous upgrade.
      */}
      <CatalogUI initialProducts={products} />
      
    </div>
  );
}