// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Logo from "./Logo";
import { Navigate } from "react-router-dom";
// Hooks
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function SignUp() {
  // Location state
  const { state } = useLocation();

  // State
  const [disableSignUp, setDisableSignUp] = useState(false);

  // Context
  const { user } = useAuthContext();
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function registerUser(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable signup button while request is made
    setDisableSignUp(true);

    // Grab form input
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const password_conf = e.target[3].value;

    // Send info to backend and await response
    const response = await fetch(`${REACT_APP_API_ROOT}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        password_conf,
      }),
    });

    // Wait for response from backend (JSON data)
    const res = await response.json();

    // Set errors to be displayed
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate("/login", {
        state: { alert: `Thanks for signing up, ${username}` },
      });
    }

    setDisableSignUp(false);
  }

  // Effects
  useLayoutEffect(() => {
    if (state && state.alert) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  // Redirect authed users
  if (user) {
    return <Navigate to="/" state={{ alert: "You are already logged in" }} />;
  }

  // Render
  return (
    <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
      <Logo width="150" />
      <Form onSubmit={registerUser} className="mt-4">
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Username" />
          <div className="txt-xs m-1">
            Use letters, numbers, and underscores
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password-confirm">
          <Form.Label>Comfirm Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
          <div className="txt-xs m-1">
            Use 8 to 20 characters with a mix of letters, numbers, and symbols
          </div>
        </Form.Group>

        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={disableSignUp}
        >
          Sign Up
        </Button>
      </Form>
    </Container>
  );
}

export default SignUp;
