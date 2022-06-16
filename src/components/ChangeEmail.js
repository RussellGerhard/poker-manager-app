// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";

function ChangeEmail() {
  // Refs
  const emailInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Constants
  const navigate = useNavigate();

  // Contexts
  const { setErrors } = useErrorContext();

  // Functions
  async function changeEmail(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const new_email = e.target[0].value;

    const response = await fetch("http://localhost:3001/api/change_email", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: new_email,
      }),
    });

    const res = await response.json();

    setDisableSubmit(false);

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate("/profile", {
        state: {
          alert: "Email updated successfully",
        },
      });
    }
  }

  // Effects
  useEffect(() => {
    emailInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  return (
    <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Change Email</h3>
      <Form onSubmit={changeEmail}>
        <Form.Group className="mb-3" controlId="new-email">
          <Form.Label>New Email</Form.Label>
          <Form.Control ref={emailInput} type="email" placeholder="New Email" />
        </Form.Group>

        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        >
          Change Email
        </Button>
      </Form>
    </Container>
  );
}

export default ChangeEmail;
