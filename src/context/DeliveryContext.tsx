import { createContext, ReactNode, useContext, useState } from "react";
import { TCheckOut } from "../pages/checkOut";

type DeliveryProviderProps = {
  children: ReactNode;
};

type DeliveryContextTypes = {
  updateDetails: (item) => void;
  clearDetails: () => void;
  deliveryDetails: Partial<TCheckOut>;
};

const DeliveryContext = createContext({} as DeliveryContextTypes);

export function useDeliveryContext() {
  return useContext(DeliveryContext);
}

export function DeliveryProvider({ children }: DeliveryProviderProps) {
  // const [deliveryDetails, setDeliveryDetails] = useLocalStorage<TCheckOut | {}>(
  //   "delivery-details",
  //   {}
  // );

  const [deliveryDetails, setDeliveryDetails] = useState<TCheckOut | {}>({});

  function updateDetails(item) {
    setDeliveryDetails({
      ...deliveryDetails,
      ...item,
    });
  }

  function clearDetails() {
    setDeliveryDetails({});
  }

  return (
    <DeliveryContext.Provider
      value={{
        deliveryDetails,
        updateDetails,
        clearDetails,
      }}
    >
      {children}
    </DeliveryContext.Provider>
  );
}
