// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
import { Link, Navigate } from "react-router-dom";
// Hooks
import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function LogIn() {
  // Location state
  const { state } = useLocation();

  // State
  const [disableLogIn, setDisableLogIn] = useState(false);

  // Context
  const { user, setUser } = useAuthContext();
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function logUserIn(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable login button while request processes
    setDisableLogIn(true);

    // Grab form input
    const email = e.target[0].value;
    const password = e.target[1].value;

    console.log("here");

    // Send info to backend and await response
    const response = await fetch(`${REACT_APP_API_ROOT}/login`, {
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

    console.log(response);

    // Wait for response
    const res = await response.json();

    // Re-enable login button
    setDisableLogIn(false);

    // Set errors to be displayed
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setUser(res.user);
      // Redirect to home
      // Replace login page in history stack
      navigate("/profile", {
        state: {
          alert: `Welcome back, ${res.user.username}!`,
        },
        replace: true,
      });
    }
  }

  // Effects
  useLayoutEffect(() => {
    if (state) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  // Redirect authed users
  if (user) {
    return (
      <Navigate
        to="/"
        state={{
          alert: "You are already logged in!",
        }}
      />
    );
  }

  // Render
  return (
    <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
      <Logo width="150" />
      <Form onSubmit={logUserIn} className="mt-4">
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Email" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Link className="m-1 mt-0 txt-sm" to="/forgot_password">
          Forgot Password?
        </Link>

        <Button
          className="w-100 mt-3"
          variant="primary"
          type="submit"
          disabled={disableLogIn}
        >
          Log In
        </Button>
      </Form>
    </Container>
  );
}

export default LogIn;
