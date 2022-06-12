// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
import Alert from "./Alert";
import { Navigate } from "react-router-dom";
// Hooks
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

function LogIn() {
  // Location state
  const { state } = useLocation();
  window.history.replaceState({}, "");

  // State
  const [errors, setErrors] = useState([]);
  const [alerts, setAlerts] = useState(state ? state.alerts : []);
  const [disableLogIn, setDisableLogIn] = useState(false);

  // Context
  const { user, setUser } = useAuthContext();

  // Constants
  const navigate = useNavigate();

  // Functions // TODO REWRITE??
  async function logUserIn(e) {
    // Prevent page refresh
    e.preventDefault();

    // Remove alerts
    if (state) {
      state.alerts = [];
    }

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
            {
              message: `Welcome back, ${res.user.username}!`,
              key: "welcomeBack",
            },
          ],
        },
        replace: true,
      });
    }
  }

  function handleAlertRemove(key) {
    const newAlerts = state.alerts.filter((alert) => alert.key !== key);

    setAlerts(newAlerts);
  }

  function handleErrorRemove(key) {
    const newErrors = errors.filter((error) => error.param !== key);

    setErrors(newErrors);
  }

  // Optional JSX for render
  var alertList = alerts.map((alert) => (
    <Alert
      key={alert.key}
      warning={false}
      message={alert.message}
      onClose={() => handleAlertRemove(alert.key)}
    />
  ));

  const errorList = errors.map((error) => (
    <Alert
      key={error.param}
      warning={true}
      message={error.msg}
      onClose={() => handleErrorRemove(error.param)}
    />
  ));

  // Redirect authed users
  if (user) {
    return (
      <Navigate
        to="/"
        state={{
          alerts: [
            {
              message: "You are already logged in!",
              key: "alreadyAuthedAlert",
            },
          ],
        }}
      />
    );
  }

  // Render
  return (
    <>
      {errorList}
      {alertList}
      <div className="w-360px">
        <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
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

            <div className="m-1 mt-0">
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
    </>
  );
}

export default LogIn;
