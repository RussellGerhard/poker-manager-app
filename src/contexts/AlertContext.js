import { createContext, useContext, useState } from "react";

// get context
const AlertContext = createContext(null);

const useAlertContext = () => {
  const context = useContext(AlertContext);

  if (context === null) {
    throw new Error("useAlertContext was used outside of its Provider");
  }

  return context;
};

const AlertContextProvider = ({ children }) => {
  // value for the context
  const [alert, setAlert] = useState(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export { useAlertContext, AlertContextProvider };
