import { createContext, useContext, useLayoutEffect, useState } from "react";

// get context
const AuthContext = createContext(null);

// Extract useContext into custom hook
const useAuthContext = () => {
  // get context
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuthContext was used outside of its Provider");
  }

  return context;
};

const AuthContextProvider = ({ children }) => {
  // value for the context
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // get user from local storage
  useLayoutEffect(() => {
    async function loadUser(userId) {
      const response = await fetch(`http://localhost:3001/api/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json;

      setUser(res.user);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      loadUser(userId);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider };
