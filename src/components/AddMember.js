// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";
import { useAlertContext } from "../contexts/AlertContext";

function AddMember() {
  // Location state
  const { state } = useLocation();

  // Refs
  const usernameInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Contexts
  const { setErrors } = useErrorContext();
  const { setAlert } = useAlertContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function sumbitAddMember(e) {
    // Prevent page refresh
    e.preventDefault();

    // Disable form submission
    setDisableSubmit(true);

    // Grab input
    const username = e.target[0].value;

    // Send to backend
    const response = await fetch("http://localhost:3001/api/add_member", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        gameId: state.game._id,
      }),
    });

    const res = await response.json();

    // Set errors
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate(`/games/${state.game._id}`, {
        state: {
          alert: `Invitation sent to ${username}`,
        },
      });
    }

    setDisableSubmit(false);
  }

  // Effects
  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    if (state && state.alert) setAlert(state.alert);
    setErrors([]);
    return () => {
      setAlert(null);
    };
  }, []);

  return (
    <div className="w-360px">
      <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
        <h3 className="text-center mb-3">Add Member</h3>
        <Form onSubmit={sumbitAddMember}>
          <Form.Group className="mb-3" controlId="new-username">
            <Form.Label>Member Username</Form.Label>
            <Form.Control ref={usernameInput} type="text" />
          </Form.Group>

          <Button
            className="w-100"
            variant="primary"
            type="submit"
            disabled={disableSubmit}
          >
            Send Invite
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default AddMember;
