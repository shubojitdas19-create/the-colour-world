'use client';

import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store/cart';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    basePrice: string;
    categoryName: string;
    image: string;
  };
  className?: string;
  isMobile?: boolean;
}

export function AddToCartButton({ product, className, isMobile }: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    // These two lines force mobile browsers to respect the tap instantly
    e.preventDefault(); 
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: Number(product.basePrice),
      image: product.image,
      quantity: 1,
      categoryName: product.categoryName,
    });
  };

  return (
    <button 
      type="button"
      onClick={handleAddToCart}
      className={className || "flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground py-4 text-base font-semibold text-background shadow-xl shadow-foreground/10 transition-transform hover:scale-[1.02] active:scale-95"}
    >
      <ShoppingBag className={isMobile ? "size-4" : "size-5"} />
      Add to Cart
    </button>
  );
}