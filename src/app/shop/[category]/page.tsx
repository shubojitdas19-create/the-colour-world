import { fetchStorefront } from "@/lib/api/client";
import { CatalogUI } from "../catalog-ui";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  // Fetch products specific to this category
  const products = await fetchStorefront(`products?category=${category}`) || [];

  // Format the URL slug (e.g., "interior-emulsions") into a clean title
  const cleanTitle = category.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-background">
      
      {/* Premium Category Header - Perfectly aligned to 1700px */}
      <div className="mx-auto w-full max-w-[1700px] px-5 pt-8 md:px-10 lg:px-16 lg:pt-12">
        {/* Reduced the bottom padding here (pb-6 lg:pb-8) to tighten the space before the catalog */}
        <div className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-8">
          
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              <span className="h-px w-10 bg-terracotta" aria-hidden="true" />
              Category
            </p>
            <h1 className="mt-5 text-balance font-serif text-4xl font-medium tracking-tight capitalize text-foreground sm:text-5xl lg:text-6xl">
              {cleanTitle} <span className="italic text-terracotta">Finishes.</span>
            </h1>
          </div>
          
          <div className="max-w-sm sm:text-right">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Browse our curated selection of premium <span className="capitalize">{cleanTitle}</span> products, crafted for exceptional durability and elegance.
            </p>
          </div>
          
        </div>
      </div>

      {/* The Client Component handles filters, sorting, and displaying the grid */}
      <CatalogUI initialProducts={products} />

    </div>
  );
}