import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: string; // The specific cart item ID (in case we add variants later)
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  categoryName: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI Actions
  openCart: () => void;
  closeCart: () => void;
  
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => {
        set((state) => {
          // Check if item is already in cart
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === newItem.productId
          );

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems, isOpen: true }; // Open cart when adding
          }

          // Add brand new item
          return { 
            items: [...state.items, { ...newItem, id: crypto.randomUUID() }],
            isOpen: true // Open cart when adding
          };
        });
      },

      removeItem: (id) => 
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        })),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'the-colour-world-cart', // Unique name for localStorage
      // Only persist the items, don't persist whether the cart UI is open/closed
      partialize: (state) => ({ items: state.items }), 
    }
  )
)