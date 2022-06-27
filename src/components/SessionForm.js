// Imports
import he from "he";
// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";
// Constants
const { REACT_APP_API_ROOT } = process.env;

function SessionForm(props) {
  // Location state
  const { state } = useLocation();
  const game = state.game;

  // Refs
  const dateInput = useRef();

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Contexts
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function submitSessionForm(e) {
    e.preventDefault();

    // Disable create button
    setDisableSubmit(true);

    // Grab name input
    const date = e.target[0].value;
    const time = e.target[1].value;
    const address = e.target[2].value;
    const gameId = game._id;
    const sessionId = game.session ? game.session._id : null;

    // Send info to backend and await response
    const endpoint =
      props.action === "edit" ? "edit_session" : "create_session";
    const response = await fetch(`${REACT_APP_API_ROOT}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date,
        time,
        address,
        gameId,
        sessionId,
      }),
    });

    const res = await response.json();

    // Re-enable button
    setDisableSubmit(false);

    // Set errors if necessary
    if (res.status === "error") {
      setErrors(res.errors);
      return;
    } else {
      navigate(`/games/${res.gameId}`);
      return;
    }
  }

  // Effects
  useEffect(() => {
    dateInput.current.focus();
  }, []);

  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  // Render
  return (
    <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center">
        {props.action === "create" ? "Create Session" : "Edit Session"}
      </h3>
      <Form onSubmit={submitSessionForm} className="mt-4">
        <Form.Group className="mb-2" controlId="date">
          <Form.Label className="mb-1">Date*</Form.Label>
          <Form.Control
            ref={dateInput}
            type="text"
            placeholder="Every Tuesday"
            defaultValue={game.session ? he.decode(game.session.date) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="time">
          <Form.Label className="mb-1">Start Time*</Form.Label>
          <Form.Control
            type="text"
            placeholder="8:00pm"
            defaultValue={game.session ? he.decode(game.session.time) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-1" controlId="address">
          <Form.Label className="mb-1">Address*</Form.Label>
          <Form.Control
            type="text"
            placeholder="20 W 34th St, New York, NY"
            defaultValue={game.session ? he.decode(game.session.address) : ""}
          />
        </Form.Group>
        <div className="mb-2 txt-sm">* Indicates a required field</div>
        <Button
          className="w-100 mt-2"
          variant="primary"
          type="submit"
          disabled={disableSubmit}
        >
          {props.action === "create" ? "Create" : "Update"}
        </Button>
      </Form>
    </Container>
  );
}

export default SessionForm;
