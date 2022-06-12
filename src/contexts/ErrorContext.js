import { createContext, useContext, useState } from "react";

// get context
const ErrorContext = createContext(null);

const useErrorContext = () => {
  const context = useContext(ErrorContext);

  if (context === null) {
    throw new Error("useErrorContext was used outside of its Provider");
  }

  return context;
};

const ErrorContextProvider = ({ children }) => {
  // value for the context
  const [errors, setErrors] = useState([]);

  return <ErrorContext.Provider>{children}</ErrorContext.Provider>;
};

export { useErrorContext, ErrorContextProvider };
