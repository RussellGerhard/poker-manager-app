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

function GameForm(props) {
  // Location state
  const { state } = useLocation();
  const game = state ? state.game : null;

  // Refs
  const nameInput = useRef(null);

  // State
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [venmoEnabled, setVenmoEnabled] = useState(
    game ? game.venmoEnabled : false
  );
  const [venmoUsername, setVenmoUsername] = useState(null);

  // Contexts
  const { setErrors } = useErrorContext();

  // Constants
  const navigate = useNavigate();

  // Functions
  function toggleVenmoEnabled() {
    setVenmoEnabled(!venmoEnabled);
  }

  async function getVenmoUsername(e) {
    const response = await fetch("http://localhost:3001/api/venmo_username", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();

    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      setVenmoUsername(res.venmoUsername);
    }
  }

  async function submitGameForm(e) {
    e.preventDefault();

    // Disable create button
    setDisableSubmit(true);

    // Grab name input
    const name = e.target[0].value;
    const game_type = e.target[1].value;
    const stakes = e.target[2].value;
    const max_buyin = e.target[3].value;
    const venmoUsername = venmoEnabled ? e.target[5].value : null;
    const venmoMessage = venmoEnabled ? e.target[6].value : null;
    const gameId = game ? game._id : null;

    // If venmoEnabled, check that venmoUsername is provided
    if (venmoEnabled) {
      if (venmoUsername.trim() === "") {
        setErrors([
          {
            param: "NoBanker",
            msg: "To enable Venmo, please provide the Venmo username of the banker for the game",
          },
        ]);
        setDisableSubmit(false);
        return;
      }
      if (venmoMessage.trim() === "") {
        setErrors([
          {
            param: "NoMessage",
            msg: "To enable Venmo, please provide a message under 50 characters for Venmo requests associated with your game",
          },
        ]);
        setDisableSubmit(false);
        return;
      }
    }

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
        max_buyin,
        venmoEnabled,
        venmoUsername,
        venmoMessage,
        gameId,
      }),
    });

    const res = await response.json();

    // Re-enable button
    setDisableSubmit(false);

    // Set errors if necessary
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate(`/games/${res.gameId}`);
      return;
    }
  }

  // Effects
  useEffect(() => {
    nameInput.current.focus();
  }, []);

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
            ref={nameInput}
            type="text"
            placeholder="Poker Night"
            defaultValue={game?.name ? he.decode(game.name) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="game_type">
          <Form.Label className="mb-1">Game</Form.Label>
          <Form.Control
            type="text"
            placeholder="No Limit Hold Em"
            defaultValue={game?.game_type ? he.decode(game.game_type) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="stakes">
          <Form.Label className="mb-1">Stakes</Form.Label>
          <Form.Control
            type="text"
            placeholder="0.10 / 0.20"
            defaultValue={game?.stakes ? he.decode(game.stakes) : ""}
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="max_buyin">
          <Form.Label className="mb-1">Max Buy-In</Form.Label>
          <Form.Control
            type="text"
            placeholder="Uncapped"
            defaultValue={game?.max_buyin ? he.decode(game.max_buyin) : ""}
          />
          <div className="mb-2 mt-1 txt-sm">* Indicates a required field</div>
        </Form.Group>
        <Form.Group className="" controlId="useVenmo">
          <Form.Label className="mb-1">Enable Venmo</Form.Label>
          <Form.Check
            onChange={(e) => {
              toggleVenmoEnabled();
              if (!venmoUsername) {
                getVenmoUsername(e);
              }
            }}
            className="d-inline-block mx-2"
            checked={venmoEnabled}
          />
        </Form.Group>
        {venmoEnabled && (
          <>
            <Form.Group className="mb-2" controlId="banker_venmo">
              <Form.Label className="mb-1">Banker's Venmo*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Venmo Username"
                defaultValue={
                  game?.bankerVenmo ? he.decode(game.bankerVenmo) : ""
                }
              />
            </Form.Group>
            <div className="txt-xs my-1">
              Using Venmo automates requests after a poker session is cashed
              out. Home Game will <strong>never</strong> automatically pay
              anyone, action is <strong>always</strong> required on the Venmo
              platform.
            </div>
            <Form.Group className="mb-2" controlId="venmo_memo">
              <Form.Label className="mb-1">Venmo Message*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Flowers..."
                defaultValue={
                  game?.venmoMessage ? he.decode(game.venmoMessage) : ""
                }
              />
            </Form.Group>
            <div className="txt-xs my-1">
              Venmo will flag/block requests that mention poker.
            </div>
          </>
        )}

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
