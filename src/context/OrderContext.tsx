import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import { useSessionStorage } from "../hooks/useSessionStorage";

type OrderProviderProps = {
  children: ReactNode;
};

type OrderContextTypes = {
  orderNr: string;
  deliveryDay: string;
  setOrderNr: Dispatch<SetStateAction<string>>;
  setDeliveryDay: Dispatch<SetStateAction<string>>;
};

const OrderContext = createContext({} as OrderContextTypes);

export function useOrderContext() {
  return useContext(OrderContext);
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orderNr, setOrderNr] = useSessionStorage<string>("order", "");
  const [deliveryDay, setDeliveryDay] = useSessionStorage<string>(
    "deliveryDay",
    ""
  );

  return (
    <OrderContext.Provider
      value={{
        orderNr,
        deliveryDay,
        setOrderNr,
        setDeliveryDay,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
