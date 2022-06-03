// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Error from "./Error";
// Hooks
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateGame() {
  const { user } = useAuthContext();

  // State
  const [disableCreateGame, setDisableCreateGame] = useState(false);
  const [errors, setErrors] = useState([]);

  // Set up navigation
  const navigate = useNavigate();

  // Form errors to display
  const errorList = errors.map((error) => (
    <Error key={error.param} message={error.msg} />
  ));

  // Function to create new game
  async function createNewGame(e) {
    e.preventDefault();

    // Disable create button
    setDisableCreateGame(true);

    // Grab name input
    const name = e.target[0].value;
    const userId = user._id;

    // Send info to backend and await response
    const response = await fetch("http://localhost:3001/api/create_game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        userId,
      }),
    });

    const res = await response.json();

    // Re-enable button
    setDisableCreateGame(false);

    // Set errors if necessary
    if (res.status === "error") {
      setErrors(res.errors);
      return;
    } else {
      navigate("/games", { state: { alertCreateGameSuccess: true } });
      return;
    }
  }

  // Render
  return (
    <div className="d-flex justify-content-center align-items-center cust-min-height">
      <div className="mw-360px">
        {errorList}
        <Container className="my-3 p-3 w-360px bg-secondary bd-pink-fuzz rounded">
          <h3 className="text-center">Create Game</h3>
          <Form onSubmit={createNewGame} className="mt-4">
            <Form.Group className="mb-2" controlId="name">
              <Form.Label className="mb-1">Name*</Form.Label>
              <Form.Control type="text" placeholder="Poker Night" />
            </Form.Group>
            <Form.Group className="mb-2" controlId="game_type">
              <Form.Label className="mb-1">Game Type</Form.Label>
              <Form.Control type="text" placeholder="No Limit Hold'em" />
            </Form.Group>
            <Form.Group className="mb-2" controlId="stakes">
              <Form.Label className="mb-1">Stakes</Form.Label>
              <Form.Control type="text" placeholder="0.10/0.20" />
            </Form.Group>
            <Form.Group className="mb-2" controlId="date">
              <Form.Label className="mb-1">Date</Form.Label>
              <Form.Control type="text" placeholder="Every Tuesday" />
            </Form.Group>
            <Form.Group className="mb-2" controlId="time">
              <Form.Label className="mb-1">Start Time</Form.Label>
              <Form.Control type="text" placeholder="8:00pm" />
            </Form.Group>
            <Form.Group className="mb-1" controlId="address">
              <Form.Label className="mb-1">Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="20 W 34th St, New York, NY"
              />
            </Form.Group>
            <div className="mb-2 txt-sm">* indicates a required field</div>
            <Button
              className="w-100 mt-2"
              variant="primary"
              type="submit"
              disabled={disableCreateGame}
            >
              Create
            </Button>
          </Form>
        </Container>
      </div>
    </div>
  );
}

export default CreateGame;
