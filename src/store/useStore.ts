import { create } from 'zustand';
import { Product, User, CartItem } from '@/types';

interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

interface StoreState {
  cart: {
    items: CartItem[];
    addItem: (product: Product, quantity?: number, size?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
  };
  user: {
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
  };
  wishlist: {
    items: WishlistItem[];
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
  };
  ui: {
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    isAuthOpen: boolean;
    setAuthOpen: (isOpen: boolean) => void;
    isSearchOpen: boolean;
    setSearchOpen: (isOpen: boolean) => void;
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
    cursorVariant: string;
    setCursorVariant: (variant: string) => void;
  };
  search: {
    query: string;
    setQuery: (query: string) => void;
    results: Product[];
    setResults: (results: Product[]) => void;
  };
}

export const useStore = create<StoreState>((set, get) => ({
  cart: {
    items: [],
    addItem: (product, quantity = 1, size = product.sizes?.[0] || '50ml') => {
      set((state) => {
        const existingItem = state.cart.items.find(
          (item) => item.productId === product.id && item.size === size
        );

        if (existingItem) {
          return {
            cart: {
              ...state.cart,
              items: state.cart.items.map((item) =>
                item.productId === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            },
          };
        }

        return {
          cart: {
            ...state.cart,
            items: [
              ...state.cart.items,
              {
                id: `${product.id}-${size}-${Date.now()}`,
                productId: product.id,
                product,
                quantity,
                size,
              },
            ],
          },
        };
      });
    },
    removeItem: (productId) => {
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.productId !== productId),
        },
      }));
    },
    updateQuantity: (productId, quantity) => {
      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        },
      }));
    },
    clearCart: () => {
      set((state) => ({
        cart: { ...state.cart, items: [] },
      }));
    },
    getTotal: () => {
      const { items } = get().cart;
      return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    },
    getItemCount: () => {
      const { items } = get().cart;
      return items.reduce((count, item) => count + item.quantity, 0);
    },
  },

  user: {
    user: null,
    login: (user, token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
      }
      set((state) => ({
        user: { ...state.user, user },
      }));
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      set((state) => ({
        user: { ...state.user, user: null },
        cart: { ...state.cart, items: [] },
      }));
    },
    setUser: (user) => {
      set((state) => ({
        user: { ...state.user, user },
      }));
    },
  },

  wishlist: {
    items: [],
    toggleWishlist: (product) => {
      set((state) => {
        const exists = state.wishlist.items.some((item) => item.id === product.id);
        if (exists) {
          return {
            wishlist: {
              ...state.wishlist,
              items: state.wishlist.items.filter((item) => item.id !== product.id),
            },
          };
        }
        return {
          wishlist: {
            ...state.wishlist,
            items: [
              ...state.wishlist.items,
              { id: product.id, product, addedAt: new Date() },
            ],
          },
        };
      });
    },
    isInWishlist: (productId) => {
      const { items } = get().wishlist;
      return items.some((item) => item.id === productId);
    },
  },

  ui: {
    isCartOpen: false,
    setCartOpen: (isOpen) => {
      set((state) => ({
        ui: { ...state.ui, isCartOpen: isOpen },
      }));
    },
    isAuthOpen: false,
    setAuthOpen: (isOpen) => {
      set((state) => ({
        ui: { ...state.ui, isAuthOpen: isOpen },
      }));
    },
    isSearchOpen: false,
    setSearchOpen: (isOpen) => {
      set((state) => ({
        ui: { ...state.ui, isSearchOpen: isOpen },
      }));
    },
    isMenuOpen: false,
    setMenuOpen: (isOpen) => {
      set((state) => ({
        ui: { ...state.ui, isMenuOpen: isOpen },
      }));
    },
    cursorVariant: 'default',
    setCursorVariant: (variant) => {
      set((state) => ({
        ui: { ...state.ui, cursorVariant: variant },
      }));
    },
  },

  search: {
    query: '',
    setQuery: (query) => {
      set((state) => ({
        search: { ...state.search, query },
      }));
    },
    results: [],
    setResults: (results) => {
      set((state) => ({
        search: { ...state.search, results },
      }));
    },
  },
}));
