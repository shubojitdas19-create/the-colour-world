import { notFound } from "next/navigation"
import { fetchStorefront } from "@/lib/api/client"
import { ProductClient } from "./product-client"

export const dynamic = 'force-dynamic';

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch products and find the matched slug
  const products = await fetchStorefront("products") || []
  const product = products.find((p: any) => p.slug === slug)

  if (!product) notFound()

  // Pass the raw product data to our interactive Client Component
  return <ProductClient product={product} />
}