import { createContext, useCallback, useContext, useState } from "react";

type Variant = "success" | "error" | "warning";

type AlertContextValue = {
  showAlert: boolean;
  alertMessage: string;
  alertVariant: Variant;
  toggleAlert: (alertMessage: string, alertVariant: Variant, alertDuration?: number) => void;
};
type AlertProviderProps = { children: React.ReactNode };

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const AlertProvider = ({ children }: AlertProviderProps) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState<Variant>("success");

  const toggleAlert = useCallback((alertMessage: string, alertVariant: Variant, alertDuration: number = 3000) => {
    setAlertVariant(alertVariant);
    setAlertMessage(alertMessage);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, alertDuration);
  }, []);

  const value = {
    showAlert,
    alertMessage,
    alertVariant,
    toggleAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

const useAlert = () => {
  const context = useContext(AlertContext);

  if (context === undefined) {
    throw new Error("useAlert must be used within AlertProvider");
  }

  return context;
};

export { AlertProvider, useAlert };
