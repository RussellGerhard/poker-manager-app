// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
import Error from "./Error";
import { Navigate } from "react-router-dom";
// Hooks
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

function LogIn() {
  // State
  const [errors, setErrors] = useState([]);
  const [disableLogIn, setDisableLogIn] = useState(false);

  // Location state
  const { state } = useLocation();

  // Context
  const { user, setUser } = useAuthContext();

  // Constants
  const navigate = useNavigate();

  // Functions // TODO REWRITE??
  async function logUserIn(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable login button while request processes
    setDisableLogIn(true);

    // Grab form input
    const email = e.target[0].value;
    const password = e.target[1].value;

    // Send info to backend and await response
    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      credentials: "include",
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
      setUser(res.user);
      // Redirect to home with router_state so we can display welcome
      // Replace login page in history stack
      navigate("/profile", {
        state: {
          alerts: [
            { message: `Welcome back, ${res.user.username}!`, key: "alert1" },
          ],
        },
        replace: true,
      });
    }
  }

  // Optional JSX for render
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

  const errorList = errors.map((error) => (
    <Error key={error.param} message={error.msg} />
  ));

  // Redirect authed users
  if (user) {
    return <Navigate to="/" state={{ alertAuth: true }} />;
  }

  // Render
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
