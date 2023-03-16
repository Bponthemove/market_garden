import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { products } from "../constants/products";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IProduct } from "../types/IProduct";

type CartProviderProps = {
  children: ReactNode;
};

export type ICartItem = {
  id: number;
  quantity: number;
};

type CartContextTypes = {
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  cartQuantity: number;
  cartTotal: number;
  cartItems: ICartItem[];
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartIsOpen: boolean;
  setCartIsOpen: Dispatch<SetStateAction<boolean>>
};

const CartContext = createContext({} as CartContextTypes);

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<ICartItem[]>('shopping-cart', []);
  const [cartIsOpen, setCartIsOpen] = useState<boolean>(false);

  const cartQuantity = cartItems.reduce(
    (a, c) => c.quantity + a,
    0
  );

  const cartTotal = cartItems.reduce(
    (a, c) => (products.find((itemToFind: IProduct) => itemToFind.id === c.id)?.price ?? 0) * c.quantity + a, 0
  )

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  }

  function openCart() {
    setCartIsOpen(true);
  }

  function closeCart() {
    setCartIsOpen(false);
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <CartContext.Provider
      value={{
        removeFromCart,
        decreaseCartQuantity,
        increaseCartQuantity,
        getItemQuantity,
        closeCart,
        openCart,
        cartItems, 
        cartQuantity,
        cartTotal,
        cartIsOpen,
        setCartIsOpen,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
