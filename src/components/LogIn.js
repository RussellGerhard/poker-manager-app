// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
import Error from "./Error";
import { Navigate } from "react-router-dom";
// Contexts
import { AuthContext } from "../contexts/AuthContext";
// Hooks
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

function LogIn() {
  // AuthContext for setting user on login
  var user = useContext(AuthContext)[0];
  var setUser = useContext(AuthContext)[1];

  // State for erro.usernames and locking login during a request
  const [errors, setErrors] = useState([]);
  const [disableLogIn, setDisableLogIn] = useState(false);

  // Set up navigation
  const navigate = useNavigate();

  // Get state (to display info on redirect)
  var { state } = useLocation();

  // Display message if user was redirected from sign up
  if (state) {
    if (state.alertRegistration && state.username) {
      var registrationMessage = (
        <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
          Thanks for signing up, {state.username}!
        </div>
      );
    }

    if (state.alertNoAuth) {
      var noAuthMessage = (
        <div className="my-3 p-3 bg-primary bd-primary-fuzz rounded text-center">
          You must be logged in to view that page
        </div>
      );
    }
  }

  // Error list
  const errorList = errors.map((error) => (
    <Error key={error.param} message={error.msg} />
  ));

  // Function to handle submit
  async function logUserIn(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable login button while request processes
    setDisableLogIn(true);

    // Grab form input
    const email = e.target[0].value;
    const password = e.target[1].value;

    // Send info to backend and await response
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // Wait for response
    const res = await response.json();

    // Re-enable login button
    setDisableLogIn(false);

    // Set errors to be displayed
    if (res.status === "error") {
      setErrors(res.errors);
      return;
    } else {
      // Persist user in broswer storage
      localStorage.setItem("user", JSON.stringify(res.user));
      // Set user state for AuthContext
      setUser(res.user);
      // Redirect to home with router_state so we can display welcome
      // Replace login page in history stack
      navigate("/profile", {
        state: { alertWelcome: true },
        replace: true,
      });
    }
  }

  // Redirect authenticated users and render login to unauthenticated users
  if (user) {
    return <Navigate to="/" state={{ alertAuth: true }} />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-306px">
        {registrationMessage}
        {noAuthMessage}
        {errorList}
        <Container className="my-3 p-3 mw-360px bg-secondary bd-pink-fuzz rounded">
          <Logo wiCurrentdth="150" />
          <Form onSubmit={logUserIn} className="mt-4">
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <div className="mb-1">
              <a className="txt-sm" href="TODO">
                Forgot Password?
              </a>
            </div>

            <Button
              className="w-100 my-3"
              variant="primary"
              type="submit"
              disabled={disableLogIn}
            >
              Log In
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default LogIn;
