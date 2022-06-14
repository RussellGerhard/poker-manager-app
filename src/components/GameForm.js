// Imports
import he from "he";
// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
// Hooks
import { useState, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useErrorContext } from "../contexts/ErrorContext";

function GameForm(props) {
  // Location state
  const { state } = useLocation();
  const game = state ? state.game : null;

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Contexts
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  async function submitGameForm(e) {
    e.preventDefault();

    // Disable create button
    setDisableSubmit(true);

    // Grab name input
    const name = e.target[0].value;
    const game_type = e.target[1].value;
    const stakes = e.target[2].value;
    const date = e.target[3].value;
    const time = e.target[4].value;
    const address = e.target[5].value;
    const gameId = game ? game._id : null;

    // Send info to backend and await response
    const endpoint = props.action === "edit" ? "edit_game" : "create_game";
    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        game_type,
        stakes,
        date,
        time,
        address,
        gameId,
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
  useLayoutEffect(() => {
    setErrors([]);
  }, []);

  // Render
  return (
    <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
      <h3 className="text-center">
        {props.action === "create" ? "Create Game" : "Edit Game"}
      </h3>
      <Form onSubmit={submitGameForm} className="mt-4">
        <Form.Group className="mb-2" controlId="name">
          <Form.Label className="mb-1">Name*</Form.Label>
          <Form.Control
            type="text"
            placeholder="Poker Night"
            defaultValue={game ? he.decode(game.name) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="game_type">
          <Form.Label className="mb-1">Game</Form.Label>
          <Form.Control
            type="text"
            placeholder="No Limit Hold Em"
            defaultValue={game ? he.decode(game.game_type) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="stakes">
          <Form.Label className="mb-1">Stakes</Form.Label>
          <Form.Control
            type="text"
            placeholder="0.10 / 0.20"
            defaultValue={game ? he.decode(game.stakes) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="date">
          <Form.Label className="mb-1">Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Every Tuesday"
            defaultValue={game ? game.date : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="time">
          <Form.Label className="mb-1">Start Time</Form.Label>
          <Form.Control
            type="text"
            placeholder="8:00pm"
            defaultValue={game ? game.time : ""}
          />
        </Form.Group>
        <Form.Group className="mb-1" controlId="address">
          <Form.Label className="mb-1">Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="20 W 34th St, New York, NY"
            defaultValue={game ? game.address : ""}
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

export default GameForm;
