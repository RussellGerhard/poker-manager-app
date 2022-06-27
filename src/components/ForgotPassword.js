// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function ForgotPassword() {
  //Refs
  const emailInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Context
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Functions
  async function sendPasswordLink(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const email = e.target[0].value;

    if (email === "") {
      setErrors([{ param: "emptyEmailInput", msg: "Email cannot be empty" }]);
      setDisableSubmit(false);
    }

    const response = await fetch(`${REACT_APP_API_ROOT}/send_password_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setAlert("Password reset sent, make sure to check your spam folder!");
    }
    setDisableSubmit(false);
  }

  // Effects
  useEffect(() => {
    emailInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  // Render
  return (
    <Container className="w-360px my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Password Recovery</h3>
      <Form
        onSubmit={(e) => {
          sendPasswordLink(e);
        }}
      >
        <Form.Group className="mb-3" controlId="new-username">
          <Form.Label>Account Email</Form.Label>
          <Form.Control ref={emailInput} type="email" />
        </Form.Group>

        <Button
          className="w-100 "
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        >
          Send Recovery Link
        </Button>
      </Form>
    </Container>
  );
}

export default ForgotPassword;
