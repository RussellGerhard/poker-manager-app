// Imports
import he from "he";
// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "./Alert";
// Hooks
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GameForm(props) {
  // State
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [errors, setErrors] = useState([]);

  // Location state
  const { state } = useLocation();
  const game = state ? state.game : null;

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

  // Optional JSX for render
  const errorList = errors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        {errorList}
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
                defaultValue={game ? game.name : ""}
              />
            </Form.Group>
            <Form.Group className="mb-2" controlId="game_type">
              <Form.Label className="mb-1">Game</Form.Label>
              <Form.Control
                type="text"
                placeholder="No Limit Hold Em"
                defaultValue={game ? game.game_type : ""}
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
      </div>
    </div>
  );
}

export default GameForm;
