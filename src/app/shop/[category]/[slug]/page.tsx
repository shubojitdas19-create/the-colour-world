import { notFound } from "next/navigation"
import { fetchStorefront } from "@/lib/api/client"
import { ProductClient } from "./product-client"

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch specific product by slug directly from API
  const data = await fetchStorefront(`products?slug=${encodeURIComponent(slug)}`)
  const product = Array.isArray(data) ? data[0] : data

  if (!product) notFound()

  // Pass the raw product data to our interactive Client Component
  return <ProductClient product={product} />
}