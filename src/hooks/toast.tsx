import React from "react";
import ShowToast from "../components/Toast";
import { v4 } from "uuid";
export interface ToastMessageProps {
  id?: string;
  message: string;
  title: string;
  click?: () => void;
}
interface ToastContextData {
  addToast(data: ToastMessageProps): void;
  removeToast(id: any): void;
}
const ToastContext = React.createContext<ToastContextData>(
  {} as ToastContextData
);
const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = React.useState<ToastMessageProps[]>([]);

  const addToast = React.useCallback<ToastContextData["addToast"]>(
    ({ title, message, click }) => {
      const id = v4();

      const toast = {
        id,
        title,
        message,
        click,
      };

      setMessages((prevState) => {
        return [toast];
      });
    },
    []
  );
  const removeToast = React.useCallback((id: any) => {
    setMessages((oldMessages) =>
      oldMessages.filter((message) => message.id !== id)
    );
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ShowToast messages={messages} />
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within an ToastProvider");
  }

  return context;
}

export { ToastProvider, useToast };
