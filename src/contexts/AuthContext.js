import { createContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  // value for the context
  const [user, setUser] = useState(null);
  console.log("User Reset from auth provider");

  // get user from local storage
  useEffect(() => {
    const user_string = localStorage.getItem("user");
    if (user_string) {
      const user_object = JSON.parse(user_string);
      setUser(user_object);
    }
  }, []);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
