// Components
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";
// Hooks
import { useAuthContext } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

function Profile() {
  // AuthContext
  const { loading, user } = useAuthContext();

  // Get prev location state to display info on redirect
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

  // Wait for context provider to load value
  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ alertNoAuth: true }} />;
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        {welcomeMessage}
        <h2 className="text-primary text-center">{user.username}'s Account</h2>
        <div className="responsive-container">
          <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Notifications</h3>
          </Container>
          <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Account History</h3>
          </Container>
          <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
            <h3 className="text-center">Manage Account</h3>
            <Button className="w-100 my-2">Change Username</Button>
            <Button className="w-100 my-2">Change Password</Button>
            <Button className="w-100 my-2">Change Email</Button>
            <Button className="w-100 my-2 btn-warning hover-warning border-0">
              Delete Account
            </Button>
          </Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;
