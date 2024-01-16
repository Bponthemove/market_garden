import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ClosedProviderProps = {
  children: ReactNode;
};

type ClosedContextTypes = {
  ticked: boolean;
  setTicked: Dispatch<SetStateAction<boolean>>;
};

const ClosedContext = createContext({} as ClosedContextTypes);

export function useClosedContext() {
  return useContext(ClosedContext);
}

export function ClosedProvider({ children }: ClosedProviderProps) {
  const [ticked, setTicked] = useState(true);

  return (
    <ClosedContext.Provider
      value={{
        setTicked,
        ticked,
      }}
    >
      {children}
    </ClosedContext.Provider>
  );
}
