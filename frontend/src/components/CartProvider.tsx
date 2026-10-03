"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "zarrin-cart";

type CartItemInput = Omit<CartLine, "quantity">;

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  count: number;
  total: number;
  add: (item: CartItemInput, quantity?: number) => void;
  setQty: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((item: CartItemInput, quantity = 1) => {
    if (item.stock <= 0 || quantity <= 0) return;
    setLines((current) => {
      const existing = current.find((line) => line.productId === item.productId);
      if (!existing) {
        return [...current, { ...item, quantity: Math.min(quantity, item.stock) }];
      }
      return current.map((line) =>
        line.productId === item.productId
          ? { ...line, ...item, quantity: Math.min(line.quantity + quantity, item.stock) }
          : line,
      );
    });
  }, []);

  const setQty = useCallback((productId: number, quantity: number) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.productId !== productId) return [line];
        if (quantity <= 0) return [];
        return [{ ...line, quantity: Math.min(quantity, line.stock) }];
      }),
    );
  }, []);

  const remove = useCallback((productId: number) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    return { lines, ready, count, total, add, setQty, remove, clear };
  }, [lines, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
