import { useState, useEffect } from "react";

export function useSessionStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {

    const jsonValue = sessionStorage.getItem(key);
    
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof initialValue === 'function') {
      return (initialValue as () => T)() 
    } else {
      return initialValue;
    }
  })

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as [typeof value, typeof setValue];
};