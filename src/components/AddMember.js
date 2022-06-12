// Components
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Alert from "./Alert";
// Hooks
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AddMember() {
  // State
  const [errors, setErrors] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Location state
  const { state } = useLocation();
  const game = state.game;

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
        gameId: game._id,
      }),
    });

    const res = await response.json();

    // Set errors
    if (res.status === "error") {
      setErrors(res.errors);
    } else {
      navigate(`/games/${game._id}`, {
        state: {
          alerts: [
            {
              message: `Invitation sent to ${username}`,
              key: "gameInviteSent",
            },
          ],
        },
      });
    }

    setDisableSubmit(false);
  }

  // state-based JSX for render
  const errorList = errors.map((error) => (
    <Alert key={error.param} warning={true} message={error.msg} />
  ));

  return (
    <div className="w-360px">
      {errorList}
      <Container className="my-3 p-3 bg-secondary bd-pink-fuzz rounded">
        <h3 className="text-center mb-3">Add Member</h3>
        <Form onSubmit={sumbitAddMember}>
          <Form.Group className="mb-3" controlId="new-username">
            <Form.Label>Member Username</Form.Label>
            <Form.Control type="text" placeholder="Poker_Fan123" />
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
