import { create } from 'zustand';

export type CartItem = {
  id: string;
  service_id: string;
  name: string;
  price: number;
  unit?: string | null;
};

export type CartLine = {
  item: CartItem;
  quantity: number;
};

type CartState = {
  items: Record<string, CartLine>;
  addItem: (item: CartItem, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementItem: (item: CartItem) => void;
  decrementItem: (itemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: {},

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existing = state.items[item.id];
      const nextQuantity = (existing?.quantity ?? 0) + quantity;

      return {
        items: {
          ...state.items,
          [item.id]: {
            item,
            quantity: nextQuantity,
          },
        },
      };
    });
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        const { [itemId]: removed, ...remaining } = state.items;
        return { items: remaining };
      }

      const existing = state.items[itemId];
      if (!existing) {
        return state;
      }

      return {
        items: {
          ...state.items,
          [itemId]: {
            ...existing,
            quantity,
          },
        },
      };
    });
  },

  incrementItem: (item) => {
    set((state) => {
      const existing = state.items[item.id];
      return {
        items: {
          ...state.items,
          [item.id]: {
            item,
            quantity: (existing?.quantity ?? 0) + 1,
          },
        },
      };
    });
  },

  decrementItem: (itemId) => {
    set((state) => {
      const existing = state.items[itemId];
      if (!existing) {
        return state;
      }

      const nextQuantity = existing.quantity - 1;
      if (nextQuantity <= 0) {
        const { [itemId]: removed, ...remaining } = state.items;
        return { items: remaining };
      }

      return {
        items: {
          ...state.items,
          [itemId]: {
            ...existing,
            quantity: nextQuantity,
          },
        },
      };
    });
  },

  clearCart: () => set({ items: {} }),
}));
