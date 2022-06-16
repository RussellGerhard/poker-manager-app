// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAuthContext } from "../contexts/AuthContext";

function ChangeUsername() {
  // Refs
  const usernameInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Constants
  const navigate = useNavigate();

  // Contexts
  const { setUser } = useAuthContext();
  const { setErrors } = useErrorContext();

  // Functions
  async function changeUsername(e) {
    e.preventDefault();
    setDisableSubmit(true);

    const new_username = e.target[0].value;
    const new_username_conf = e.target[1].value;

    if (new_username !== new_username_conf) {
      setErrors([
        {
          value: new_username_conf,
          msg: "Username does not match confirmation",
          param: "new_username_conf",
          location: "body",
        },
      ]);
      setDisableSubmit(false);
      return;
    }

    const response = await fetch("http://localhost:3001/api/change_username", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: new_username,
      }),
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setUser(res.user);
      navigate("/profile", {
        state: {
          alert: "Username updated successfully",
        },
      });
    }
  }

  // Effects
  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  return (
    <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center mb-3">Change Username</h3>
      <Form onSubmit={changeUsername}>
        <Form.Group className="mb-3" controlId="new-username">
          <Form.Label>New Username</Form.Label>
          <Form.Control
            ref={usernameInput}
            type="text"
            placeholder="Poker_Fan123"
          />
          <div className="txt-xs m-1 mb-0">
            Use letters, numbers, and underscores
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="new-username-confirm">
          <Form.Label>Comfirm Username</Form.Label>
          <Form.Control type="text" placeholder="Poker_Fan123" />
        </Form.Group>

        <Button
          className="w-100 "
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        >
          Change Username
        </Button>
      </Form>
    </Container>
  );
}

export default ChangeUsername;
