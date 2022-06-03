// Components
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

// Hooks
import { useAuthContext } from "../contexts/AuthContext";

function PrivateRoute({ children }) {
  const { loading, user } = useAuthContext();

  // In case of refresh, auth context has to check api for user
  if (loading) return <Loading />;

  // Redirect to private route if user, else to login
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
