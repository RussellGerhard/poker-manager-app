// Components
import Container from "react-bootstrap/Container";
import { Navigate } from "react-router-dom";
// Contexts
import { AuthContext } from "../contexts/AuthContext";
// Hooks
import { useContext } from "react";
import { useLocation } from "react-router-dom";

function Profile() {
  // AuthContext
  const user = useContext(AuthContext)[0];
  console.log("Profile user", user);

  var { state } = useLocation();

  // Display welcome message if user was redirected from login
  if (state && user) {
    if (state.alertWelcome) {
      var welcomeMessage = (
        <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
          Welcome back, {user.username}!
        </div>
      );
    }
  }

  // Render
  //   if (!user) {
  //     return <Navigate to="/login" state={{ alertNoAuth: true }} />;
  //   }

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        {welcomeMessage}
        <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded"></Container>
      </div>
    </div>
  );
}

export default Profile;
