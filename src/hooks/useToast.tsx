import { AlertColor } from "@mui/material"
import { createContext, FC, ReactNode, useContext, useState } from "react"
import { Toast, ToastStyle } from '../components/Snackbar';

export interface ToastMessage {
  message: string
  severity: AlertColor
  autoHideDuration?: number
  key: number
}

export const ToastContext = createContext<{
  addMessage: (message: ToastMessage) => void
}>(null as never)

export const ToastProvider: FC<{ children: ReactNode } & ToastStyle> = ({
  children,
  ...props
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const removeMessage = (key: number) =>
    setMessages((arr) => arr.filter((m) => m.key !== key))

  return (
    <ToastContext.Provider
      value={{
        addMessage(message) {
          setMessages((arr) => [...arr, message])
        },
      }}
    >
      {children}
      {messages.map((m) => (
        <Toast
          key={m.key}
          message={m}
          onExited={() => removeMessage(m.key)}
          autoHideDuration={m.autoHideDuration}
          {...props}
        />
      ))}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const { addMessage } = useContext(ToastContext)

  const show = (message: string, options: { severity: AlertColor, autoHideDuration: number }) => {
    addMessage({ message, ...options, key: new Date().getTime() })
  }

  return {
    show,
    info(message: string, autoHideDuration: number) {
      show(message, { severity: "info", autoHideDuration: autoHideDuration ?? 1500})
    },
    success(message: string, autoHideDuration: number) {
      show(message, { severity: "success", autoHideDuration: autoHideDuration ?? 1500})
    },
    warning(message: string, autoHideDuration: number) {
      show(message, { severity: "warning", autoHideDuration: autoHideDuration ?? 1500})
    },
    error(message: string, autoHideDuration: number) {
      show(message, { severity: "error", autoHideDuration: autoHideDuration ?? 1500})
    },
  }
}