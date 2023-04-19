import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

type OrderProviderProps = {
  children: ReactNode;
};

type OrderContextTypes = {
  orderNr: string,
  setOrderNr: Dispatch<SetStateAction<string>>
}


const OrderContext = createContext({} as OrderContextTypes);

export function useOrderContext() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orderNr, setOrderNr] = useLocalStorage<string>(
    "order",
    ''
  );

  return (
    <OrderContext.Provider
      value={{
        orderNr,
        setOrderNr
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
