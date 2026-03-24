import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Cart Item Type
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  variant?: {
    name: string;
    options: Record<string, string>;
  };
}

// Cart Store
interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string | null) => void;
  setOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.productId === item.productId && i.variantId === item.variantId
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += item.quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, item] });
        }
      },
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        });
      },
      updateQuantity: (productId, variantId, quantity) => {
        const items = get().items.map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items });
      },
      clearCart: () => set({ items: [], couponCode: null }),
      setCoupon: (code) => set({ couponCode: code }),
      setOpen: (open) => set({ isOpen: open }),
      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "voxel-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Wishlist Store
interface WishlistStore {
  items: string[]; // Product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) => {
        const items = get().items;
        if (!items.includes(productId)) {
          set({ items: [...items, productId] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((id) => id !== productId) });
      },
      isInWishlist: (productId) => get().items.includes(productId),
    }),
    {
      name: "voxel-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// UI Store
interface UIStore {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  theme: "light" | "dark" | "system";
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      isSearchOpen: false,
      theme: "system",
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "voxel-ui",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
