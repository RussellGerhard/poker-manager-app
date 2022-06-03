import { createContext, useContext, useEffect, useState, useMemo } from "react";

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

  // Memoize user
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  providerValue.loading = loading;

  // get user with API call
  useEffect(() => {
    async function loadUser() {
      const response = await fetch(`http://localhost:3001/api/login`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();

      if (res.loggedIn) {
        setUser(res.user);
      }
    }

    loadUser();
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuthContext, AuthContextProvider };
