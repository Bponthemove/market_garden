import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { IGetProduct } from "../types/allTypes";

type CartProviderProps = {
  children: ReactNode;
};

export interface ICartItem extends IGetProduct {  
  quantity: number;
};

type CartContextTypes = {
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
  cartQuantity: number;
  cartTotal: number;
  cartItems: ICartItem[];
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (product: IGetProduct) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartIsOpen: boolean;
  setCartIsOpen: Dispatch<SetStateAction<boolean>>;
};

const CartContext = createContext({} as CartContextTypes);

export function useCartContext() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<ICartItem[]>(
    "shopping-cart",
    []
  );
  const [cartIsOpen, setCartIsOpen] = useState<boolean>(false);

  const cartQuantity = cartItems.reduce((a, c) => c.quantity + a, 0);

  const cartTotal = cartItems.length
    ? cartItems.reduce((a, c) => (c.price || 0) * c.quantity + a, 0)
    : 0;

  function getItemQuantity(id: string) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  console.log({cartTotal})

  function increaseCartQuantity(product: IGetProduct) {    
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === product.id) == null) {
        return [...currItems, { ...product, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: string) {
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

  function removeFromCart(id: string) {
    setCartItems((currItems) => currItems.filter((item) => item.id !== id));
  }

  function openCart() {
    setCartIsOpen(true);
  }

  function closeCart() {
    setCartIsOpen(false);
  }

  function clearCart() {
    setCartItems([]);
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
